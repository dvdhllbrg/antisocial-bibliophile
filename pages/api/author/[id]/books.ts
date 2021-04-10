import type { NextApiRequest, NextApiResponse } from 'next';
import { get } from '@lib/goodreads';
import { Book } from '@custom-types/book';
import bookReducer from '@reducers/bookReducer';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, page } = req.query;
  const { author } = await get(`/author/list`, {
    id,
    page: page || '1',
  });
  let books: Book[];
  if (author.books.start === '0') {
    books = [];
  } else if (Array.isArray(author.books.book)) {
    books = author.books.book.map(bookReducer)
  } else {
    books = [bookReducer(author.books.book)];
  }
  books = books.map((book) => {
    const b = JSON.parse(JSON.stringify(book));
    if (!b.authors.some((a) => a.id === author.id)) {
      b.authors = [{ name: author.name }, ...b.authors];
    }
    return b;
  });
  const hasMore = author.books.end !== author.books.total && author.books.start !== '0';

  res.status(200).json({
    page: page || 1,
    hasMore,
    books,
  });
};

export const config = {
  api: {
    externalResolver: true,
  },
};
