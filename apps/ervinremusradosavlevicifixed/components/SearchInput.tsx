/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */

import React from 'react';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onCommandPaletteOpen: () => void;
    placeholder?: string;
}

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onCommandPaletteOpen, placeholder }) => {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                aria-label="Search celestial objects"
                className="w-full bg-gray-200/70 dark:bg-gray-800/70 border border-indigo-500/30 rounded-lg py-3 pl-11 pr-32 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                 <button onClick={onCommandPaletteOpen} className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                    Open <span className="command-palette-kbd">⌘K</span>
                </button>
            </div>
        </div>
    );
};
