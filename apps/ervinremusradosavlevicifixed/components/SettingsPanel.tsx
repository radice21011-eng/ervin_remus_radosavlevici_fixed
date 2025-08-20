/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */

import React from 'react';
import type { ErvinRemusWeights, StarSystemWeights, GalaxyWeights } from './types';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  weights: ErvinRemusWeights;
  onWeightsChange: (weights: ErvinRemusWeights) => void;
  onReset: () => void;
}

interface WeightSliderProps {
  label: string;
  value: number;
  tooltip: string;
  onChange: (value: number) => void;
}

const WeightSlider: React.FC<WeightSliderProps> = ({ label, value, tooltip, onChange }) => (
    <div>
        <div className="flex justify-between items-center mb-1">
             <div className="relative group">
                <span className="font-medium text-gray-700 dark:text-gray-300 border-b border-dashed border-gray-400 dark:border-gray-500 cursor-help">{label}</span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-gray-900 text-gray-200 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 border border-indigo-500/30">
                    {tooltip}
                </div>
            </div>
            <span className="font-mono text-indigo-600 dark:text-indigo-300">{(value * 100).toFixed(0)}%</span>
        </div>
        <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
    </div>
);


export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, weights, onWeightsChange, onReset }) => {
  
  const handleStarSystemChange = (changedKey: keyof StarSystemWeights, newValue: number) => {
    const current = weights.starSystem;
    const oldVal = current[changedKey];
    const diff = newValue - oldVal;

    let otherKeys = (['w_eai', 'w_hpi', 'w_mfi', 'w_eci'] as const).filter(k => k !== changedKey);
    let otherSum = otherKeys.reduce((sum, key) => sum + current[key], 0);

    let newWeights: StarSystemWeights = { ...current, [changedKey]: newValue };

    if (otherSum > 0) {
        otherKeys.forEach(key => {
            const proportion = current[key] / otherSum;
            newWeights[key] -= diff * proportion;
            // Clamp values to prevent negatives
            newWeights[key] = Math.max(0, newWeights[key]);
        });
    }

    // Final normalization pass to ensure sum is exactly 1
    const total = newWeights.w_eai + newWeights.w_hpi + newWeights.w_mfi + newWeights.w_eci;
    if (total > 0) {
        newWeights.w_eai /= total;
        newWeights.w_hpi /= total;
        newWeights.w_mfi /= total;
        newWeights.w_eci /= total;
    }
    
    onWeightsChange({ ...weights, starSystem: newWeights });
  };
  
  const handleGalaxyChange = (changedKey: keyof GalaxyWeights, newValue: number) => {
    const current = weights.galaxy;
    const oldVal = current[changedKey];
    const diff = newValue - oldVal;

    let otherKeys = (['w_eai', 'w_mfi', 'w_eci'] as const).filter(k => k !== changedKey);
    let otherSum = otherKeys.reduce((sum, key) => sum + current[key], 0);

    let newWeights: GalaxyWeights = { ...current, [changedKey]: newValue };

    if (otherSum > 0) {
        otherKeys.forEach(key => {
            const proportion = current[key] / otherSum;
            newWeights[key] -= diff * proportion;
            newWeights[key] = Math.max(0, newWeights[key]);
        });
    }

    const total = newWeights.w_eai + newWeights.w_mfi + newWeights.w_eci;
    if (total > 0) {
        newWeights.w_eai /= total;
        newWeights.w_mfi /= total;
        newWeights.w_eci /= total;
    }

    onWeightsChange({ ...weights, galaxy: newWeights });
  };


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
        aria-labelledby="settings-panel-title"
      >
        <div className="flex flex-col h-full">
            <header className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700 flex-shrink-0">
                 <h2 id="settings-panel-title" className="text-2xl font-bold text-gray-900 dark:text-gray-100">Algorithm Settings</h2>
                 <button onClick={onClose} className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white" aria-label="Close settings panel">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
            </header>
            <div className="flex-grow p-6 overflow-y-auto space-y-8">
                <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Star System Weights</h3>
                    <div className="space-y-4 bg-gray-200/50 dark:bg-gray-800/50 p-4 rounded-lg">
                        <WeightSlider 
                            label="Energy (EAI)"
                            value={weights.starSystem.w_eai}
                            onChange={v => handleStarSystemChange('w_eai', v)}
                            tooltip="Weight for the Energy Availability Index. Prioritizes systems with high energy output."
                        />
                         <WeightSlider 
                            label="Habitability (HPI)"
                            value={weights.starSystem.w_hpi}
                            onChange={v => handleStarSystemChange('w_hpi', v)}
                            tooltip="Weight for the Habitability Potential Index. Prioritizes systems with Earth-like planets."
                        />
                         <WeightSlider 
                            label="Feasibility (MFI)"
                            value={weights.starSystem.w_mfi}
                            onChange={v => handleStarSystemChange('w_mfi', v)}
                            tooltip="Weight for the Megastructure Feasibility Index. Prioritizes high-energy, low-variability systems."
                        />
                        <WeightSlider 
                            label="Economic (ECI)"
                            value={weights.starSystem.w_eci}
                            onChange={v => handleStarSystemChange('w_eci', v)}
                            tooltip="Weight for the Economic Index. Prioritizes systems with high potential economic value."
                        />
                    </div>
                </div>
                 <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Galaxy Weights</h3>
                     <div className="space-y-4 bg-gray-200/50 dark:bg-gray-800/50 p-4 rounded-lg">
                        <WeightSlider 
                            label="Energy (EAI)"
                            value={weights.galaxy.w_eai}
                            onChange={v => handleGalaxyChange('w_eai', v)}
                            tooltip="Weight for the Energy Availability Index. Prioritizes galaxies with high total luminosity."
                        />
                         <WeightSlider 
                            label="Feasibility (MFI)"
                            value={weights.galaxy.w_mfi}
                            onChange={v => handleGalaxyChange('w_mfi', v)}
                            tooltip="Weight for the Megastructure Feasibility Index. Prioritizes high-energy, low-variability galaxies."
                        />
                         <WeightSlider 
                            label="Economic (ECI)"
                            value={weights.galaxy.w_eci}
                            onChange={v => handleGalaxyChange('w_eci', v)}
                            tooltip="Weight for the Economic Index. Prioritizes galaxies with high potential economic value."
                        />
                    </div>
                </div>

            </div>
             <footer className="p-4 border-t border-gray-300 dark:border-gray-700 flex-shrink-0">
                <button 
                    onClick={onReset}
                    className="w-full px-4 py-2 font-semibold text-indigo-700 dark:text-indigo-200 bg-indigo-500/10 dark:bg-indigo-600/30 border border-indigo-500/50 rounded-lg hover:bg-indigo-500/20 dark:hover:bg-indigo-600/60 transition-colors"
                >
                    Reset to Defaults
                </button>
            </footer>
        </div>
      </aside>
    </>
  );
};