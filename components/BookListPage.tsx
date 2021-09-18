import useSWR from 'swr';
import { BookWithReview } from '@custom-types/bookWithReview';
import formatDate from '@lib/formatDate';
import formatNumber from '@lib/formatNumber';
import BookCard from '@components/elements/BookCard';
import Spinner from '@components/elements/Spinner';
import Offline from '@components/Offline';
import SomethingWentWrong from '@components/SomethingWentWrong';

type BookListPageProps = {
  route: string;
  index: number;
  extra?: string;
  isReachingEnd?: (index: number) => void;
  showErrors: boolean;
};

export default function BookListPage({
  route, index, extra = '', isReachingEnd, showErrors,
}: BookListPageProps) {
  const { data: books, error } = useSWR<BookWithReview[]>(route);

  const bookExtra = (book: BookWithReview) => {
    switch (extra) {
      case 'date_read':
        return book.dateRead ? `Read ${formatDate(book.dateRead)}` : 'No read date.';
      case 'date_updated':
        return book.dateUpdated ? `Updated ${formatDate(book.dateUpdated)}` : 'No updated date.';
      case 'date_added':
        return book.dateAdded ? `added ${formatDate(book.dateAdded)}` : 'No added date.';
      case 'year_pub':
        return `First published in ${book.year || 'an unknown year'}`;
      case 'avg_rating':
        return `Goodreads rating: ${formatNumber(book.rating || 0)}`;
      case 'rating':
        return `My rating: ${formatNumber(book.myRating || 0)}`;
      default:
        return '';
    }
  };

  const bookCardIsVisible = (i: number) => {
    if (isReachingEnd && books && i === 0) {
      isReachingEnd(index);
    }
  };

  if (error) {
    if (showErrors) {
      return navigator.onLine ? <SomethingWentWrong /> : <Offline />;
    } else {
      return <></>;
    }
  }

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
          isVisible={() => bookCardIsVisible(i)}
        />
      ))}
    </>
  );
}
