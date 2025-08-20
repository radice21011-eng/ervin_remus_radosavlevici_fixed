/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */

import React from 'react';

interface CapitalDisplayProps {
    capital: number;
}

const formatCapital = (value: number): string => {
    if (value >= 1e12) return `§${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `§${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `§${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `§${(value / 1e3).toFixed(1)}K`;
    return `§${value.toFixed(0)}`;
};

const CapitalIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
    </svg>
);


export const CapitalDisplay: React.FC<CapitalDisplayProps> = ({ capital }) => {
    return (
        <div className="flex items-center gap-2 bg-gray-200/70 dark:bg-gray-800/70 p-1.5 pr-3 rounded-lg text-teal-600 dark:text-teal-300">
            <div className="p-1 bg-gray-300/50 dark:bg-gray-900/50 rounded-full">
                <CapitalIcon />
            </div>
            <div>
                <p className="text-xl font-mono font-bold leading-none">{formatCapital(capital)}</p>
                <p className="text-xs -mt-0.5 opacity-70 uppercase tracking-wider">Capital</p>
            </div>
        </div>
    );
};