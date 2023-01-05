"use client";

import { useState, useRef } from "react";
import useUser from "@hooks/swr/useUser";
import useOnClickOutside from "@hooks/useOnClickOutside";

export default function NewShelfDrawer() {
  const ref = useRef(null);
  useOnClickOutside(ref, () => {
    setShow(false);
  });

  const { user, mutate } = useUser();

  const [show, setShow] = useState(false);
  const [shelfType, setShelfType] = useState("tag");
  const [shelfName, setShelfName] = useState("");

  const createShelf = async () => {
    if (!user?.shelves || !user?.tags) {
      return;
    }
    const shelves = [...user.shelves];
    const tags = [...user.tags];
    const newShelf = {
      id: "-1",
      name: shelfName,
      count: 0,
    };

    if (shelfType === "shelf") {
      shelves.push({
        ...newShelf,
        main: shelfType === "shelf",
      });
    } else {
      tags.push({
        ...newShelf,
        main: shelfType === "shelf",
      });
    }

    mutate(
      {
        ...user,
        shelves,
        tags,
      },
      false
    );
    fetch(
      `/api/shelf/${shelfName}?main=${
        shelfType === "shelf" ? "true" : "false"
      }`,
      {
        method: "POST",
        body: "",
      }
    );
    setShelfType("tag");
    setShelfName("");
    setShow(false);
  };

  return (
    <>
      <button
        type="button"
        className="w-full border py-2 text-sm border-gray-800 dark:border-white uppercase"
        onClick={() => setShow(true)}
      >
        Create a new tag or shelf
      </button>
      {show && (
        <>
          <div className="bg-black z-40 fixed top-0 right-0 bottom-0 left-0 opacity-50" />
          <article
            ref={ref}
            className={`bg-white dark:bg-gray-900 w-full z-50 fixed bottom-0 left-0 p-4 transition-transform duration-200 ease-out transform-gpu ${
              show ? "" : "translate-y-full"
            }`}
          >
            <div className="text-lg">
              <p className="mb-6">
                <span className="">Type</span>
                <label className="ml-4">
                  <input
                    type="radio"
                    name="shelf_type"
                    value="tag"
                    checked={shelfType === "tag"}
                    onChange={() => setShelfType("tag")}
                  />{" "}
                  Tag
                </label>
                <label className="ml-4">
                  <input
                    type="radio"
                    name="shelf_type"
                    value="shelf"
                    checked={shelfType === "shelf"}
                    onChange={() => setShelfType("shelf")}
                  />{" "}
                  Shelf
                </label>
              </p>
              <p className="text-sm leading-tight mb-6">
                {shelfType === "tag"
                  ? "Books can have as many tags as you like. You can create tags like magic-realism, african-writers or female-protagonist."
                  : "Books can only be on one shelf at a time. The default shelves are to-read, currently-reading, and read."}
              </p>
              <div className="mb-6">
                <input
                  className="w-full p-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                  placeholder="Shelf name"
                  onChange={(e) => setShelfName(e.target.value)}
                  value={shelfName}
                />
                <p className="text-sm leading-tight mt-1">
                  Names are all lowercase and without whitespace.
                </p>
              </div>
              <button
                type="button"
                className="uppercase bg-primary dark:bg-dark-primary hover:bg-secondary dark:hover:bg-dark-secondary text-white text-sm font-semibold py-2 px-4 rounded w-full sm:w-auto"
                onClick={createShelf}
              >
                Create new {shelfType}
              </button>
            </div>
          </article>
        </>
      )}
    </>
  );
}
