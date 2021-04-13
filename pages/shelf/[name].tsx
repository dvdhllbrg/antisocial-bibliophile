import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { SortDescendingIcon } from '@heroicons/react/outline';
import isAuthed from '@lib/isAuthed';
import TopAppBar from '@components/TopAppBar';
import BookList from '@components/BookList';

const PER_PAGE = 10;

export default function Shelf() {
  const { query } = useRouter();
  const { name } = query;

  const [showSortMenu, setShowSortMenu] = useState(false);

  let initialSort = 'date_added';
  if (name === 'read') {
    initialSort = 'date_read';
  } else if (name === 'reading') {
    initialSort = 'date-updated';
  }

  return (
    <>
      <Head>
        <link
          rel="preload"
          href={`/api/shelf?shelf=${name}&page=1&per_page=${PER_PAGE}&sort=${initialSort}&order=d`}
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
      <main className={`container mx-auto p-4 transform-gpu transition-all duration-200 ease-out ${showSortMenu ? 'mt-0' : '-mt-24'}`}>
        <section className="max-w-screen-lg">
          <BookList
            baseRoute={`/api/shelf/${name}`}
            perPage={PER_PAGE}
            initialSort={initialSort}
            showSort={showSortMenu}
          />
        </section>
      </main>
    </>
  );
}

export const getServerSideProps = isAuthed();
