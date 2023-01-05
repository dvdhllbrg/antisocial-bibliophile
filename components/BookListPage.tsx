"use client";

import { BookWithReview } from "@custom-types/bookWithReview";
import formatDate from "@lib/formatDate";
import formatNumber from "@lib/formatNumber";
import BookCard from "@components/elements/BookCard";
import Spinner from "@components/elements/Spinner";
import { useEffect, useState } from "react";

type BookListPageProps = {
  route: string;
  index: number;
  extra?: string;
  onReachingEnd?: (index: number) => void;
  showErrors: boolean;
};

const BookListPage = ({
  route,
  index,
  extra = "",
  onReachingEnd,
}: BookListPageProps) => {
  const [books, setBooks] = useState<BookWithReview[]>();

  useEffect(() => {
    const loadBooks = async () => {
      const res = await fetch(route);
      const loadedBooks = await res.json();
      setBooks(loadedBooks);
    };
    loadBooks();
  }, [route]);

  const bookExtra = (book: BookWithReview) => {
    switch (extra) {
      case "date_read":
        return book.dateRead
          ? `Read ${formatDate(book.dateRead)}`
          : "No read date.";
      case "date_updated":
        return book.dateUpdated
          ? `Updated ${formatDate(book.dateUpdated)}`
          : "No updated date.";
      case "date_added":
        return book.dateAdded
          ? `added ${formatDate(book.dateAdded)}`
          : "No added date.";
      case "year_pub":
        return `First published in ${book.year || "an unknown year"}`;
      case "avg_rating":
        return `Goodreads rating: ${formatNumber(book.rating || 0)}`;
      case "rating":
        return `My rating: ${formatNumber(book.myRating || 0)}`;
      default:
        return "";
    }
  };

  const bookCardIsVisible = (i: number) => {
    if (onReachingEnd && books && i === 0) {
      onReachingEnd(index);
    }
  };

  if (!books) {
    if (index === 1) {
      return (
        <>
          <BookCard skeleton />
          <BookCard skeleton />
          <BookCard skeleton />
          <BookCard skeleton />
          <BookCard skeleton />
          <BookCard skeleton />
          <BookCard skeleton />
          <BookCard skeleton />
          <BookCard skeleton />
          <BookCard skeleton />
        </>
      );
    }
    return <Spinner text="Loading more ..." />;
  }

  return (
    <>
      {books.map((book, i) => (
        <BookCard
          key={book.id}
          book={book}
          extra={bookExtra(book)}
          onCardIsVisible={() => bookCardIsVisible(i)}
        />
      ))}
    </>
  );
};

export default BookListPage;
