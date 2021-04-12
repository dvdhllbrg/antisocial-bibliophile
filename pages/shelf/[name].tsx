import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useSWRInfinite } from 'swr';
import { SortDescendingIcon } from '@heroicons/react/outline';
import { Book } from '@custom-types/book';
import formatDate from '@lib/formatDate';
import isAuthed from '@lib/isAuthed';
import useOnScreen from '@hooks/useOnScreen';
import TopAppBar from '@components/TopAppBar';
import BookCard from '@components/elements/BookCard';

const PAGE_SIZE = 10;

const getKey = (pageIndex: number, previousPageData: Book[] | null, params: any) => {
  if (previousPageData && !previousPageData.length) {
    return null;
  }
  const {
    shelf, pageSize, sort, sortOrder,
  } = params;
  return `/api/shelf?shelf=${shelf}&page=${pageIndex + 1}&per_page=${pageSize}&sort=${sort}&order=${sortOrder}`;
};

const SORT_OPTIONS = [
  { label: 'Date read', value: 'date_read' },
  { label: 'Date updated', value: 'date_updated' },
  { label: 'Date added', value: 'date_added' },
  { label: 'Title', value: 'title' },
  { label: 'Author', value: 'author' },
  { label: 'First published', value: 'year_pub' },
  { label: 'Goodreads rating', value: 'avg_rating' },
  { label: 'My rating', value: 'rating' },
];

export default function Shelf() {
  const { query } = useRouter();
  const { name } = query;
  const loader = useRef(null);
  const loaderIsVisible = useOnScreen(loader);

  const [sort, setSort] = useState('');
  const [sortOrder, setSortOrder] = useState('d');
  const [showSortMenu, setShowSortMenu] = useState(false);

  if (!sort) {
    let initialSort = 'date_added';
    if (name === 'read') {
      initialSort = 'date_read';
    } else if (name === 'reading') {
      initialSort = 'date-updated';
    }

    setSort(initialSort);
  }

  const {
    data: shelf, error, size, setSize, isValidating,
  } = useSWRInfinite<Book[]>(
    (...args) => getKey(...args, {
      shelf: name,
      pageSize: PAGE_SIZE,
      sort,
      sortOrder,
    }),
  );
  const books = shelf ? ([] as Book[]).concat(...shelf) : [];
  const isLoadingInitialData = !shelf && !error;
  const isLoadingMore = (size > 0 && shelf && typeof shelf[size - 1] === 'undefined');
  const isEmpty = shelf?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (shelf && shelf[shelf.length - 1]?.length < PAGE_SIZE);
  const isRefreshing = isValidating && shelf && shelf.length === size;

  useEffect(() => {
    if (loaderIsVisible && !isReachingEnd && !isRefreshing) {
      setSize(size + 1);
    }
  }, [loaderIsVisible, isRefreshing]);

  const bookExtra = (book: Book) => {
    switch (sort) {
      case 'date_read':
        return book.dateRead ? `Read ${formatDate(book.dateRead)}` : 'No read date.';
      case 'date_updated':
        return book.dateUpdated ? `Updated ${formatDate(book.dateUpdated)}` : 'No updated date.';
      case 'date_added':
        return book.dateAdded ? `added ${formatDate(book.dateAdded)}` : 'No added date.';
      case 'year_pub':
        return `First published in ${book.year || 'an unknown year'}`;
      case 'avg_rating':
        return `Goodreads rating: ${book.rating}`;
      case 'rating':
        return `My rating: ${book.myRating}`;
      default:
        return '';
    }
  };

  let content: {};
  if (error) {
    content = <div>failed to load</div>;
  } else if (isLoadingInitialData) {
    content = (
      <>
        <BookCard skeleton />
        <BookCard skeleton />
        <BookCard skeleton />
        <BookCard skeleton />
        <BookCard skeleton />
        <BookCard skeleton />
        <BookCard skeleton />
      </>
    );
  } else {
    content = books.map((book) => (
      <BookCard
        key={book.id}
        book={book}
        extra={bookExtra(book)}
      />
    ));
  }
  return (
    <>
      <Head>
        <link
          rel="preload"
          href={`/api/shelf?shelf=${name}&page=1&per_page=${PAGE_SIZE}&sort=${sort}&order=${sortOrder}`}
          as="fetch"
          crossOrigin="anonymous"
        />
      </Head>
      <TopAppBar title={name as string}>
        <button
          type="button"
          className="p-4"
          onClick={() => setShowSortMenu(!showSortMenu)}
        >
          <SortDescendingIcon className="h-6 w-6" />
        </button>
      </TopAppBar>
      <div className={`w-full bg-white p-4 transform-gpu transition-transform duration-200 ease-out ${showSortMenu ? '' : '-translate-y-full'}`}>
        <label
          htmlFor="sort_by"
          className="text-xs text-gray-600"
        >
          Sort by
        </label>
        <div className="flex items-center">
          <select
            id="sort_by"
            className="bg-white flex-grow border-b border-gray-500 text-gray-800 p-2 pl-0 outline-none"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map(
              (so) => (
                <option
                  key={so.value}
                  value={so.value}
                >
                  {so.label}
                </option>
              ),
            )}
          </select>
          <div className="flex flex-col ml-4">
            <label>
              <input
                type="radio"
                name="sort_direction"
                value="d"
                checked={sortOrder === 'd'}
                onChange={() => setSortOrder('d')}
              />
              {' '}
              Descending
            </label>
            <label>
              <input
                type="radio"
                name="sort_direction"
                value="a"
                checked={sortOrder === 'a'}
                onChange={() => setSortOrder('a')}
              />
              {' '}
              Ascending
            </label>
          </div>
        </div>
      </div>
      <main className={`container mx-auto p-4 transform-gpu transition-all duration-200 ease-out ${showSortMenu ? 'mt-0' : '-mt-24'}`}>
        <section className="max-w-screen-lg">
          { content }
          <div ref={loader}>
            {isLoadingMore && (
              <div className="flex flex-col justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900" />
                Loading more
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export const getServerSideProps = isAuthed();
