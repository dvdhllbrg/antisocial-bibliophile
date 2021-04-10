import { useRouter } from 'next/router';
import useSWR, { SWRResponse } from 'swr';
import Image from 'next/image';
import { Author as AuthorType } from '@custom-types/author';
import { Book } from '@custom-types/book';
import formatDate from '@lib/formatDate';
import BookCard from '@components/elements/BookCard';

export default function Author() {
  const { query } = useRouter();
  const { id } = query;
  const { data: author, error: authorError }: SWRResponse<AuthorType, Error> = useSWR(`/api/author/${id}`);
  const { data: books, error: booksError } = useSWR(`/api/author/${id}/books`);

  let bookContent: {};
  let authorContent: {};

  if (authorError || booksError) {
    return <div>failed to load</div>;
  }

  if (!author ) {
    authorContent = (
      <>
        <section className="flex justify-center">
          <div className="w-[80px] h-[80px] rounded-full bg-gray-200 animate-pulse" />
          <div className="ml-3">
            <div className="h-7 w-48 mb-3 mt-2 bg-gray-200 animate-pulse" />
            <span className="inline-block ml-2 h-4 w-36 bg-gray-200 animate-pulse" />
          </div>
        </section>
        <section>
          <div className="h-96 w-full mb-3 mt-2 bg-gray-200 animate-pulse" />
        </section>
      </>
    );
  } else {
    authorContent = (
      <>
        <section className="flex justify-center">
          <Image
            src={author.image}
            width={80}
            height={80}
            layout="fixed"
            className="rounded-full object-cover"
          />
          <div className="ml-3">
            <h1 className="mb-1 mt-2 text-2xl">{ author.name }</h1>
            <a href={author.url}>Open on Goodreads</a>
          </div>
        </section>
        <section
          className="prose mt-4"
          dangerouslySetInnerHTML={{ __html: author.description }}
        />
      </>
    );
  }

  if (!books) {
    bookContent = (
      <>
        <BookCard skeleton />
        <BookCard skeleton />
        <BookCard skeleton />
        <BookCard skeleton />
        <BookCard skeleton />
      </>
    );
  } else {
    bookContent = books && books.books && books.books.length && books.books.map((book: Book) => (
      <BookCard
        key={book.id}
        book={book}
      />
    ));
  }

  return (
    <>
      { authorContent }
      <section className="mt-4">
        <h2 className="mb-1 mt-2 text-xl">Books</h2>
        <article className="max-w-screen-lg">
          { bookContent }
        </article>
      </section>
  </>
  );
}
