/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */

import React from 'react';
import type { SortConfig, SortKey } from './types';

interface SortControlsProps {
  sortConfig: SortConfig;
  onSortChange: (key: SortKey) => void;
  availableSorters: SortKey[];
}

const sortKeyLabels: Record<SortKey, string> = {
    ERVINREMUS: 'ErvinRemus Score',
    EAI: 'Energy (EAI)',
    HPI_best: 'Habitability (HPI)',
    MFI: 'Feasibility (MFI)',
    ECI: 'Economic (ECI)',
};

const SortIcon: React.FC<{direction: 'asc' | 'desc'}> = ({ direction }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 inline-block transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor" style={{ transform: direction === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)' }}>
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


export const SortControls: React.FC<SortControlsProps> = ({ sortConfig, onSortChange, availableSorters }) => {
    return (
        <div className="flex items-center flex-wrap gap-2 bg-gray-200/60 dark:bg-gray-800/60 p-1 rounded-lg">
            {availableSorters.map((key) => {
                const isActive = sortConfig.key === key;
                const label = sortKeyLabels[key];
                const ariaLabel = isActive 
                    ? `Sort by ${label} in ${sortConfig.direction === 'asc' ? 'ascending' : 'descending'} order`
                    : `Sort by ${label}`;

                return (
                    <button
                        key={key}
                        onClick={() => onSortChange(key)}
                        aria-label={ariaLabel}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 flex items-center
                            ${isActive 
                                ? 'bg-indigo-600 text-white shadow' 
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300/80 dark:hover:bg-gray-700/80'
                            }`
                        }
                    >
                        {label}
                        {isActive && <SortIcon direction={sortConfig.direction} />}
                    </button>
                );
            })}
        </div>
    );
};