"use client";

import Skeleton from "@/shared/components/common/Skeleton";

const CheckoutSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-10 sm:py-12 md:py-14">
        <Skeleton variant="text" height={28} width="200px" className="mb-6" />
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 md:p-8 space-y-4">
              <Skeleton variant="text" height={24} width="40%" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton
                  variant="rectangular"
                  height={48}
                  className="rounded-lg"
                />
                <Skeleton
                  variant="rectangular"
                  height={48}
                  className="rounded-lg"
                />
                <Skeleton
                  variant="rectangular"
                  height={48}
                  className="rounded-lg"
                />
                <Skeleton
                  variant="rectangular"
                  height={48}
                  className="rounded-lg"
                />
              </div>
              <Skeleton
                variant="rectangular"
                height={120}
                className="rounded-lg"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton
                  variant="rectangular"
                  height={48}
                  className="rounded-lg"
                />
                <Skeleton
                  variant="rectangular"
                  height={48}
                  className="rounded-lg"
                />
                <Skeleton
                  variant="rectangular"
                  height={48}
                  className="rounded-lg"
                />
              </div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 md:p-8 space-y-4">
              <Skeleton variant="text" height={24} width="40%" />
              <Skeleton
                variant="rectangular"
                height={200}
                className="rounded-lg"
              />
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 md:p-8 space-y-4">
              <Skeleton variant="text" height={24} width="40%" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    height={80}
                    className="rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 space-y-4 sticky top-8">
              <Skeleton variant="text" height={24} width="40%" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton variant="text" height={16} width="40%" />
                    <Skeleton variant="text" height={16} width="30%" />
                  </div>
                ))}
              </div>
              <Skeleton
                variant="rectangular"
                height={48}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSkeleton;
