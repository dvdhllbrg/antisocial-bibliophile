import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSWRInfinite } from 'swr';
import Head from 'next/head';
import { Book } from '@custom-types/book';
import formatDate from '@lib/formatDate';
import isAuthed from '@lib/isAuthed';
import useOnScreen from '@hooks/useOnScreen';
import TopAppBar from '@components/TopAppBar'
import BookCard from '@components/elements/BookCard';

const PAGE_SIZE = 20;

const getKey = (pageIndex: number, previousPageData: Book[], shelf: string, pageSize: number) => {
  if (previousPageData && !previousPageData.length) {
    return null;
  }
  return `/api/shelf?shelf=${shelf}&page=${pageIndex + 1}&per_page=${pageSize}`;
};

export default function Shelf() {
  const { query } = useRouter();
  const { name } = query;
  const loader = useRef(null);
  const isVisible = useOnScreen(loader);
  
  const { data: shelf, error, size, setSize, isValidating } = useSWRInfinite<Book[]>(
    (...args) => getKey(...args, name as string, PAGE_SIZE)
  );
  const books = shelf ? [].concat(...shelf) : []
  const isLoadingInitialData = !shelf && !error
  const isLoadingMore = (size > 0 && shelf && typeof shelf[size - 1] === 'undefined')
  const isEmpty = shelf?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (shelf && shelf[shelf.length - 1]?.length < PAGE_SIZE);
  const isRefreshing = isValidating && shelf && shelf.length === size;

  useEffect(() => {
    if (isVisible && !isReachingEnd && !isRefreshing) {
      setSize(size + 1)
    }
  }, [isVisible, isRefreshing])

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
          href={`/api/shelf?shelf=${name}&page=1&per_page=${PAGE_SIZE}`}
          as="fetch"
          crossOrigin="anonymous"
        />
      </Head>
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
