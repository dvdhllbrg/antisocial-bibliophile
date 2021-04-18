import {
  useEffect, useState, useRef, ChangeEvent,
} from 'react';
import { mutate } from 'swr';
import Spinner from '@components/elements/Spinner';
import { Shelf } from '@custom-types/shelf';
import useOnClickOutside from '@hooks/useOnClickOutside';
import useUser from '@hooks/swr/useUser';
import useBook from '@hooks/swr/useBook';

const PER_PAGE = 10;

type BookShelfProps = {
  show: boolean;
  bookId: string;
  onDrawerClose: () => void;
};

export default function BookShelfDrawer({
  show, bookId, onDrawerClose,
}: BookShelfProps) {
  const ref = useRef(null);

  useOnClickOutside(ref, onDrawerClose);

  const { user, isError, mutate: mutateUser } = useUser();
  const { book, mutate: mutateBook } = useBook(bookId);
  const [shelf, setShelf] = useState<Shelf | undefined>(undefined);
  const [tags, setTags] = useState<Shelf[]>([]);

  useEffect(() => {
    if (!book || !book.shelves) {
      return;
    }
    const mainShelf = book.shelves.find((s) => s.main);
    const newTags = book.shelves.filter((s) => !s.main);
    setShelf(mainShelf);
    setTags(newTags);
  }, [book]);

  const handleShelfChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const shelfName = e.target.value;
    const newShelf = user?.shelves.find((s) => s.name === shelfName);
    const toReadShelf = user?.shelves.find((s) => s.name === 'to-read');

    if (!book?.shelves || !newShelf) {
      return;
    }

    let localShelves = [...book.shelves];

    if (e.target.checked) {
      if (newShelf.main) {
        const mainShelfIndex = localShelves.findIndex((s) => s.main);
        localShelves.splice(mainShelfIndex, 1, newShelf);
      } else {
        localShelves.push(newShelf);
      }
      if (toReadShelf && (!shelf || !newShelf.main)) {
        localShelves.push(toReadShelf);
      }
    } else {
      const shelfIndex = localShelves.findIndex((s) => s.name === newShelf.name);
      if (newShelf.main) {
        localShelves = [];
      } else if (shelfIndex > -1) {
        localShelves.splice(shelfIndex, 1);
      }
    }

    mutateBook({
      ...book,
      shelves: localShelves,
    }, false);

    let sort = 'date_added';
    const sortOrder = 'd';
    if (shelfName === 'read') {
      sort = 'date_read';
    } else if (shelfName === 'currently-reading') {
      sort = 'date_updated';
    }

    if (!shelf && !newShelf?.main) {
      await fetch(`/api/shelf/to-read?book_id=${bookId}`, {
        method: 'PATCH',
        body: '',
      });
      mutate(`/api/shelf/to-read?page=1&per_page=${PER_PAGE}&sort=${sort}&order=${sortOrder}`);
    }

    await fetch(`/api/shelf/${shelfName}?book_id=${bookId}${e.target.checked ? '' : '&remove=1'}`, {
      method: 'PATCH',
      body: '',
    });
    mutate(`/api/shelf/${shelfName}?page=1&per_page=${PER_PAGE}&sort=${sort}&order=${sortOrder}`);
    mutateUser();
  };

  const removeFromShelves = () => handleShelfChange({
    target: {
      value: shelf?.name,
      checked: false,
    },
  } as ChangeEvent<HTMLInputElement>);

  if (isError) {
    return <div>failed to load</div>;
  }

  let content = <Spinner text="Loading shelves..." />;

  if (user) {
    content = (
      <div className="flex text-lg">
        <div className="w-1/2 flex flex-col pr-2">
          <span className="font-bold">Shelf</span>
          {user.shelves.filter((s) => s.main).map((s) => (
            <label className="mb-2">
              <input
                type="radio"
                name="shelf"
                value={s.name}
                checked={shelf && s.name === shelf.name}
                onChange={handleShelfChange}
              />
              {' '}
              { s.name }
            </label>
          ))}
          <button
            type="button"
            onClick={removeFromShelves}
            className="mt-2 text-sm uppercase bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded w-full"
          >
            Remove completely
          </button>
        </div>
        <div className="w-1/2 flex flex-col pl-2">
          <span className="font-bold">Tags</span>
          {user.shelves.filter((s) => !s.main).map((tag) => (
            <label className="mb-2">
              <input
                type="checkbox"
                name="tags"
                value={tag.name}
                checked={tags.findIndex((t) => t.name === tag.name) !== -1}
                onChange={handleShelfChange}
              />
              {' '}
              { tag.name }
            </label>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      { show && <div className="bg-black z-40 fixed top-0 right-0 bottom-0 left-0 opacity-50" /> }
      <article
        ref={ref}
        className={`bg-white w-full z-50 fixed bottom-0 p-4 transition-transform duration-200 ease-out transform-gpu ${show ? '' : 'translate-y-full'}`}
      >
        { content }
      </article>
    </>
  );
}
