import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-center py-4 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
      <p className="flex items-center justify-center gap-1">
        Made with <Heart className="w-4 h-4 text-red-500" /> for wireless sales reps
      </p>
      <p className="text-xs mt-2 opacity-75">Version 1.0.0 • © 2024 Total Wireless Deal Calculator</p>
    </footer>
  );
};
