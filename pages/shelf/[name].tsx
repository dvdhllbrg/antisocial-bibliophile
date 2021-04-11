import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSWRInfinite, mutate } from 'swr';
import Head from 'next/head';
import { Book } from '@custom-types/book';
import formatDate from '@lib/formatDate';
import isAuthed from '@lib/isAuthed';
import useOnScreen from '@hooks/useOnScreen';
import TopAppBar from '@components/TopAppBar'
import BookCard from '@components/elements/BookCard';

const PAGE_SIZE = 20;

const getKey = (pageIndex: number, previousPageData: Book[], params: any) => {
  if (previousPageData && !previousPageData.length) {
    return null;
  }
  const { shelf, pageSize, sort, sortOrder, } = params;
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

  const [sort, setSort] = useState('date_added');
  const [sortOrder, setSortOrder] = useState('d');
  const [showSortMenu, setShowSortMenu] = useState(true);

  useEffect(() => {
    let initialSort = 'date_added';
    if (name === 'read') {
      initialSort = 'date_read';
    } else if (name === 'reading') {
      initialSort = 'date-updated';
    }

    setSort(initialSort);
  }, [])
  
  const { data: shelf, error, size, setSize, isValidating } = useSWRInfinite<Book[]>(
    (...args) => getKey(...args, {
      shelf: name,
      pageSize: PAGE_SIZE,
      sort,
      sortOrder,
    })
  );
  const books = shelf ? [].concat(...shelf) : []
  const isLoadingInitialData = !shelf && !error
  const isLoadingMore = (size > 0 && shelf && typeof shelf[size - 1] === 'undefined')
  const isEmpty = shelf?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (shelf && shelf[shelf.length - 1]?.length < PAGE_SIZE);
  const isRefreshing = isValidating && shelf && shelf.length === size;

  useEffect(() => {
    if (loaderIsVisible && !isReachingEnd && !isRefreshing) {
      setSize(size + 1)
    }
  }, [loaderIsVisible, isRefreshing])

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
        extra={`Read at ${formatDate(book.dateRead)}`}
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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
          </svg>
        </button>
      </TopAppBar>
      {showSortMenu && (
        <div className="w-full bg-white p-4">
          <label>
            Sort by
            <select
              className="w-full bg-white border-b border-gray-500 text-gray-800 p-2 pl-0 outline-none"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map(
                (so) => (
                  <option
                    key={so.value}
                    value={so.value}>
                      {so.label}
                    </option>
                ),
              )}
            </select>
          </label>
        </div>
      )}
      <main className="container mx-auto p-4">
        <section className="max-w-screen-lg">
          { content }
          <div ref={loader}>
            {isLoadingMore && (
              <div className="flex flex-col justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
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
