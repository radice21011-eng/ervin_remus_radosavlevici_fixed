/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */

import React, { useState, useEffect, useRef } from 'react';
import { type ErvinRemusResult, type ErvinRemusStarSystemResult } from './types';

interface ScoreBarProps {
  label: string;
  value: number;
  color: string;
  tooltip: string;
}

const ScoreBar: React.FC<ScoreBarProps> = ({ label, value, color, tooltip }) => (
  <div className="w-full">
    <div className="flex justify-between items-center mb-1 text-sm">
      <div className="relative group">
         <span className="font-medium text-gray-600 dark:text-gray-300 border-b border-dashed border-gray-400 dark:border-gray-500 cursor-help">{label}</span>
         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-gray-200 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 border border-indigo-500/30 transform">
            {tooltip}
            <svg className="absolute text-gray-900 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
        </div>
      </div>
      <span className="font-mono text-indigo-600 dark:text-indigo-300">{(value * 100).toFixed(1)}%</span>
    </div>
    <div className="w-full bg-gray-300 dark:bg-gray-700/50 rounded-full h-2.5">
      <div className={`${color} h-2.5 rounded-full`} style={{ width: `${value * 100}%` }}></div>
    </div>
  </div>
);

const ThreatBar: React.FC<{ level: number }> = ({ level }) => {
  const width = `${level * 100}%`;
  const color = level > 0.66 ? 'bg-red-500' : level > 0.33 ? 'bg-yellow-500' : 'bg-green-500';
  return (
    <div className="w-full">
        <div className="flex justify-between items-center mb-1 text-sm">
            <span className="font-medium text-gray-600 dark:text-gray-300">Threat Level</span>
            <span className="font-mono text-gray-700 dark:text-gray-300">{(level * 100).toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-300 dark:bg-gray-700/50 rounded-full h-2.5">
            <div className={`${color} h-2.5 rounded-full`} style={{ width }}></div>
        </div>
    </div>
  );
};

const ChartBarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

type RankChange = 'up' | 'down' | 'none';

interface RankingCardProps {
  item: ErvinRemusResult;
  rank: number;
  rankChange: RankChange;
  onSelectObject: (item: ErvinRemusResult) => void;
  onToggleComparison: (itemId: string) => void;
  isSelectedForComparison: boolean;
  isComparisonDisabled: boolean;
  isAcquired: boolean;
  status: 'suspect' | null | undefined;
}

const formatValue = (value: number): string => {
    if (value >= 1e12) return `§${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `§${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `§${(value / 1e6).toFixed(2)}M`;
    return `§${value.toLocaleString()}`;
}

// Custom hook to detect value changes and apply a temporary class
const useValueFlash = (value: number | undefined | null) => {
    const [flashClass, setFlashClass] = useState('');
    const prevValueRef = useRef(value);

    useEffect(() => {
        const prevValue = prevValueRef.current;
        if (typeof prevValue === 'number' && typeof value === 'number' && prevValue !== value) {
            setFlashClass(value > prevValue ? 'animate-value-flash-positive' : 'animate-value-flash-negative');
            const timer = setTimeout(() => setFlashClass(''), 1000);
            return () => clearTimeout(timer);
        }
        prevValueRef.current = value;
    }, [value]);

    return flashClass;
};


export const RankingCard: React.FC<RankingCardProps> = ({ item, rank, rankChange, onSelectObject, onToggleComparison, isSelectedForComparison, isComparisonDisabled, isAcquired, status }) => {
  const isStarSystem = item.type === 'star_system';
  const starSystemItem = isStarSystem ? (item as ErvinRemusStarSystemResult) : null;
  
  const scoreFlashClass = useValueFlash(item.ERVINREMUS);
  const ecoFlashClass = useValueFlash(item.economic_value);

  const cardBorderGradient = status === 'suspect'
    ? "bg-gradient-to-br from-red-500 to-rose-500"
    : isAcquired
    ? "bg-gradient-to-br from-green-400 to-cyan-400"
    : rank === 1 
    ? "bg-gradient-to-br from-yellow-400 via-amber-300 to-orange-400"
    : isSelectedForComparison
    ? "bg-gradient-to-br from-indigo-400 to-cyan-400"
    : "bg-gradient-to-br from-indigo-500/50 via-purple-500/50 to-cyan-500/50";
    
  const cardShadow = isSelectedForComparison ? "shadow-[0_0_20px_4px_rgba(129,140,248,0.4)]" : "shadow-lg dark:shadow-black/20";
  
  const rankChangeAnimation = 
    rankChange === 'up' ? 'animate-flash-green' :
    rankChange === 'down' ? 'animate-flash-red' : '';
    
  const containerAnimation = status === 'suspect' ? 'animate-pulse-border-red' : '';

  return (
    <div className={`relative rounded-xl p-0.5 ${cardBorderGradient} transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] ${cardShadow} ${containerAnimation}`}>
        {isAcquired && (
            <div className="absolute -top-3 -left-3 z-10 bg-green-500 text-white text-xs font-bold uppercase px-3 py-1 rounded-full transform -rotate-12 shadow-lg">
                Asset Acquired
            </div>
        )}
        <div 
            className={`bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-6 h-full flex flex-col cursor-pointer ${rankChangeAnimation}`}
            onClick={() => onSelectObject(item)}
            role="button"
            aria-label={`View details for ${item.name}`}
        >
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
                    {item.type.replace('_', ' ')}
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{item.name}</h3>
                </div>
                <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900/50 text-yellow-500 dark:text-yellow-300 rounded-full w-16 h-16 border-2 border-yellow-400/50 flex-shrink-0">
                    <span className="text-xs font-semibold">RANK</span>
                    <span className="text-3xl font-bold">{rank}</span>
                </div>
                </div>

                {isStarSystem && starSystemItem?.best_planet && (
                    <div className="mt-4 text-sm bg-green-500/10 dark:bg-green-900/40 text-green-800 dark:text-green-300 border border-green-500/30 rounded-md px-3 py-1.5">
                        <span className="font-semibold">Most Habitable Planet:</span> {starSystemItem.best_planet}
                    </div>
                )}
                 {item.economic_value && (
                     <div className={`mt-2 text-sm bg-yellow-500/10 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 border border-yellow-500/30 rounded-md px-3 py-1.5 transition-colors duration-500 ${ecoFlashClass}`}>
                        <span className="font-semibold">Economic Value:</span> {formatValue(item.economic_value)}
                    </div>
                )}
                {status === 'suspect' && (
                    <div className="mt-2 text-sm glitch-container bg-red-500/10 text-red-300 border border-red-500/30 rounded-md px-3 py-1.5">
                        <p className="glitch-text font-bold uppercase tracking-widest" data-text="Suspicious Anomaly">Suspicious Anomaly</p>
                    </div>
                )}


                <div className="mt-6 border-t border-gray-300 dark:border-gray-700/50 pt-4">
                    <div className="text-center mb-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Composite Score</p>
                        <p className={`text-5xl font-mono font-light text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-300 dark:to-purple-300 transition-colors duration-500 ${scoreFlashClass}`}>
                        {item.ERVINREMUS.toFixed(4)}
                        </p>
                    </div>
                    <div className="space-y-4">
                        <ScoreBar 
                            label="Energy Availability (EAI)" 
                            value={item.EAI} 
                            color="bg-red-500" 
                            tooltip="Energy Availability Index: Measures the total energy output of the star or galaxy, scaled logarithmically. Higher is better."
                        />
                        {isStarSystem && starSystemItem && (
                            <ScoreBar 
                                label="Habitability Potential (HPI)" 
                                value={starSystemItem.HPI_best} 
                                color="bg-green-500" 
                                tooltip="Habitability Potential Index: A proxy for a planet's ability to support life, based on its temperature and the amount of light it receives from its star."
                            />
                        )}
                        <ScoreBar 
                            label="Megastructure Feasibility (MFI)" 
                            value={item.MFI} 
                            color="bg-blue-500" 
                            tooltip="Megastructure Feasibility Index: A proxy for the ease of building large-scale structures, favoring high energy output and low stellar variability."
                        />
                         <ScoreBar 
                            label="Economic Index (ECI)" 
                            value={item.ECI} 
                            color="bg-yellow-400" 
                            tooltip="Economic Index: Represents the estimated economic potential based on resources and strategic value."
                        />
                        <ThreatBar level={item.threat_level ?? 0} />
                    </div>
                </div>
            </div>
            <div className="mt-6 border-t border-gray-300 dark:border-gray-700/50 pt-4">
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent card click from firing
                        onToggleComparison(item.id);
                    }}
                    disabled={isComparisonDisabled}
                    className={`w-full flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 border
                        ${isSelectedForComparison
                            ? 'bg-indigo-600 text-white border-indigo-400'
                            : 'text-indigo-700 dark:text-indigo-200 bg-indigo-500/10 dark:bg-indigo-600/30 border-indigo-500/50 hover:bg-indigo-500/20 dark:hover:bg-indigo-600/60'
                        }
                        disabled:bg-gray-500/20 dark:disabled:bg-gray-700/50 disabled:text-gray-500 disabled:border-gray-600 disabled:cursor-not-allowed
                    `}
                >
                    <ChartBarIcon />
                    {isSelectedForComparison ? 'Remove from Comparison' : 'Add to Comparison'}
                </button>
            </div>
        </div>
    </div>
  );
};