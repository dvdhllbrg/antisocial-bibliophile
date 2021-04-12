/* eslint-disable camelcase */
import { Review } from '@custom-types/review';
import { Shelf } from '@custom-types/shelf';
import { BookPropType } from '@reducers/bookReducer';
import shelfReducer, { ShelfPropType } from '@reducers/shelfReducer';

export type ReviewPropType = {
  shelves?: { shelf: ShelfPropType | ShelfPropType[]; };
  rating?: number;
  read_at?: string;
  date_added?: string;
  date_updated?: string;
  book: BookPropType;
};

export default function bookReviewReducer(review: ReviewPropType): Review {
  let shelves: Shelf[] = [];
  if (review.shelves && review.shelves.shelf) {
    shelves = Array.isArray(review.shelves.shelf)
      ? review.shelves.shelf.map(shelfReducer)
      : [shelfReducer(review.shelves.shelf)];
  }
  return {
    myRating: review.rating || 0,
    shelves,
    dateRead: review.read_at || '',
    dateAdded: review.date_added || '',
    dateUpdated: review.date_updated || '',
  };
}
