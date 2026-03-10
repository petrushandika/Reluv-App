'use client';

import Skeleton from '@/shared/components/common/Skeleton';

interface ProductCardSkeletonProps {
  containerClassName?: string;
}

const ProductCardSkeleton = ({ containerClassName }: ProductCardSkeletonProps) => {
  const defaultClasses = "w-full";
  
  return (
    <div className={containerClassName || defaultClasses}>
      <div className="relative group/card">
        <Skeleton variant="rectangular" className="aspect-square w-full rounded" />
        <Skeleton
          variant="circular"
          width={32}
          height={32}
          className="absolute top-3 right-3"
        />
      </div>
      <div className="pt-3 sm:pt-4 space-y-2">
        <Skeleton variant="text" height={16} width="60%" />
        <Skeleton variant="text" height={14} width="80%" />
        <Skeleton variant="text" height={18} width="50%" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;

