import { useState } from 'react';
import BookListPage from '@components/BookListPage';
import SortMenu from '@components/SortMenu';

type BookListProps = {
  baseRoute: string;
  perPage?: number;
  initialSort?: string;
  showSort?: boolean;
};

export default function BookList({
  baseRoute, perPage = 10, initialSort = 'd', showSort = false,
}: BookListProps) {
  const [numberOfPages, setNumberOfPages] = useState(1);

  const [sort, setSort] = useState(initialSort);
  const [sortOrder, setSortOrder] = useState('d');

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
      <SortMenu
        show={showSort}
        sort={sort}
        setSort={setSort}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      { pages }
    </>
  );
}
