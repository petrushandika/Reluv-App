"use client";

import Skeleton from "@/shared/components/common/Skeleton";

const CartSkeleton = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-10 sm:py-12 md:py-14">
        <Skeleton variant="text" height={32} width="200px" className="mb-6" />
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          <div className="lg:w-2/3 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <Skeleton
                    variant="rectangular"
                    width={120}
                    height={120}
                    className="rounded-lg"
                  />
                  <div className="flex-1 space-y-3">
                    <Skeleton variant="text" height={20} width="60%" />
                    <Skeleton variant="text" height={16} width="40%" />
                    <Skeleton variant="text" height={24} width="30%" />
                    <div className="flex items-center gap-4">
                      <Skeleton
                        variant="rectangular"
                        width={100}
                        height={36}
                        className="rounded-lg"
                      />
                      <Skeleton
                        variant="rectangular"
                        width={80}
                        height={36}
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:w-1/3">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 space-y-4">
              <Skeleton variant="text" height={24} width="40%" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton variant="text" height={16} width="40%" />
                  <Skeleton variant="text" height={16} width="30%" />
                </div>
                <div className="flex justify-between">
                  <Skeleton variant="text" height={16} width="40%" />
                  <Skeleton variant="text" height={16} width="30%" />
                </div>
              </div>
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
        </div>
      </div>
    </div>
  );
};

export default CartSkeleton;
