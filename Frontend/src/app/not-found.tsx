'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-6xl sm:text-7xl md:text-9xl font-bold text-sky-600 dark:text-sky-400 mb-3 sm:mb-4">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">
            Page Not Found
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 px-2">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
          <Link
            href="/"
            className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-sky-600 dark:bg-sky-500 text-white text-sm sm:text-base rounded-md font-semibold hover:bg-sky-700 dark:hover:bg-sky-600 transition-all duration-300 transform hover:scale-105"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white text-sm sm:text-base rounded-md font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
