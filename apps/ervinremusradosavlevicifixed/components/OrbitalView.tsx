/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */

import React from 'react';
import type { ErvinRemusStarSystemResult, Planet } from './types';

interface OrbitalViewProps {
  system: ErvinRemusStarSystemResult;
}

const getPlanetColor = (tempK: number | null | undefined): string => {
  if (!tempK) return '#9ca3af'; // gray-400
  if (tempK < 150) return '#a7f3d0'; // emerald-200
  if (tempK < 240) return '#67e8f9'; // cyan-300
  if (tempK < 320) return '#60a5fa'; // blue-400
  if (tempK < 400) return '#facc15'; // yellow-400
  return '#f87171'; // red-400
};

export const OrbitalView: React.FC<OrbitalViewProps> = ({ system }) => {
  const size = 300;
  const center = size / 2;

  // Find max AU to scale the view
  const maxAu = Math.max(...system.planets.map(p => p.semi_major_axis_au || 0), 0.1);
  const scale = (size / 2) * 0.9 / maxAu; // 90% of radius

  // Find max period to scale animation speeds (so the outer planet takes ~60s)
  const maxPeriod = Math.max(...system.planets.map(p => p.orbital_period_days || 1), 1);
  const baseAnimationDuration = 60; // seconds

  return (
    <div className="aspect-square w-full bg-black rounded-lg overflow-hidden relative border border-indigo-500/30">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Star */}
        <div 
            className="w-8 h-8 bg-yellow-300 rounded-full shadow-[0_0_20px_10px_rgba(252,211,77,0.5)] z-10"
            title={system.name}
        ></div>

        {/* Orbits and Planets */}
        {system.planets.map((planet: Planet, index: number) => {
          const orbitRadius = (planet.semi_major_axis_au || 0) * scale * 2;
          const planetSize = Math.max(4, Math.min(12, (planet.radius_Re || 1) * 4));
          const animationDuration = (planet.orbital_period_days || 0) / maxPeriod * baseAnimationDuration;

          if (orbitRadius <= 0) return null;
          
          return (
            <div key={planet.name}>
              {/* Orbit Path */}
              <div
                className="orbital-view-orbit"
                style={{
                  width: `${orbitRadius}px`,
                  height: `${orbitRadius}px`,
                }}
              ></div>
              {/* Planet Container for Rotation */}
              <div
                className="orbital-view-planet-container"
                style={{
                  width: `${orbitRadius}px`,
                  height: `${orbitRadius}px`,
                  top: `calc(50% - ${orbitRadius / 2}px)`,
                  left: `calc(50% - ${orbitRadius / 2}px)`,
                  animationDuration: `${animationDuration}s`,
                  animationDelay: `-${(Math.random() * animationDuration).toFixed(2)}s`, // Randomize starting position
                }}
              >
                {/* Planet */}
                <div
                  className="orbital-view-planet group"
                  style={{
                    width: `${planetSize}px`,
                    height: `${planetSize}px`,
                    backgroundColor: getPlanetColor(planet.eq_temp_K),
                  }}
                >
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 bg-gray-900 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {planet.name}
                    </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
