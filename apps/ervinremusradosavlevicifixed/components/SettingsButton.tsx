/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */

import React from 'react';

interface SettingsButtonProps {
  onClick: () => void;
}

const SlidersIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8v2m0-2a2 2 0 100 4m0-4a2 2 0 110 4m12-4v2m0-2a2 2 0 100 4m0-4a2 2 0 110 4M6 12v-2m0 2a2 2 0 100-4m0 4a2 2 0 110-4m6-4v2m0-2a2 2 0 100-4m0 4a2 2 0 110-4m6 8v-2m0 2a2 2 0 100-4m0 4a2 2 0 110-4" />
    </svg>
);


export const SettingsButton: React.FC<SettingsButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Open algorithm settings"
      title="Algorithm Settings"
      className="p-2 rounded-full bg-gray-200/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
    >
      <SlidersIcon />
    </button>
  );
};