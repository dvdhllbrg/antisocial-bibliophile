import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { BarsArrowDownIcon } from "@heroicons/react/24/outline";
import TopAppBar from "@components/TopAppBar";
import BookList from "@components/BookList";
import SortMenu from "@components/SortMenu";
import useUser from "@hooks/swr/useUser";

export const PER_PAGE = 10;

export default function Shelf() {
  const { query } = useRouter();
  const { name } = query;
  useUser();

  const [sort, setSort] = useState("");
  const [sortOrder, setSortOrder] = useState("d");
  const [showSortMenu, setShowSortMenu] = useState(false);

  if (!sort) {
    let initialSort = "date_added";
    if (name === "read") {
      initialSort = "date_read";
    } else if (name === "currently-reading") {
      initialSort = "date_updated";
    }

    setSort(initialSort);
  }

  const pageTitle = `${name} | Antisocial Bibliophile`;

  return (
    <>
      <Head>
        <title key="title">{pageTitle}</title>
        <link
          rel="preload"
          href={`/api/shelf/${name}?page=1&per_page=${PER_PAGE}&sort=${sort}&order=${sortOrder}`}
          as="fetch"
          crossOrigin="anonymous"
        />
      </Head>
      <TopAppBar title={name?.toString()}>
        <button
          type="button"
          className="p-4"
          onClick={() => setShowSortMenu(!showSortMenu)}
        >
          <BarsArrowDownIcon className="h-6 w-6" />
        </button>
      </TopAppBar>
      <SortMenu
        show={showSortMenu}
        sort={sort}
        setSort={setSort}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      <main
        className={`container mx-auto p-4 transform-gpu transition-all duration-200 ease-out ${
          showSortMenu ? "mt-0" : "-mt-24"
        }`}
      >
        <BookList
          baseRoute={`/api/shelf/${name}`}
          extra={sort}
          params={{
            per_page: PER_PAGE,
            sort,
            order: sortOrder,
          }}
        />
      </main>
    </>
  );
}
