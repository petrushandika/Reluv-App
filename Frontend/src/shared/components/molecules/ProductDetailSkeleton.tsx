"use client";

import Skeleton from "@/shared/components/atoms/Skeleton";

const ProductDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-10 sm:py-12 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16">
          <div className="space-y-4">
            <Skeleton
              variant="rectangular"
              className="aspect-square w-full rounded-lg"
            />
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  className="aspect-square rounded-lg"
                />
              ))}
            </div>
            <Skeleton
              variant="rectangular"
              height={80}
              className="rounded-lg"
            />
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Skeleton variant="text" height={20} width="30%" />
              <Skeleton variant="text" height={32} width="80%" />
            </div>
            <div className="space-y-2">
              <Skeleton variant="text" height={36} width="40%" />
              <Skeleton variant="text" height={20} width="60%" />
            </div>
            <div className="space-y-3">
              <Skeleton variant="text" height={24} width="40%" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    width={64}
                    height={64}
                    className="rounded-lg"
                  />
                ))}
              </div>
            </div>
            <Skeleton
              variant="rectangular"
              height={60}
              className="rounded-lg"
            />
            <div className="flex items-center space-x-4">
              <Skeleton variant="text" height={20} width="20%" />
              <Skeleton
                variant="rectangular"
                width={120}
                height={48}
                className="rounded-lg"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Skeleton
                variant="rectangular"
                height={48}
                className="flex-1 rounded-lg"
              />
              <Skeleton
                variant="rectangular"
                height={48}
                className="flex-1 rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-2 sm:gap-3 md:flex-row">
              <Skeleton
                variant="rectangular"
                height={48}
                className="w-full md:w-1/3 rounded-lg"
              />
              <div className="flex gap-2 sm:gap-3 w-full md:w-2/3">
                <Skeleton
                  variant="rectangular"
                  height={48}
                  className="flex-1 rounded-lg"
                />
                <Skeleton
                  variant="rectangular"
                  height={48}
                  className="flex-1 rounded-lg"
                />
              </div>
            </div>
            <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
              <Skeleton variant="text" height={24} width="40%" />
              <Skeleton variant="text" height={16} width="100%" />
              <Skeleton variant="text" height={16} width="90%" />
              <Skeleton variant="text" height={16} width="80%" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
