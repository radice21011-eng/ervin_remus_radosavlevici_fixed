/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */

import React, { useState } from 'react';
import type { ErvinRemusResult } from './types';

interface StarmapViewProps {
  data: ErvinRemusResult[];
  onSelectObject: (item: ErvinRemusResult) => void;
  showThreatOverlay: boolean;
  onToggleThreatOverlay: () => void;
}

const getPointStyle = (item: ErvinRemusResult) => {
    if (item.isAcquired) return { fill: '#4ade80', stroke: '#ffffff' }; // green-400
    if (item.type === 'galaxy') return { fill: '#c084fc', stroke: '#f3e8ff' }; // purple-400
    return { fill: '#fbbf24', stroke: '#fefce8' }; // amber-400
};

export const StarmapView: React.FC<StarmapViewProps> = ({ data, onSelectObject, showThreatOverlay, onToggleThreatOverlay }) => {
  const [tooltip, setTooltip] = useState<{ x: number, y: number, content: string } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<SVGCircleElement>, item: ErvinRemusResult) => {
    setTooltip({ x: e.clientX, y: e.clientY, content: `${item.name} (Value: ${item.ERVINREMUS.toFixed(4)})` });
  };
  
  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <div className="w-full h-full bg-gray-900/50 rounded-lg border border-indigo-500/30 relative overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="absolute inset-0">
        <defs>
            <filter id="glow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        
        {/* Threat Halos */}
        {showThreatOverlay && data.map(item => {
            const threat = item.threat_level ?? 0;
            if (threat < 0.3) return null;
            const radius = 2 + threat * 10;
            const color = threat > 0.66 ? 'rgba(239, 68, 68, 0.5)' : 'rgba(245, 158, 11, 0.5)';
            return (
                 <circle
                    key={`halo-${item.id}`}
                    className="threat-halo"
                    cx={item.coordinates!.x * 100}
                    cy={item.coordinates!.y * 100}
                    r={radius}
                    fill={color}
                    pointerEvents="none"
                />
            );
        })}

        {/* Data Points */}
        {data.map(item => {
          const { fill, stroke } = getPointStyle(item);
          const radius = item.type === 'galaxy' ? 1.2 : 0.6;
          return (
            <circle
              key={item.id}
              className="map-point cursor-pointer"
              cx={item.coordinates!.x * 100}
              cy={item.coordinates!.y * 100}
              r={radius}
              fill={fill}
              stroke={stroke}
              strokeWidth="0.2"
              onClick={() => onSelectObject(item)}
              onMouseMove={(e) => handleMouseMove(e, item)}
              onMouseLeave={handleMouseLeave}
            />
          );
        })}
      </svg>
      
      {/* Tooltip */}
      {tooltip && (
        <div 
          className="absolute bg-gray-900 text-white text-xs px-2 py-1 rounded-md pointer-events-none transform -translate-y-full -translate-x-1/2"
          style={{ top: tooltip.y - 10, left: tooltip.x }}
        >
          {tooltip.content}
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 right-4 z-10">
        <button 
            onClick={onToggleThreatOverlay}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors border backdrop-blur-sm
                ${showThreatOverlay 
                    ? 'bg-red-500/70 text-white border-red-400' 
                    : 'bg-gray-700/50 text-gray-200 border-gray-600 hover:bg-gray-600/70'
                }`}
        >
            Toggle Threat Overlay
        </button>
      </div>
    </div>
  );
};
