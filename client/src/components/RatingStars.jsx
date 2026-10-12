import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 0, numReviews, size = 16, showScore = true }) {
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const isFilled = starIndex <= Math.floor(rounded);
          const isHalf = !isFilled && starIndex === Math.ceil(rounded) && rounded % 1 !== 0;

          return (
            <Star
              key={starIndex}
              size={size}
              className={`${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : isHalf
                  ? 'fill-amber-200 text-amber-400'
                  : 'text-slate-300'
              }`}
            />
          );
        })}
      </div>
      {showScore && <span className="text-xs font-semibold text-slate-700 ml-1">{rating.toFixed(1)}</span>}
      {numReviews !== undefined && (
        <span className="text-xs text-slate-400">({numReviews})</span>
      )}
    </div>
  );
}
