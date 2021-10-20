import type { Author } from '@custom-types/author';

export type Book = {
  id: string;
  title: string;
  description?: string;
  image: string;
  thumbnail: string;
  authors?: Author[];
  rating?: number;
  numberOfRatings?: number;
  year?: number;
  pages?: number;
  isbn?: string;
  url?: string;
};
