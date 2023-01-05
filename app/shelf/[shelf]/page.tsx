"use client";

import { useState } from "react";
import Head from "next/head";
import { BarsArrowDownIcon } from "@heroicons/react/24/outline";
import TopAppBar from "@components/TopAppBar";
import BookList from "@components/BookList";
import SortMenu from "@components/SortMenu";

const PER_PAGE = 10;
type ShelfPageProps = {
  params: { shelf: string };
};
export default function ShelfPage({ params }: ShelfPageProps) {
  const { shelf } = params;

  const [sort, setSort] = useState("");
  const [sortOrder, setSortOrder] = useState("d");
  const [showSortMenu, setShowSortMenu] = useState(false);

  if (!sort) {
    let initialSort = "date_added";
    if (shelf === "read") {
      initialSort = "date_read";
    } else if (shelf === "currently-reading") {
      initialSort = "date_updated";
    }

    setSort(initialSort);
  }

  const pageTitle = `${shelf} | Antisocial Bibliophile`;

  return (
    <>
      <Head>
        <title key="title">{pageTitle}</title>
      </Head>
      <TopAppBar title={shelf}>
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
          baseRoute={`${process.env.NEXT_PUBLIC_APP_URL}/api/shelf/${shelf}`}
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
