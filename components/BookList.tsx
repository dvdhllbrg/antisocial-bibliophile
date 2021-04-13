import { useEffect } from 'react';
import useSWR from 'swr';
import { Book } from '@custom-types/book';
import formatDate from '@lib/formatDate';
import formatNumber from '@lib/formatNumber';
import BookCard from '@components/elements/BookCard';

type BookListProps = {
  route: string;
  index: number;
  extra?: string;
  onLoaded?: () => void;
};

export default function BookList({
  route, index, extra = '', onLoaded,
}: BookListProps) {
  const { data: books, error, isValidating } = useSWR<Book[]>(route);

  const bookExtra = (book: Book) => {
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

  if (onLoaded) {
    useEffect(() => {
      if (!isValidating) {
        onLoaded();
      }
    }, [isValidating]);
  }

  if (error) {
    return <div>failed to load</div>;
  }

  if (isValidating) {
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
        </>
      );
    }
    return (
      <div className="flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900" />
        Loading more...
      </div>
    );
  }

  return (
    <>
      {books?.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          extra={bookExtra(book)}
        />
      ))}
    </>
  );
}
