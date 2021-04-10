import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Book } from '@custom-types/book';
import formatDate from '@lib/formatDate';
import isAuthed from '@lib/isAuthed';
import TopNavBar from '@components/TopNavBar'
import BookCard from '@components/elements/BookCard';

export default function Shelf() {
  const { query } = useRouter();
  const { name } = query;
  const { data: shelf, error } = useSWR(`/api/shelf?shelf=${name}`);

  let content: {};
  if (error) {
    content = <div>failed to load</div>;
  } else if (!shelf) {
    content = (
      <>
        <BookCard skeleton />
        <BookCard skeleton />
        <BookCard skeleton />
        <BookCard skeleton />
        <BookCard skeleton />
      </>
    );
  } else {
    content = shelf.books && shelf.books.length && shelf.books.map((book: Book) => (
      <BookCard
        key={book.id}
        book={book}
        extra={`Read at ${formatDate(book.dateRead)}`}
      />
    ));
  }
  return (
    <>
      <TopNavBar title={name as string}>
        <button
          type="button"
          className="p-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
          </svg>
        </button>
      </TopNavBar>
      <main className="container mx-auto p-4">
        <article className="max-w-screen-lg">
          { content }
        </article>
      </main>
    </>
  );
}

export const getServerSideProps = isAuthed();
