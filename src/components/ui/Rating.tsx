import React from 'react';
import { Star } from 'lucide-react';
import { formatRating } from '@/lib/formatters';

interface RatingProps {
  value: number;
  count?: number;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  count,
  showCount = true,
  size = 'md',
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`} aria-label={`Rating ${value} out of 5 stars`}>
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const fillPercentage = Math.max(0, Math.min(1, value - (starIndex - 1)));
          return (
            <div key={starIndex} className="relative">
              {/* Background gray star */}
              <Star className={`${iconSizes[size]} text-slate-300 dark:text-slate-700`} fill="currentColor" />
              {/* Foreground yellow star */}
              {fillPercentage > 0 && (
                <div
                  className="absolute top-0 left-0 overflow-hidden text-amber-400"
                  style={{ width: `${fillPercentage * 100}%` }}
                >
                  <Star className={`${iconSizes[size]}`} fill="currentColor" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <span className={`font-semibold text-slate-800 dark:text-slate-200 ${textSizes[size]}`}>
        {formatRating(value)}
      </span>
      {showCount && count !== undefined && (
        <span className={`text-slate-500 dark:text-slate-400 ${textSizes[size]}`}>
          ({count})
        </span>
      )}
    </div>
  );
};
