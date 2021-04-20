import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import isAuthed from '@lib/isAuthed';
import Chip from '@components/elements/Chip';
import TopAppBar from '@components/TopAppBar';
import NewShelfDrawer from '@components/NewShelfDrawer';
import useUser from '@hooks/swr/useUser';

export default function Home() {
  const { user, isError } = useUser();
  const [showNewShelfDrawer, setShowNewShelfDrawer] = useState(false);

  let shelvesContent = (
    <>
      <div className="animate-pulse bg-gray-200 h-12 w-full mb-4" />
      <div className="animate-pulse bg-gray-200 h-12 w-full mb-4" />
      <div className="animate-pulse bg-gray-200 h-12 w-full mb-4" />
    </>
  );
  let tagsContent = (
    <>
      <Chip
        skeleton
        size="large"
      />
      <Chip
        skeleton
        size="large"
      />
    </>
  );

  if (isError) {
    shelvesContent = <div>failed to load</div>;
  } else if (user) {
    shelvesContent = (
      <>
        { user.shelves.map((shelf) => (
          <Link
            href={`/shelf/${shelf.name}`}
            key={shelf.id}
          >
            <a className="flex border-b hover:bg-gray-300 no-underline font-normal justify-between p-4">
              <span>{ shelf.name }</span>
              <span>{ shelf.count }</span>
            </a>
          </Link>
        ))}
      </>
    );
    tagsContent = (
      <>
        { user.tags?.map((tag) => (
          <Chip
            key={tag.id}
            href={`/shelf/${tag.name}`}
            label={`${tag.name} (${tag.count})`}
            size="large"
          />
        ))}
      </>
    );
  }

  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/api/me"
          as="fetch"
          crossOrigin="anonymous"
        />
      </Head>
      <TopAppBar title="My shelves" />
      <main className="container mx-auto p-4">
        <section>
          <h2 className="mt-0 mb-2 text-2xl font-bold">Main</h2>
          { shelvesContent }
        </section>
        <section>
          <h2 className="mt-6 mb-4 text-2xl font-bold">Tags</h2>
          { tagsContent }
        </section>
        <section className="mt-6">
          <button
            type="button"
            className="w-full border py-2 text-sm border-gray-800 uppercase"
            onClick={() => setShowNewShelfDrawer(true)}
          >
            Create a new tag or shelf
          </button>
        </section>
      </main>
      <NewShelfDrawer
        show={showNewShelfDrawer}
        onDrawerClose={() => setShowNewShelfDrawer(false)}
      />
    </>
  );
}

export const getServerSideProps = isAuthed();
