import { Review } from "@custom-types/review";
import { BookPropType } from "@reducers/bookReducer";
import shelfReducer, { ShelfPropType } from "@reducers/shelfReducer";

export type ReviewPropType = {
  shelves?: { shelf: ShelfPropType | ShelfPropType[] };
  rating?: number;
  read_at?: string;
  date_added?: string;
  date_updated?: string;
  book: BookPropType;
};

export default function bookReviewReducer(review: ReviewPropType): Review {
  let shelf;
  let tags;
  if (review?.shelves?.shelf) {
    const shelves = Array.isArray(review.shelves.shelf)
      ? review.shelves.shelf.map(shelfReducer)
      : [shelfReducer(review.shelves.shelf)];
    shelf = shelves.find((s) => s.main);
    tags = shelves.filter((s) => !s.main);
  }
  return {
    myRating: review?.rating || 0,
    shelf,
    tags: tags || [],
    dateRead: review?.read_at || "",
    dateAdded: review?.date_added || "",
    dateUpdated: review?.date_updated || "",
  };
}
