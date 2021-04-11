import type { Author } from '@custom-types/author';

export type SearchResult = {
  id: string;
  title: string;
  image?: string;
  authors?: Author[];
};
