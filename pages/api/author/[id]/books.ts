/* eslint-disable @typescript-eslint/naming-convention */
import type { NextApiRequest, NextApiResponse } from 'next';
import { get } from '@lib/goodreads';
import { Book } from '@custom-types/book';
import bookReducer from '@reducers/bookReducer';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, page, per_page } = req.query;
  if (id === 'undefined') {
    res.status(400).send('id not set');
    return;
  }
  try {
    const { author } = await get('/author/list', {
      id: `${id}`,
      page: page ? `${page}` : '1',
      per_page: per_page ? `${per_page}` : '10',
    });
    let books: Book[];
    if (author.books.start === '0') {
      books = [];
    } else if (Array.isArray(author.books.book)) {
      books = author.books.book.map(bookReducer);
    } else {
      books = [bookReducer(author.books.book)];
    }
    books = books.filter((b) => b.authors?.some((a) => a.id === author.id));

    res.status(200).json(books);
  } catch (err) {
    res.status(500).json(`Unable to find books for author ${id}.`);
  }
};

export const config = {
  api: {
    externalResolver: true,
  },
};
