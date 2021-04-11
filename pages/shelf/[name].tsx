import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Book } from '@custom-types/book';
import formatDate from '@lib/formatDate';
import isAuthed from '@lib/isAuthed';
import TopAppBar from '@components/TopAppBar'
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
      <TopAppBar title={name as string}>
        <button
          type="button"
          className="p-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
          </svg>
        </button>
      </TopAppBar>
      <main className="container mx-auto p-4">
        <article className="max-w-screen-lg">
          { content }
        </article>
      </main>
    </>
  );
}

export const getServerSideProps = isAuthed();
