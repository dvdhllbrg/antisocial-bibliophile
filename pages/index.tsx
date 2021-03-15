import { useEffect, useState } from 'react';
import useSWR from 'swr';
import isAuthed from '../lib/isAuthed';

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
              <a
                href={`/shelf/${shelf.name}`}
                key={shelf.id}
                className="flex border-b hover:bg-gray-300 no-underline font-normal justify-between p-4"
              >
                <span>{ shelf.name }</span>
                <span>{ shelf.count }</span>
              </a>
            ))}
      </article>
      <article>
        <h2>Tags</h2>
        { tags.length
            && tags.map((tag) => (
              <a
                key={tag.id}
                href={`/shelf/${tag.name}`}
                className="bg-gray-200 hover:bg-gray-300 border-3 border-red-600 inline-block rounded-full m-1 p-2 text-sm no-underline font-normal whitespace-nowrap"
              >
                { tag.name }
                &nbsp;
                (
                { tag.count }
                )
              </a>
            ))}
      </article>
    </section>
  );
}

export const getServerSideProps = isAuthed();
