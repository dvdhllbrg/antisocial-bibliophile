"use client";

import { useState } from "react";
import BookListPage from "@components/BookListPage";

type BookListProps = {
  baseRoute: string;
  extra?: string;
  params?: Record<string, any>;
  showErrors?: boolean;
};

export default function BookList({
  baseRoute,
  extra,
  params,
  showErrors = true,
}: BookListProps) {
  const [numberOfPages, setNumberOfPages] = useState(1);
  const urlParams = new URLSearchParams(params);

  const onReachingEnd = (page: number) => {
    if (page === numberOfPages) {
      setNumberOfPages(numberOfPages + 1);
    }
  };

  const pages = [];
  for (let i = 0; i < numberOfPages; i += 1) {
    pages.push(
      <BookListPage
        key={i}
        index={i + 1}
        route={`${baseRoute}?page=${i + 1}&${urlParams.toString()}`}
        extra={extra}
        onReachingEnd={onReachingEnd}
        showErrors={showErrors}
      />
    );
  }

  return <article>{pages}</article>;
}
