/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */

import React from 'react';
import type { ErvinRemusResult, ErvinRemusStarSystemResult } from './types';
import { RadarChart } from './RadarChart';

interface ComparisonViewProps {
    items: ErvinRemusResult[];
    onRemove: (id: string) => void;
    onClear: () => void;
}

const COLORS = ['#818cf8', '#60a5fa', '#34d399', '#f87171'];

const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const ComparisonView: React.FC<ComparisonViewProps> = ({ items, onRemove, onClear }) => {
    const isVisible = items.length > 0;

    const chartData = {
        labels: ['Energy (EAI)', 'Habitability (HPI)', 'Feasibility (MFI)', 'Economic (ECI)'],
        datasets: items.map((item, index) => ({
            label: item.name,
            data: [
                item.EAI,
                item.type === 'star_system' ? (item as ErvinRemusStarSystemResult).HPI_best : 0,
                item.MFI,
                item.ECI,
            ],
            color: COLORS[index % COLORS.length]
        }))
    };

    return (
        <div className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-500 ease-in-out ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="max-w-7xl mx-auto p-4">
                 <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-t-2 border-indigo-500/50 rounded-t-xl shadow-2xl shadow-indigo-500/20 p-4 sm:p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Comparison Analysis</h2>
                        <button 
                            onClick={onClear} 
                            className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-white transition-colors"
                        >
                            Clear All
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                        <div className="lg:col-span-1">
                            <ul className="space-y-2">
                                {items.map((item, index) => (
                                    <li 
                                        key={item.id} 
                                        className="flex items-center justify-between bg-gray-200/50 dark:bg-gray-700/50 p-2 rounded-md animate-fade-in"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                            <span className="text-gray-800 dark:text-gray-200 font-medium">{item.name}</span>
                                        </div>
                                        <button onClick={() => onRemove(item.id)} className="p-1 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" aria-label={`Remove ${item.name} from comparison`}>
                                            <CloseIcon />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                             {items.length === 0 && (
                                <p className="text-gray-500 dark:text-gray-400 text-center">Select up to 4 objects to compare.</p>
                            )}
                        </div>
                        <div className="lg:col-span-2 min-h-[250px] sm:min-h-[300px]">
                            {items.length > 0 ? (
                                <RadarChart data={chartData} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                     <p className="text-gray-500">Radar chart will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    );
};