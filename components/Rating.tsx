import { StarIcon } from '@heroicons/react/solid';

type RatingProps = {
  rating: number;
  onRate?: (rating: number) => void;
  textOver?: string;
  textUnder?: string;
};

const Rating = ({
  rating, onRate, textOver, textUnder,
}: RatingProps) => {
  let stars = '';
  for (let i = 1; i <= 5; i += 1) {
    stars += (
      <button
        type="button"
        className="mr-2"
        onClick={onRate ? () => onRate(i) : () => {}}
      >
        <StarIcon className={`h-5 w-5 ${i <= rating ? 'text-yellow-500' : ''}`} />
      </button>
    );
  }
  return (
    <div className="flex flex-col items-center">
      <span className="text-sm">{ textOver }</span>
      <div className="flex items-center">
        { stars }
      </div>
      <span className="text-xs">{ textUnder }</span>
    </div>
  );
};

export default Rating;
