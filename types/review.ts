import type { Shelf } from '@custom-types/shelf';

export type Review = {
  myRating?: number;
  shelf?: Shelf;
  tags?: Shelf[];
  dateRead?: string;
  dateAdded?: string;
  dateUpdated?: string;
};
