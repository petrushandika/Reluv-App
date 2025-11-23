'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">
            Something went wrong!
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 mb-2 px-2">
            We encountered an unexpected error. Please try again.
          </p>
          {error.message && (
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-md mx-2">
              {error.message}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
          <button
            onClick={reset}
            className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-sky-600 dark:bg-sky-500 text-white text-sm sm:text-base rounded-md font-semibold hover:bg-sky-700 dark:hover:bg-sky-600 transition-all duration-300 transform hover:scale-105"
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white text-sm sm:text-base rounded-md font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
