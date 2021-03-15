import Image from 'next/image';
import { Book } from '../types/book';

type BookCardProps = {
    book?: Book;
    skeleton?: boolean;
    extra?: string;
};

export default function BookCard({ book, extra = '', skeleton = false }: BookCardProps) {
  if (skeleton) {
    return (
      <div className="flex bg-white h-36 w-full rounded shadow mb-4">
        <div className="animate-pulse bg-gray-200 w-36" />
        <div className="w-full px-4">
          <div className="h-7 w-full mb-3 mt-2 bg-gray-200 animate-pulse" />
          by
          <span className="inline-block ml-2 h-4 w-5/6 bg-gray-200 animate-pulse" />
          Read at
          <span className="inline-block ml-2 h-4 w-1/2 bg-gray-200 animate-pulse mt-2" />
        </div>
      </div>
    );
  }
  return (
    <a
      href={`/book/${book.id}`}
      key={book.id}
      className="flex rounded overflow-y-hidden shadow mb-4 bg-white hover:bg-gray-100 no-underline font-normal"
    >
      <div className="-mb-2">
        <Image
          src={book.image}
          width={98}
          height={147}
          layout="fixed"
          className="rounded-l"
        />
      </div>
      <div className="pl-4">
        <h2 className="mb-1 mt-2 text-lg font-semibold">{ book.title }</h2>
        <span>
          by
          {' '}
          { book.authors.map((a) => a.name).join(', ') }
        </span>
        <br />
        <span>{ extra }</span>
      </div>
    </a>
  );
}
