import type { Author } from '@custom-types/author';
import type { Shelf } from '@custom-types/shelf';

export type Book = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  thumbnail?: string;
  authors?: Author[];
  rating?: number;
  numberOfRatings?: number;
  myRating?: number;
  shelves?: Shelf[];
  dateRead?: string;
  dateAdded?: string;
  dateUpdated?: string;
  year?: number;
  pages?: number;
  isbn?: string;
  url?: string;
};
