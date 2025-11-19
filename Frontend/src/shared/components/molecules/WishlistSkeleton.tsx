'use client';

import Skeleton from '@/shared/components/atoms/Skeleton';

const WishlistSkeleton = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-6 sm:py-8 md:py-12">
        <Skeleton variant="text" height={32} width="200px" className="mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <Skeleton variant="rectangular" className="aspect-square w-full" />
              <div className="p-4 space-y-2">
                <Skeleton variant="text" height={16} width="60%" />
                <Skeleton variant="text" height={14} width="80%" />
                <Skeleton variant="text" height={18} width="50%" />
                <Skeleton variant="rectangular" height={36} className="rounded-lg mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistSkeleton;

