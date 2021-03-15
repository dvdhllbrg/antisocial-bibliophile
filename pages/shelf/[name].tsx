import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Book } from '../../types/book';
import formatDate from '../../lib/formatDate';
import isAuthed from '../../lib/isAuthed';
import BookCard from '../../components/elements/BookCard';

export default function Shelf() {
  const { query } = useRouter();
  const { name } = query;
  const { data: shelf, error } = useSWR(`/api/shelf?shelf=${name}`);

  let content: {};
  if (error) {
    content = <div>failed to load</div>;
  } else if (!shelf) {
    content = [...Array(5)].map(() => <BookCard skeleton />);
  } else {
    content = shelf.books && shelf.books.length && shelf.books.map((book: Book) => <BookCard book={book} extra={`Read at ${formatDate(book.dateRead)}`} />);
  }
  return (
    <section>
      <div className="prose flex justify-between items-baseline max-w-full">
        <h1>
          Shelf:
          {' '}
          { name }
        </h1>
        <button
          type="button"
          className="w-10 h-10 border border-gray-400 rounded p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
          </svg>
        </button>
      </div>
      <article className="max-w-screen-lg">
        { content }
      </article>
    </section>
  );
}

export const getServerSideProps = isAuthed();
