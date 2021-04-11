import { useRouter } from 'next/router';
import Head from 'next/head';
import useSWR, { SWRResponse } from 'swr';
import Image from 'next/image';
import { Author as AuthorType } from '@custom-types/author';
import { Book } from '@custom-types/book';
import TopAppBar from '@components/TopAppBar';
import BookCard from '@components/elements/BookCard';

export default function Author() {
  const { query } = useRouter();
  const { id } = query;
  const { data: author, error: authorError }: SWRResponse<AuthorType, Error> = useSWR(`/api/author/${id}`);
  const { data: authorBooks, error: booksError } = useSWR(`/api/author/${id}/books`);

  let authorBooksContent: {};
  let authorContent: {};

  if (authorError || booksError) {
    return <div>failed to load</div>;
  }

  if (!author) {
    authorContent = (
      <div className="h-96 w-full mb-3 mt-2 bg-gray-200 animate-pulse" />
    );
  } else {
    authorContent = (
      <section>
        <div className="float-left mr-4">
          <Image
            src={author.image}
            width={127}
            height={177}
            layout="fixed"
            className="object-cover"
          />
        </div>
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: author.description }}
        />
      </section>
    );
  }

  if (!authorBooks) {
    authorBooksContent = (
      <>
        <BookCard skeleton />
        <BookCard skeleton />
        <BookCard skeleton />
        <BookCard skeleton />
        <BookCard skeleton />
      </>
    );
  } else {
    authorBooksContent = authorBooks && authorBooks.books && authorBooks.books.length && authorBooks.books.map((book: Book) => (
      <BookCard
        key={book.id}
        book={book}
      />
    ));
  }

  return (
    <>
      <Head>
        <link
          rel="preload"
          href={`/api/author/${id}`}
          as="fetch"
          crossOrigin="anonymous"
        />
      </Head>
      <TopAppBar title={author?.name ||'Loading ...'} />
      <main className="container mx-auto p-4">
        { authorContent }
        <section className="mt-4 clear-both">
          <h2 className="mb-1 mt-2 text-xl">Books</h2>
          <article className="max-w-screen-lg">
            { authorBooksContent }
          </article>
        </section>
      </main>
  </>
  );
}
