/* eslint-disable camelcase */
import type { Author } from '@custom-types/author';
import type { Book } from '@custom-types/book';
import authorReducer, { AuthorPropType } from '@reducers/authorReducer';

export type BookPropType = {
  id?: string | {_: string};
  title?: string;
  description?: string;
  authors?: { author: AuthorPropType };
  image_url?: string;
  small_image_url?: string;
  average_rating?: number;
  ratings_count?: number;
  num_pages?: number;
  isbn13?: string;
  isbn?: string;
  url?: string;
  work?: { original_publication_year?: {_: string}; }
  publication_year?: string;
};

export default function shelfReducer(book: BookPropType): Book {
  let authors: Author[] = [];
  if (book.authors && book.authors.author) {
    authors = Array.isArray(book.authors.author)
      ? book.authors.author.map(authorReducer)
      : [authorReducer(book.authors.author)];
  }
  let year = null;
  if (book.work && book.work.original_publication_year) {
    year = parseInt(book.work.original_publication_year._, 10);
  } else if (book.publication_year) {
    year = parseInt(book.publication_year, 10);
  }
  return {
    id: typeof book.id === 'object' ? book.id._ : book.id,
    title: book.title || '',
    description: book.description,
    authors,
    image: book.image_url || '',
    thumbnail: book.small_image_url || '',
    rating: book.average_rating || 0,
    numberOfRatings: book.ratings_count || 0,
    year,
    pages: book.num_pages || 0,
    isbn: book.isbn13 || book.isbn || '',
    url: book.url || '',
  };
}
