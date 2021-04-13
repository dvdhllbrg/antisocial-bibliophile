import { forwardRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Book } from '@custom-types/book';

type BookCardProp = {
  book: Book;
  extra?: string;
  skeleton?: never;
};

type SkeletonBookCardProp = {
  skeleton: boolean;
  book?: never;
  extra?: never;
};

type BookCardProps = BookCardProp | SkeletonBookCardProp;

const BookCard = forwardRef<HTMLAnchorElement, BookCardProps>(({
  book, extra = '', skeleton = false,
}: BookCardProps, ref) => {
  if (skeleton) {
    return (
      <div className="flex bg-white h-36 w-full rounded shadow mb-4">
        <div className="animate-pulse bg-gray-200 w-36" />
        <div className="w-full px-4">
          <div className="h-7 w-full mb-3 mt-2 bg-gray-200 animate-pulse" />
          by
          <span className="inline-block ml-2 h-4 w-5/6 bg-gray-200 animate-pulse" />
          { extra && <span className="inline-block ml-2 h-4 w-1/2 bg-gray-200 animate-pulse mt-2" /> }
        </div>
      </div>
    );
  }
  if (!book) {
    return <></>;
  }
  return (
    <Link
      href={`/book/${book.id}`}
      key={book.id}
    >
      <a
        className="flex rounded overflow-y-hidden shadow mb-4 bg-white hover:bg-gray-100 no-underline font-normal"
        ref={ref}
      >
        <div className="-mb-2">
          <Image
            src={book.image || '/cover.png'}
            width={98}
            height={147}
            layout="fixed"
            className="rounded-l object-cover"
          />
        </div>
        <div className="pl-4">
          <h2 className="mb-1 mt-2 text-lg font-semibold">{ book.title }</h2>
          <span>
            by
            {' '}
            { book.authors?.map((a) => a.name).join(', ') || 'unknown' }
          </span>
          <br />
          <span>{ extra }</span>
        </div>
      </a>
    </Link>
  );
});

export default BookCard;
