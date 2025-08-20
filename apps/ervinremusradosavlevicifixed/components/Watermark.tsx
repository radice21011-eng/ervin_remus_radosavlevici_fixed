/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */

import React, { useState, useEffect } from 'react';

const WATERMARK_TEXT = `Ervin Remus Radosavlevici - RADOS v5.0 - LIVE FEED`;

export const Watermark: React.FC = () => {
    const [timestamp, setTimestamp] = useState(new Date().toISOString());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimestamp(new Date().toISOString());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const watermarkText = `${WATERMARK_TEXT}\n${timestamp}`;

    // Create a grid of tiles to fill the screen
    const tiles = Array.from({ length: 40 }).map((_, i) => {
        const style: React.CSSProperties = {
            top: `${(i % 8) * 15 - 5}%`,
            left: `${Math.floor(i / 8) * 25 - 5}%`,
            animationDelay: `${(i % 8) * 0.5}s`
        };
        return (
            <div key={i} className="watermark-tile" style={style}>
                {watermarkText}
            </div>
        );
    });

    return (
        <div className="watermark-container" aria-hidden="true">
            {tiles}
        </div>
    );
};