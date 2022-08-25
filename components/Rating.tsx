import { StarIcon } from "@heroicons/react/20/solid";

type RatingProps = {
  rating: number;
  onRate?: (rating: number) => void;
  textOver?: string;
  textUnder?: string;
  visible?: boolean;
};

const Rating = ({
  rating,
  onRate,
  textOver,
  textUnder,
  visible = true,
}: RatingProps) => {
  const stars = [];
  for (let i = 1; i <= 5; i += 1) {
    stars.push(
      <button
        key={i}
        type="button"
        className="mr-2"
        onClick={onRate ? () => onRate(i) : () => {}}
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
