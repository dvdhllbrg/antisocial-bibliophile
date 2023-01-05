"use client";

import { useState, useRef, ChangeEvent } from "react";
import useOnClickOutside from "@hooks/useOnClickOutside";
import { PencilIcon } from "@heroicons/react/20/solid";
import { Review } from "@custom-types/review";
import { User } from "@custom-types/user";

const PER_PAGE = 10;

const revalidate = (path: string) => {
  fetch("/api/revalidate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ path }),
  });
};

type BookShelfDrawerProps = {
  bookId: string;
  user: User;
  review: Review;
};

export default function BookShelfDrawer({
  bookId,
  user,
  review,
}: BookShelfDrawerProps) {
  const ref = useRef<HTMLElement>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [shelf, setShelf] = useState(review.shelf);
  const [tags, setTags] = useState(review.tags ?? []);
  useOnClickOutside(ref, () => setShowDrawer(false));

  const handleShelfChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!review || !user?.shelves || !user?.tags) {
      return;
    }
    const shelfName = e.target.value;
    const newShelf = [...user.shelves, ...user.tags].find(
      (s) => s.name === shelfName
    );
    const toReadShelf = user?.shelves.find((s) => s.name === "to-read");

    if (!newShelf) {
      return;
    }

    let localShelf = shelf;
    let localTags = [...tags];

    if (e.target.checked) {
      if (newShelf.main) {
        localShelf = newShelf;
      } else {
        localTags.push(newShelf);
      }
      if (toReadShelf && !shelf) {
        localShelf = toReadShelf;
      }
    } else {
      const tagIndex = localTags.findIndex((t) => t.name === newShelf.name);
      if (newShelf.main) {
        localShelf = undefined;
        localTags = [];
      } else if (tagIndex > -1) {
        localTags.splice(tagIndex, 1);
      }
    }

    setShelf(localShelf);
    setTags(localTags);

    let sort = "date_added";
    const sortOrder = "d";
    if (shelfName === "read") {
      sort = "date_read";
    } else if (shelfName === "currently-reading") {
      sort = "date_updated";
    }

    if (!shelf && !newShelf?.main) {
      await fetch(`/api/shelf/to-read?book_id=${bookId}`, {
        method: "PATCH",
        body: "",
      });
      fetch(
        `/api/shelf/to-read?page=1&per_page=${PER_PAGE}&sort=${sort}&order=${sortOrder}`,
        { cache: "reload" }
      );
    }

    await fetch(
      `/api/shelf/${shelfName}?book_id=${bookId}${
        e.target.checked ? "" : "&remove=1"
      }`,
      {
        method: "PATCH",
        body: "",
      }
    );
    fetch(
      `/api/shelf/${shelfName}?page=1&per_page=${PER_PAGE}&sort=${sort}&order=${sortOrder}`,
      { cache: "reload" }
    );
    revalidate("/");
    revalidate(`/book/${bookId}`);
  };

  const removeFromShelves = () =>
    handleShelfChange({
      target: {
        value: shelf?.name,
        checked: false,
      },
    } as ChangeEvent<HTMLInputElement>);

  return (
    <>
      <button type="button" onClick={() => setShowDrawer(true)}>
        <PencilIcon className="h-6 w-6" />
      </button>
      {showDrawer && (
        <div className="bg-black z-40 fixed top-0 right-0 bottom-0 left-0 opacity-50" />
      )}
      <article
        ref={ref}
        className={`bg-white dark:bg-gray-900 w-full z-50 fixed left-0 bottom-0 p-4 transition-transform duration-200 ease-out transform-gpu ${
          showDrawer ? "" : "translate-y-full"
        }`}
      >
        <div className="flex text-lg">
          <div className="w-1/2 flex flex-col pr-2">
            <span className="font-bold">Shelf</span>
            {user.shelves.map((s) => (
              <label key={s.id} className="mb-2">
                <input
                  type="radio"
                  name="shelf"
                  value={s.name}
                  checked={s.name === shelf?.name}
                  onChange={handleShelfChange}
                />{" "}
                {s.name}
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
            {user.tags?.map((tag) => (
              <label key={tag.id} className="mb-2">
                <input
                  type="checkbox"
                  name="tags"
                  value={tag.name}
                  checked={tags.findIndex((t) => t.name === tag.name) !== -1}
                  onChange={handleShelfChange}
                />{" "}
                {tag.name}
              </label>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}
