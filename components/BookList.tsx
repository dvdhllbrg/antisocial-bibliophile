import { useState } from 'react';
import BookListPage from '@components/BookListPage';

type BookListProps = {
  baseRoute: string;
  sort?: string;
  sortOrder?: string;
  perPage?: number;
};

export default function BookList({
  baseRoute, sort, sortOrder, perPage = 10,
}: BookListProps) {
  const [numberOfPages, setNumberOfPages] = useState(1);

  const isReachingEnd = (page: number) => {
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
        route={`${baseRoute}?page=${i + 1}&per_page=${perPage}&sort=${sort}&order=${sortOrder}`}
        extra={sort}
        isReachingEnd={isReachingEnd}
      />,
    );
  }

  return (
    <>
      { pages }
    </>
  );
}
