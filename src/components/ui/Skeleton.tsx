import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
}) => {
  const base = 'animate-pulse bg-slate-200 dark:bg-slate-800';

  const variants = {
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
    text: 'rounded-md h-4 w-full',
  };

  return <div className={`${base} ${variants[variant]} ${className}`} aria-hidden="true" />;
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col space-y-4 shadow-sm">
      <Skeleton className="w-full aspect-[4/3] rounded-xl" />
      <div className="space-y-2">
        <Skeleton variant="text" className="w-1/3 h-3" />
        <Skeleton variant="text" className="w-3/4 h-5" />
        <Skeleton variant="text" className="w-1/2 h-4" />
      </div>
      <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
        <Skeleton variant="text" className="w-20 h-6" />
        <Skeleton className="w-28 h-9 rounded-xl" />
      </div>
    </div>
  );
};

export const CatalogSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
      <Skeleton className="w-full aspect-[4/3] rounded-3xl" />
      <div className="space-y-6">
        <Skeleton variant="text" className="w-24 h-6" />
        <Skeleton variant="text" className="w-3/4 h-10" />
        <Skeleton variant="text" className="w-32 h-8" />
        <Skeleton variant="text" className="w-full h-24" />
        <div className="pt-6 space-y-4">
          <Skeleton className="w-full h-12 rounded-xl" />
          <Skeleton className="w-full h-12 rounded-xl" />
        </div>
      </div>
    </div>
  );
};
