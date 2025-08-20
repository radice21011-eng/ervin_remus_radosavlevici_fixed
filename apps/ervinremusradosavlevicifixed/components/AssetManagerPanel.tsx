/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */

import React, { useMemo } from 'react';
import type { ErvinRemusResult } from './types';

interface AssetManagerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  assets: ErvinRemusResult[];
}

const formatValue = (value: number): string => {
    if (value >= 1e12) return `§${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `§${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `§${(value / 1e6).toFixed(2)}M`;
    return `§${value.toLocaleString()}`;
};

const AssetItem: React.FC<{ asset: ErvinRemusResult }> = ({ asset }) => {
    return (
        <li className="bg-gray-200/50 dark:bg-gray-800/50 p-3 rounded-lg flex items-center justify-between gap-3">
            <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{asset.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase">
                    {asset.type.replace('_', ' ')}
                </p>
            </div>
            <div className="text-right">
                <p className="font-mono text-green-600 dark:text-green-400">{formatValue(asset.economic_value ?? 0)}</p>
                <p className="text-xs text-teal-600 dark:text-teal-400 mt-1">
                    Income: {formatValue(asset.income ?? 0)}/yr
                </p>
            </div>
        </li>
    );
};

export const AssetManagerPanel: React.FC<AssetManagerPanelProps> = ({ isOpen, onClose, assets }) => {
    const totalValue = useMemo(() => {
        return assets.reduce((sum, asset) => sum + (asset.economic_value ?? 0), 0);
    }, [assets]);
    
    const totalIncome = useMemo(() => {
        return assets.reduce((sum, asset) => sum + (asset.income ?? 0), 0);
    }, [assets]);


  return (
    <>
      <div 
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside 
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-gray-100 dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="asset-panel-title"
      >
        <div className="flex flex-col h-full">
            <header className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700 flex-shrink-0">
                 <h2 id="asset-panel-title" className="text-2xl font-bold text-gray-900 dark:text-gray-100">Asset Portfolio</h2>
                 <button onClick={onClose} className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white" aria-label="Close asset manager">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
            </header>
            <div className="flex-grow p-4 overflow-y-auto">
                 {assets.length > 0 ? (
                    <ul className="space-y-3">
                        {assets.map(asset => (
                            <AssetItem key={asset.id} asset={asset} />
                        ))}
                    </ul>
                 ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500 dark:text-gray-400">No assets acquired.</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Acquire assets from their detail view to build your portfolio.</p>
                    </div>
                 )}
            </div>
            <footer className="p-4 border-t border-gray-300 dark:border-gray-700 flex-shrink-0 bg-gray-200/50 dark:bg-gray-800/50 space-y-2">
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">Total Annual Income:</span>
                    <span className="font-mono font-bold text-teal-600 dark:text-teal-300">{formatValue(totalIncome)}/yr</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg text-gray-800 dark:text-gray-200">Total Portfolio Value:</span>
                    <span className="font-mono text-xl font-bold text-green-600 dark:text-green-300">{formatValue(totalValue)}</span>
                </div>
            </footer>
        </div>
      </aside>
    </>
  );
};