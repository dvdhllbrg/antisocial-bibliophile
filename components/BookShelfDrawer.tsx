import { useEffect, useState } from 'react';
import useSWR from 'swr';
import formatDate from '@lib/formatDate';
import formatNumber from '@lib/formatNumber';
import BookCard from '@components/elements/BookCard';
import Spinner from '@components/elements/Spinner';
import { Shelf } from '@custom-types/shelf';
import { User } from '@custom-types/user';

type BookShelfProps = {
  show: boolean;
  bookId: string;
  shelf: string;
  tags: string[];
  updateShelves: (args: any) => void;
  onDrawerClose: () => void;
};

export default function BookShelf({
  show, bookId, shelf, tags, updateShelves, onDrawerClose,
}: BookShelfProps) {
  const { data: me, error } = useSWR<User>('/api/me');
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [allTags, setAllTags] = useState<Shelf[]>([]);

  console.log(shelves, allTags)

  useEffect(() => {
    setShelves(me ? me?.shelves.filter((s) => s.main) : []);
    setAllTags(me ? me.shelves.filter((s) => !s.main) : []);
  }, [me]);

  const setShelf = (shelfName: string) => {
    console.log(shelfName);
  }

  const addTag = (tag: string) => {
    console.log(tag);
  }

  if (error) {
    return <div>failed to load</div>;
  }

  let content =  <Spinner text="Loading shelves..." />;

  if(me) {
    content = (
      <div className="flex text-lg">
        <div className="w-1/2 flex flex-col pr-2">
          <span className="font-bold">Shelf</span>
          {shelves.map((s) => (
            <label className="mb-2">
              <input
                type="radio"
                name="shelf"
                value={s.name}
                checked={s.name === shelf}
                onChange={(e) => setShelf(e.target.value)}
              />
              {' '}
              { s.name }
          </label>
          ))}
          <button
            type="button"
            className="mt-2 text-sm uppercase bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded w-full"
          >
            Remove completely
          </button>
        </div>
        <div className="w-1/2 flex flex-col pl-2">
          <span className="font-bold">Tags</span>
          {allTags.map((t) => (
            <label className="mb-2">
              <input
                type="checkbox"
                name="tags"
                value={t.name}
                checked={tags.includes(t.name)}
                onChange={(e) => addTag(e.target.value)}
              />
              {' '}
              { t.name }
          </label>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      { show && <div className="bg-black z-40 fixed top-0 right-0 bottom-0 left-0 opacity-50" /> }
      <article className={`bg-white z-50 sticky bottom-0 p-4 transition-transform duration-200 ease-out transform-gpu ${show ? '' : 'translate-y-full'}`}>
        { content }
      </article>
    </>
  );
}
