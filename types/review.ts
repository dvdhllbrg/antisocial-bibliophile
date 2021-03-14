import type { Shelf } from './shelf';

export type Review = {
  myRating?: number;
  shelves: Shelf[];
  dateRead?: string;
  dateAdded?: string;
  dateUpdated?: string;
};
