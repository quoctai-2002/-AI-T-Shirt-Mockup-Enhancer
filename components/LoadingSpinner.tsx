
import React from 'react';

interface LoadingSpinnerProps {
  count: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ count }) => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
    <p className="text-lg text-orange-400 font-semibold">Generating image variations...</p>
    <p className="text-sm text-gray-400 max-w-sm text-center">
      AI is crafting {count} unique mockup{count > 1 ? 's' : ''}{count >= 5 ? ' and a final collage' : ''} for you. This might take a moment.
    </p>
  </div>
);

export default LoadingSpinner;
