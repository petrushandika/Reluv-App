'use client';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  className?: string;
}

const Spinner = ({
  size = 'md',
  fullScreen = true,
  className = '',
}: SpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const borderClasses = {
    sm: 'border-2',
    md: 'border-3',
    lg: 'border-4',
  };

  const spinner = (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div
        className={`absolute inset-0 rounded-full ${borderClasses[size]} border-sky-100 dark:border-sky-900/20`}
      />
      <div
        className={`absolute inset-0 rounded-full ${borderClasses[size]} border-t-sky-600 dark:border-t-sky-400 border-r-transparent border-b-transparent border-l-transparent animate-spin`}
        style={{
          animationTimingFunction: 'cubic-bezier(0.5, 0, 0.5, 1)',
        }}
      />
      <div
        className={`absolute inset-0 rounded-full ${borderClasses[size]} border-t-transparent border-r-sky-500 dark:border-r-sky-500 border-b-transparent border-l-transparent animate-spin`}
        style={{
          animationDuration: '1.5s',
          animationTimingFunction: 'cubic-bezier(0.5, 0, 0.5, 1)',
        }}
      />
      <div
        className={`absolute inset-0 rounded-full ${borderClasses[size]} border-t-transparent border-r-transparent border-b-sky-400 dark:border-b-sky-300 border-l-transparent animate-spin`}
        style={{
          animationDuration: '2s',
          animationTimingFunction: 'cubic-bezier(0.5, 0, 0.5, 1)',
        }}
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Spinner;
