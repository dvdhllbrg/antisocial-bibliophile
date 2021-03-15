import { useRouter } from 'next/router';
import useSWR from 'swr';
import Image from 'next/image';
import { Book } from '../../types/book';
import formatDate from '../../lib/formatDate';

export default function Shelf() {
  const { query } = useRouter();
  const { name } = query;
  const { data: shelf, error } = useSWR(`/api/shelf?shelf=${name}`);

  let content: {};
  if (error) {
    content = <div>failed to load</div>;
  } else if (!shelf) {
    content = [...Array(5)].map(() => (
      <div className="flex bg-white h-36 w-full rounded shadow mb-4">
        <div className="animate-pulse bg-gray-200 w-36" />
        <div className="w-full px-4">
          <div className="h-7 w-full mb-3 mt-2 bg-gray-200 animate-pulse" />
          by
          <span className="inline-block ml-2 h-4 w-5/6 bg-gray-200 animate-pulse" />
          Read at
          <span className="inline-block ml-2 h-4 w-1/2 bg-gray-200 animate-pulse mt-2" />
        </div>
      </div>
    ));
  } else {
    content = shelf.books && shelf.books.length
        && shelf.books.map((book: Book) => (
          <a
            href={`/book/${book.id}`}
            key={book.id}
            className="flex rounded overflow-y-hidden shadow mb-4 bg-white hover:bg-gray-100 no-underline font-normal"
          >
            <div className="-mb-2">
              <Image
                src={book.image}
                width={98}
                height={147}
                layout="fixed"
                className="rounded-l"
              />
            </div>
            <div className="pl-4">
              <h2 className="mb-1 mt-2 text-lg font-semibold">{ book.title }</h2>
              <span>
                by
                {' '}
                { book.authors.map((a) => a.name).join(', ') }
              </span>
              <br />
              <span>
                Read at
                {' '}
                { formatDate(book.dateRead) }
              </span>
            </div>
          </a>
        ));
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
