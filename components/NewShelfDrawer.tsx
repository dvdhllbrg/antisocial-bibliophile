import { useState, useRef } from 'react';
import useUser from '@hooks/swr/useUser';
import useOnClickOutside from '@hooks/useOnClickOutside';

type NewShelfDrawerProps = {
  show: boolean;
  onDrawerClose: () => void;
};

export default function NewShelfDrawer({ show, onDrawerClose }: NewShelfDrawerProps) {
  const ref = useRef(null);
  useOnClickOutside(ref, onDrawerClose);

  const { user, mutate } = useUser();

  const [shelfType, setShelfType] = useState('tag');
  const [shelfName, setShelfName] = useState('');

  const createShelf = async () => {
    if (!user?.shelves) {
      return;
    }
    const shelves = [...user.shelves, {
      id: '-1',
      name: shelfName,
      main: shelfType === 'shelf',
      count: 0,
    }];

    mutate({
      ...user,
      shelves,
    });
    fetch(`/api/shelf/${shelfName}?main=${shelfType === 'shelf' ? 'true' : 'false'}`, {
      method: 'POST',
      body: '',
    });
    setShelfType('tag');
    setShelfName('');
    onDrawerClose();
  };

  return (
    <>
      { show && <div className="bg-black z-40 fixed top-0 right-0 bottom-0 left-0 opacity-50" /> }
      <article
        ref={ref}
        className={`bg-white w-full z-50 fixed bottom-0 p-4 transition-transform duration-200 ease-out transform-gpu ${show ? '' : 'translate-y-full'}`}
      >
        <div className="text-lg">
          <p className="mb-6">
            <span className="text-gray-600">Type</span>
            <label className="ml-4">
              <input
                type="radio"
                name="shelf_type"
                value="tag"
                checked={shelfType === 'tag'}
                onChange={() => setShelfType('tag')}
              />
              {' '}
              Tag
            </label>
            <label className="ml-4">
              <input
                type="radio"
                name="shelf_type"
                value="shelf"
                checked={shelfType === 'shelf'}
                onChange={() => setShelfType('shelf')}
              />
              {' '}
              Shelf
            </label>
          </p>
          <p className="text-sm text-gray-600 leading-tight mb-6">
            { shelfType === 'tag'
              ? 'Books can have as many tags as you like. You can create tags like magic-realism, african-writers or female-protagonist.'
              : 'Books can only be on one shelf at a time. The default shelves are to-read, currently-reading, and read.'}
          </p>
          <div className="mb-6">
            <input
              className="w-full p-2 rounded border border-gray-200 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Shelf name"
              onChange={(e) => setShelfName(e.target.value)}
              value={shelfName}
            />
            <p className="text-sm text-gray-500 leading-tight mt-1">Names are all lowercase and without whitespace.</p>
          </div>
          <button
            type="button"
            className="uppercase bg-blue-800 hover:bg-blue-900 text-white text-sm font-semibold py-2 px-4 rounded w-full sm:w-auto"
            onClick={createShelf}
          >
            Create new
            {' '}
            { shelfType }
          </button>
        </div>
      </article>
    </>
  );
}
