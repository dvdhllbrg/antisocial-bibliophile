import Head from "next/head";
import Link from "next/link";
import TopAppBar from "@components/TopAppBar";
import { Book } from "@custom-types/book";
import { Review } from "@custom-types/review";
import BookShelves from "@components/elements/BookShelves";
import ImageWithModal from "@components/elements/ImageWithModal";
import { cookies } from "next/headers";
import BookRatings from "@components/elements/BookRatings";

const getBook = async (bokId: string) => {
  const res = await fetch(`${process.env.APP_URL}/api/book/${bokId}`);
  return res.json() as Promise<Book>;
};

const getReview = async (bookId: string) => {
  const cookieHeader = cookies()
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
  const res = await fetch(`${process.env.APP_URL}/api/book/${bookId}/review`, {
    headers: {
      Cookie: cookieHeader,
    },
    next: {
      revalidate: 1800,
    },
  });
  return res.json() as Promise<Review | undefined>;
};

type BookPageProps = {
  params: {
    id: string;
  };
};

const BookPage = async ({ params }: BookPageProps) => {
  const book = await getBook(params.id);
  const review = await getReview(params.id);

  const pageTitle = `${book && book.title} | ${
    book?.authors && book.authors[0]?.name
  } | Antisocial Bibliophile`;

  return (
    <>
      <Head>
        <title key="title">{pageTitle}</title>
      </Head>
      <TopAppBar title={book?.title || "Loading book..."} />
      <main className="container mx-auto p-4 pb-24">
        <section className="grid grid-cols-3">
          <ImageWithModal src={book.image || "/cover.png"} />
          <div className="col-span-2">
            <span className="text-xl">
              {book.authors?.map((a, i) => (
                <span key={a.id}>
                  <Link href={`/author/${a.id}`}>
                    {`${a.name}${a.role ? ` (${a.role.toLowerCase()})` : ""}`}
                  </Link>
                  {i < (book.authors?.length || 0) - 1 ? ", " : ""}
                </span>
              )) || "unknown"}
            </span>
            <br />
            {/* @ts-expect-error Server Component */}
            <BookShelves review={review} bookId={params.id} />
          </div>
        </section>
        <BookRatings book={book} review={review} />
        <section
          className="mt-4 prose dark:prose-light"
          dangerouslySetInnerHTML={{ __html: book.description || "" }}
        />
        <section className="mt-6">
          <small>
            {book.pages} pages ⋅ first published in{" "}
            {book.year || "an unknown year"}
            {" ⋅ "}
            ISBN {book.isbn}
            {" ⋅ "}
            <a href={book.url} target="_blank" rel="noreferrer">
              Open on Goodreads
            </a>
          </small>
        </section>
      </main>
    </>
  );
};

export default BookPage;
