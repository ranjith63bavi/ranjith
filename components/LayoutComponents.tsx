
import React from 'react';

export const AppHeader: React.FC = () => (
  <header className="bg-white dark:bg-gray-800 shadow-md w-full">
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
        Hepa Predict
        <span className="text-gray-500 dark:text-gray-400 font-normal text-base hidden sm:inline"> | AI-Powered HCC Evaluation</span>
      </h1>
    </div>
  </header>
);

export const AppFooter: React.FC = () => (
  <footer className="bg-white dark:bg-gray-800 w-full mt-auto py-4 border-t dark:border-gray-700">
    <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
      <p>&copy; {new Date().getFullYear()} Hepa Predict. All rights reserved.</p>
      <p className="mt-1">
        This tool is for informational purposes only and does not constitute medical advice.
      </p>
    </div>
  </footer>
);
