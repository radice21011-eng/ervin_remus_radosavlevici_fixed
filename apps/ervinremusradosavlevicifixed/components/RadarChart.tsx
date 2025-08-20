/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */

import React, { useEffect, useState } from 'react';

interface RadarChartDataset {
    label: string;
    data: number[];
    color: string;
}

interface RadarChartData {
    labels: string[];
    datasets: RadarChartDataset[];
}

interface RadarChartProps {
    data: RadarChartData;
}

// Helper to get current theme colors
const getThemeColors = () => {
    if (typeof window === 'undefined') {
        return { grid: '#4A5568', label: '#CBD5E0', tick: '#A0AEC0' };
    }
    const isDark = document.documentElement.classList.contains('dark');
    return {
        grid: isDark ? '#4A5568' : '#D1D5DB', // gray-700 : gray-300
        label: isDark ? '#CBD5E0' : '#374151', // gray-300 : gray-700
        tick: isDark ? '#A0AEC0' : '#6B7280' // gray-400 : gray-500
    };
};

export const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
    const [themeColors, setThemeColors] = useState(getThemeColors);

    useEffect(() => {
        // Update colors when theme changes. We use a mutation observer
        // as a robust way to detect class changes on the root element.
        const observer = new MutationObserver(() => {
            setThemeColors(getThemeColors());
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);
    
    const size = 300;
    const center = size / 2;
    const numLevels = 5;
    const radius = size * 0.4;
    const numAxes = data.labels.length;
    const angleSlice = (Math.PI * 2) / numAxes;

    if (numAxes === 0) return null;

    // Calculate axis points
    const axes = data.labels.map((_, i) => {
        const angle = angleSlice * i - Math.PI / 2;
        return {
            x: center + radius * Math.cos(angle),
            y: center + radius * Math.sin(angle),
        };
    });

    // Calculate data points
    const polygons = data.datasets.map(dataset => {
        const points = dataset.data.map((value, i) => {
            const angle = angleSlice * i - Math.PI / 2;
            const r = radius * Math.max(0, value);
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            return `${x},${y}`;
        }).join(' ');
        return { points, color: dataset.color };
    });

    return (
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
            <g>
                {/* Concentric circles (levels) */}
                {[...Array(numLevels)].map((_, level) => (
                    <circle
                        key={`level-${level}`}
                        cx={center}
                        cy={center}
                        r={(radius / numLevels) * (level + 1)}
                        fill="none"
                        stroke={themeColors.grid}
                        strokeWidth="1"
                    />
                ))}

                {/* Level Labels (e.g., 20, 40, ... 100) */}
                {[...Array(numLevels)].map((_, level) => (
                     <text
                        key={`level-label-${level}`}
                        x={center + 5}
                        y={center - (radius / numLevels) * (level + 1) - 2}
                        fill={themeColors.tick}
                        fontSize="10"
                        textAnchor="start"
                    >
                        {(((level + 1) / numLevels) * 100).toFixed(0)}
                    </text>
                ))}


                {/* Axes lines */}
                {axes.map((axis, i) => (
                    <line
                        key={`axis-line-${i}`}
                        x1={center}
                        y1={center}
                        x2={axis.x}
                        y2={axis.y}
                        stroke={themeColors.grid}
                        strokeWidth="1"
                    />
                ))}

                {/* Axis Labels */}
                {axes.map((axis, i) => {
                    const angle = angleSlice * i - Math.PI / 2;
                    const xOffset = 10 * Math.cos(angle);
                    const yOffset = 10 * Math.sin(angle);
                    let textAnchor = 'middle';
                    if (Math.abs(Math.cos(angle)) < 0.1) textAnchor = 'middle';
                    else if (Math.cos(angle) > 0) textAnchor = 'start';
                    else textAnchor = 'end';
                    
                    return (
                        <text
                            key={`axis-label-${i}`}
                            x={axis.x + xOffset}
                            y={axis.y + yOffset}
                            fill={themeColors.label}
                            fontSize="12"
                            fontWeight="bold"
                            textAnchor={textAnchor}
                            dominantBaseline="middle"
                        >
                            {data.labels[i]}
                        </text>
                    );
                })}

                {/* Data Polygons */}
                {polygons.map((polygon, i) => (
                    <g key={`polygon-${i}`}>
                        <polygon
                            points={polygon.points}
                            fill={polygon.color}
                            fillOpacity="0.3"
                        />
                        <polygon
                            points={polygon.points}
                            fill="none"
                            stroke={polygon.color}
                            strokeWidth="2"
                        />
                    </g>
                ))}
            </g>
        </svg>
    );
};