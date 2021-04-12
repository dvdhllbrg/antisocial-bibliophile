import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Head from 'next/head';
import Link from 'next/link';
import isAuthed from '@lib/isAuthed';
import Chip from '@components/elements/Chip';
import TopAppBar from '@components/TopAppBar';
import { Shelf } from '@custom-types/shelf';
import { User } from '@custom-types/user';

export default function Home() {
  const { data: me, error } = useSWR<User>('/api/me');
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [tags, setTags] = useState<Shelf[]>([]);

  useEffect(() => {
    setShelves(me ? me?.shelves.filter((s) => s.main) : []);
    setTags(me ? me.shelves.filter((s) => !s.main) : []);
  }, [me]);

  if (error) {
    return <div>failed to load</div>;
  }
  if (!me) {
    return <div>loading...</div>;
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
        <article>
          <h2 className="mt-0 mb-2 text-2xl font-bold">Main</h2>
          { shelves.length
              && shelves.map((shelf) => (
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
        </article>
        <article>
          <h2 className="mt-6 mb-4 text-2xl font-bold">Tags</h2>
          { tags.length
              && tags.map((tag) => (
                <Chip
                  key={tag.id}
                  href={`/shelf/${tag.name}`}
                  label={`${tag.name} (${tag.count})`}
                  size="large"
                />
              ))}
        </article>
      </main>
      <section>
        <button
          type="button"
          className="w-full border-gray-800 uppercase"
        >
          Create a new tag or shelf
        </button>
      </section>
    </>
  );
}

export const getServerSideProps = isAuthed();
