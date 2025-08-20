/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */

import React from 'react';

interface AssetManagerButtonProps {
  onClick: () => void;
  assetCount: number;
}

const FolderIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
);

export const AssetManagerButton: React.FC<AssetManagerButtonProps> = ({ onClick, assetCount }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Open asset manager"
      title="Asset Manager"
      className="relative p-2 rounded-full bg-gray-200/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
    >
      <FolderIcon />
      {assetCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
          {assetCount}
        </span>
      )}
    </button>
  );
};