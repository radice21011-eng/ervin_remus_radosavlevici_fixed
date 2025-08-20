/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */

import React from 'react';
import type { AIOverview } from './types';

interface AIOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  overview: AIOverview | null;
  isLoading: boolean;
  onGenerate: () => void;
}

const SkeletonLoader: React.FC = () => (
    <div className="animate-pulse">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-md w-3/4 mb-4"></div>
        <div className="space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-5/6"></div>
        </div>
        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded-md w-1/2 mt-8 mb-3"></div>
        <div className="space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-2/3"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-1/2"></div>
        </div>
    </div>
);

export const AIOverviewModal: React.FC<AIOverviewModalProps> = ({ isOpen, onClose, overview, isLoading, onGenerate }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-gray-100/90 dark:bg-gray-800/90 border border-indigo-500/30 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700 flex-shrink-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Global Strategic Analysis</h2>
            <button onClick={onClose} className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white" aria-label="Close modal">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </header>

        <div className="flex-grow p-6 overflow-y-auto max-h-[70vh]">
            {isLoading && <SkeletonLoader />}
            {!isLoading && overview && (
                <div>
                    <div className="ai-overview-section">
                        <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mb-2">Strategic Summary</h3>
                        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{overview.strategic_summary}</p>
                    </div>
                    <div className="ai-overview-section">
                        <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mb-2">Capital Flow Analysis</h3>
                        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{overview.capital_flow_analysis}</p>
                    </div>
                    <div className="ai-overview-section">
                        <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-300 mb-2">Top Assets</h3>
                        <ul className="list-disc list-inside text-gray-800 dark:text-gray-200">
                            {overview.top_assets.map((asset, i) => (
                                <li key={i}><strong>{asset.name}</strong> - {asset.value}</li>
                            ))}
                        </ul>
                    </div>
                     <div className="ai-overview-section">
                        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Emerging Threats</h3>
                        <ul className="list-disc list-inside text-gray-800 dark:text-gray-200">
                             {overview.emerging_threats.length > 0 ? overview.emerging_threats.map((threat, i) => (
                                <li key={i}>{threat}</li>
                            )) : <li>No significant new threats detected.</li>}
                        </ul>
                    </div>
                </div>
            )}
        </div>

         <footer className="p-4 border-t border-gray-300 dark:border-gray-700 flex-shrink-0">
            <button
                onClick={onGenerate}
                disabled={isLoading}
                className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Generating...' : 'Re-run Analysis'}
            </button>
        </footer>
      </div>
    </div>
  );
};