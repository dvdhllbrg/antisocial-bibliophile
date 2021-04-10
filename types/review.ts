import type { Shelf } from '@custom-types/shelf';

export type Review = {
  myRating?: number;
  shelves: Shelf[];
  dateRead?: string;
  dateAdded?: string;
  dateUpdated?: string;
};
