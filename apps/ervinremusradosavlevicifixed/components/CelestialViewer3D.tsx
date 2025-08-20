/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */

import React from 'react';
import type { ErvinRemusResult, ErvinRemusStarSystemResult, MarkedLocation } from './types';

interface CelestialViewer3DProps {
  item: ErvinRemusResult;
  status: 'idle' | 'analyzing';
  markedLocation: MarkedLocation | null;
}

const IMAGE_MAP: Record<string, string> = {
    'Kepler-452 System': 'https://exoplanets.nasa.gov/internal_resources/243_kepler-452b.jpeg',
    'TRAPPIST-1 System': 'https://exoplanets.nasa.gov/system/resources/detail_files/2280_trappist-1-800x600.jpg',
    'Messier 81 (M81)': 'https://esahubble.org/media/archives/images/large/heic0710a.jpg',
};

const LocationMarker: React.FC<{ location: MarkedLocation }> = ({ location }) => (
    <div className="location-marker" style={{ top: location.y, left: location.x }}>
        <div className="marker-reticle"></div>
        <div className="marker-data">
            <div className="label">{location.label}</div>
            {location.details && <div className="details">{location.details}</div>}
        </div>
    </div>
);

const ContainmentMarker: React.FC = () => (
    <div className="containment-marker">
        <div className="containment-reticle"></div>
    </div>
);


const ProceduralGalaxy: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center">
        <div className="w-full h-full procedural-galaxy">
            {[...Array(6)].map((_, i) => (
                <div 
                    key={i} 
                    className="spiral-arm" 
                    style={{ 
                        transform: `rotate(${i * 60}deg) scale(0.8)`,
                        borderTopColor: i % 2 === 0 ? 'rgba(199, 210, 254, 0.5)' : 'rgba(251, 211, 141, 0.4)',
                     }}
                ></div>
            ))}
        </div>
        {[...Array(100)].map((_, i) => (
            <div 
                key={i}
                className="star-particle"
                style={{
                    width: `${Math.random() * 2 + 1}px`,
                    height: `${Math.random() * 2 + 1}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                }}
            />
        ))}
        <div className="galaxy-core"></div>
    </div>
);

const ProceduralStar: React.FC = () => (
    <div className="w-full h-full flex items-center justify-center">
        <div className="procedural-star">
            <div className="star-core"></div>
            <div className="star-surface"></div>
        </div>
    </div>
);


const Viewport: React.FC<{ children?: React.ReactNode; status: string; statusText: string; background?: React.ReactNode }> = ({ children, status, statusText, background }) => (
    <>
        {background}
        <div className="grid-overlay"></div>
        <div className="scan-line-vertical"></div>
        {children}
        <div className="status-overlay text-cyan-400 font-mono uppercase">
            {status === 'analyzing' ? 'ANALYZING...' : `${statusText} LIVE`}
        </div>
    </>
);


export const CelestialViewer3D: React.FC<CelestialViewer3DProps> = ({ item, status, markedLocation }) => {
    
    const renderBackground = () => {
        if (item.isProcedural) {
            return item.type === 'galaxy' ? <ProceduralGalaxy /> : <ProceduralStar />;
        }
        const imageUrl = IMAGE_MAP[item.name] || (item.type === 'star_system' ? '/placeholder_star.svg' : '/placeholder_galaxy.svg');
        return <div className="celestial-background" style={{ backgroundImage: `url(${imageUrl})` }}></div>;
    };

    return (
        <div className="aspect-square w-full bg-black rounded-lg overflow-hidden relative border border-indigo-500/30">
            <Viewport 
                status={status}
                statusText={item.isProcedural ? "PROCEDURAL VIEW" : "TELEMETRY"}
                background={renderBackground()}
            >
                {markedLocation && <LocationMarker location={markedLocation} />}
                {item.status === 'suspect' && <ContainmentMarker />}
            </Viewport>
        </div>
    );
};