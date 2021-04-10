import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import isAuthed from '@lib/isAuthed';
import Chip from '@components/elements/Chip';

export default function Home() {
  const { data: me, error } = useSWR('/api/me');
  const [shelves, setShelves] = useState([]);
  const [tags, setTags] = useState([]);

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
    <section className="prose">
      <h1>Shelves</h1>
      <article>
        <h2 className="">Main</h2>
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
        <h2>Tags</h2>
        { tags.length
            && tags.map((tag) => (
              <Chip
                key={tag.id}
                href={`/shelf/${tag.name}`}
                label={`${tag.name} (${tag.count})`}
              />
            ))}
      </article>
    </section>
  );
}

export const getServerSideProps = isAuthed();
