/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */

import React from 'react';
import type { SimulationStatus } from './types';

interface TimeControlsProps {
    status: SimulationStatus;
    onToggle: () => void;
    currentYear: number;
}

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const TimeControls: React.FC<TimeControlsProps> = ({ status, onToggle, currentYear }) => {
    const isRunning = status === 'running';

    return (
        <div className="flex items-center gap-3 bg-gray-200/70 dark:bg-gray-800/70 p-1.5 rounded-lg">
            <button
                onClick={onToggle}
                aria-label={isRunning ? 'Pause simulation' : 'Play simulation'}
                title={isRunning ? 'Pause Simulation' : 'Play Simulation'}
                className="p-1 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
                {isRunning ? <PauseIcon /> : <PlayIcon />}
            </button>
            <div className="text-center pr-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">GSY</p>
                <p className="font-mono font-bold text-lg text-gray-800 dark:text-gray-200">{currentYear}</p>
            </div>
        </div>
    );
};