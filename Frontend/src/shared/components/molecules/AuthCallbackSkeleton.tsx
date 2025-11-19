'use client';

import Skeleton from '@/shared/components/atoms/Skeleton';

const AuthCallbackSkeleton = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <Skeleton
          variant="text"
          height={20}
          width="200px"
          className="mx-auto"
        />
      </div>
    </div>
  );
};

export default AuthCallbackSkeleton;
