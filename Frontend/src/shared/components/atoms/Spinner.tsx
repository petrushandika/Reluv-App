"use client";

const Spinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 dark:border-sky-400"></div>
    </div>
  );
};

export default Spinner;
