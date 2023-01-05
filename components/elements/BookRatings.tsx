"use client";

import { useEffect, useState } from "react";
import { getMany } from "idb-keyval";
import Rating from "@components/Rating";
import { Book } from "@custom-types/book";
import { Review } from "@custom-types/review";
import formatNumber from "@lib/formatNumber";

type BookRatingsProps = {
  book: Book;
  review?: Review;
};

const BookRatings = ({ book, review }: BookRatingsProps) => {
  const [showGoodreadsRating, setShowGoodreadsRating] = useState(false);
  const [showMyRating, setShowMyRating] = useState(false);

  useEffect(() => {
    const setRatingSettings = async () => {
      const [hideGoodreadsRatings, hideMyRatings] = await getMany([
        "hideGoodreadsRatings",
        "hideMyRatings",
      ]);
      setShowGoodreadsRating(!hideGoodreadsRatings);
      setShowMyRating(!hideMyRatings);
    };
    setRatingSettings();
  }, []);

  return (
    <section className="flex items-center justify-evenly w-full my-6">
      {showGoodreadsRating && (
        <Rating
          textOver="Goodreads rating"
          rating={book.rating || 0}
          textUnder={`${formatNumber(book.rating || 0)} from ${formatNumber(
            book.numberOfRatings || 0
          )} ratings.`}
          bookId={book.id}
          review={review}
        />
      )}
      {showMyRating && (
        <Rating
          textOver="Your rating"
          rating={review?.myRating || 0}
          textUnder="Tap a star to give a rating."
          interactive
          visible={typeof review !== "undefined"}
          bookId={book.id}
          review={review}
        />
      )}
    </section>
  );
};

export default BookRatings;
