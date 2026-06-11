import React from 'react';
import { Moon, Sun, Smartphone } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: (isDark: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, onToggleDarkMode }) => {
  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-800 dark:to-primary-900 text-white shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-primary-100 rounded-lg p-2">
            <Smartphone className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Total Wireless</h1>
            <p className="text-sm text-primary-100">Deal Calculator</p>
          </div>
        </div>
        <button
          onClick={() => onToggleDarkMode(!isDarkMode)}
          className="p-2 rounded-lg bg-primary-500 hover:bg-primary-400 transition-colors duration-200"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>
    </header>
  );
};
