"use client";

import { Review } from "@custom-types/review";
import { StarIcon } from "@heroicons/react/20/solid";

type RatingProps = {
  rating: number;
  bookId: string;
  interactive?: boolean;
  review?: Review;
  textOver?: string;
  textUnder?: string;
  visible?: boolean;
};

const Rating = ({
  rating,
  textOver,
  textUnder,
  visible = true,
  bookId,
  review,
  interactive = false,
}: RatingProps) => {
  const onRate = (rating: number) => {
    if (!review) {
      return;
    }
    review.myRating = rating;

    fetch(`/api/book/${bookId}/review`, {
      method: "PATCH",
      body: JSON.stringify({ rating }),
    });
  };

  const stars = [];
  for (let i = 1; i <= 5; i += 1) {
    stars.push(
      <button
        key={i}
        type="button"
        className="mr-2"
        onClick={interactive ? () => onRate(i) : undefined}
      >
        <StarIcon
          className={`h-5 w-5 ${
            i <= Math.round(rating) ? "text-yellow-500" : ""
          }`}
        />
      </button>
    );
  }
  return (
    <article
      className={`flex flex-col items-center ${visible ? "" : "invisible"}`}
    >
      <span className="text-sm">{textOver}</span>
      <div className="flex items-center">{stars}</div>
      <span className="text-xs">{textUnder}</span>
    </article>
  );
};

export default Rating;
