import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { SortDescendingIcon } from '@heroicons/react/outline';
import isAuthed from '@lib/isAuthed';
import useOnScreen from '@hooks/useOnScreen';
import TopAppBar from '@components/TopAppBar';
import BookList, { PAGE_SIZE } from '@components/BookList';
import SortMenu from '@components/SortMenu';

export default function Shelf() {
  const { query } = useRouter();
  const { name } = query;
  const loader = useRef(null);
  const loaderIsVisible = useOnScreen(loader);

  const [sort, setSort] = useState('');
  const [sortOrder, setSortOrder] = useState('d');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [page, setPage] = useState(1);

  if (!sort) {
    let initialSort = 'date_added';
    if (name === 'read') {
      initialSort = 'date_read';
    } else if (name === 'reading') {
      initialSort = 'date-updated';
    }

    setSort(initialSort);
  }

  useEffect(() => {
    if (loaderIsVisible) {
      setPage(page + 1);
    }
  }, [loaderIsVisible]);

  const books = [];
  for (let i = 0; i < page; i += 1) {
    books.push(
      <BookList
        shelf={name as string}
        index={page}
        sort={sort}
        sortOrder={sortOrder}
      />,
    );
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
      <SortMenu
        show={showSortMenu}
        sort={sort}
        setSort={setSort}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      <main className={`container mx-auto p-4 transform-gpu transition-all duration-200 ease-out ${showSortMenu ? 'mt-0' : '-mt-24'}`}>
        <section className="max-w-screen-lg">
          { books }
          <div ref={loader} />
        </section>
      </main>
    </>
  );
}

export const getServerSideProps = isAuthed();
