'use client';

import Skeleton from '@/shared/components/atoms/Skeleton';

const SellSkeleton = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-6 sm:py-8 md:py-12">
        <Skeleton variant="text" height={32} width="200px" className="mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
              <Skeleton variant="text" height={24} width="40%" />
              <Skeleton variant="rectangular" height={200} className="rounded-lg" />
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} variant="rectangular" className="aspect-square rounded-lg" />
                ))}
              </div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
              <Skeleton variant="text" height={24} width="40%" />
              <Skeleton variant="rectangular" height={48} className="rounded-lg" />
              <Skeleton variant="rectangular" height={120} className="rounded-lg" />
              <Skeleton variant="rectangular" height={48} className="rounded-lg" />
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4">
              <Skeleton variant="text" height={24} width="40%" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton variant="rectangular" height={48} className="rounded-lg" />
                <Skeleton variant="rectangular" height={48} className="rounded-lg" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4 sticky top-8">
              <Skeleton variant="text" height={24} width="40%" />
              <Skeleton variant="rectangular" height={48} className="rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellSkeleton;

