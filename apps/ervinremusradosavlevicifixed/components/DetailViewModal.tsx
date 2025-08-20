/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */

import React, { useState, useRef, useEffect } from 'react';
import type { ErvinRemusResult, ErvinRemusStarSystemResult, ChatMessage, Planet, StrategicPoint, MarkedLocation, MissionPlan, ContainmentPlan } from './types';
import { CelestialViewer3D } from './CelestialViewer3D';
import { OrbitalView } from './OrbitalView';

interface DetailViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: ErvinRemusResult;
    rank: number;
    chatHistory: ChatMessage[];
    onSendMessage: (message: string) => void;
    isLoading: boolean;
    strategicAnalysis: StrategicPoint[] | null;
    isAnalysisLoading: boolean;
    missionPlan: MissionPlan | null;
    isMissionLoading: boolean;
    onGenerateMission: (item: ErvinRemusResult) => void;
    markedLocation: MarkedLocation | null;
    isAcquired: boolean;
    onAcquire: (id: string) => void;
    containmentPlan: ContainmentPlan | null;
    isContainmentLoading: boolean;
    onGenerateContainmentPlan: (item: ErvinRemusResult) => void;
    onIntervention: (objectId: string, action: 'invest' | 'defend' | 'explore', cost: number) => void;
    capital: number;
}

const DataPill: React.FC<{ label: string; value?: string | number | null; unit?: string; children?: React.ReactNode }> = ({ label, value, unit, children }) => (
    <div className="bg-gray-200 dark:bg-gray-900/70 p-3 rounded-lg text-center">
        <p className="text-xs text-indigo-600 dark:text-indigo-300 uppercase tracking-wider">{label}</p>
        {children ? (
             <div className="text-xl font-semibold text-gray-900 dark:text-white">{children}</div>
        ) : (
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {value ?? 'N/A'}
                {value && unit && <span className="text-base font-normal text-gray-500 dark:text-gray-400 ml-1">{unit}</span>}
            </p>
        )}
    </div>
);

const PlanetInfo: React.FC<{ planet: Planet }> = ({ planet }) => (
    <div className="bg-gray-200/60 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-300 dark:border-gray-600/50">
        <p className="font-bold text-indigo-700 dark:text-indigo-300">{planet.name}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-xs text-gray-800 dark:text-gray-200">
            <p><span className="text-gray-500 dark:text-gray-400">Insolation:</span> {planet.insolation_s_earth?.toFixed(2) ?? 'N/A'}</p>
            <p><span className="text-gray-500 dark:text-gray-400">Eq. Temp:</span> {planet.eq_temp_K ?? 'N/A'} K</p>
            <p><span className="text-gray-500 dark:text-gray-400">Radius:</span> {planet.radius_Re?.toFixed(2) ?? 'N/A'} R⊕</p>
            <p><span className="text-gray-500 dark:text-gray-400">Period:</span> {planet.orbital_period_days ?? 'N/A'} days</p>
            <p><span className="text-gray-500 dark:text-gray-400">Axis:</span> {planet.semi_major_axis_au ?? 'N/A'} AU</p>
        </div>
    </div>
);

const formatCapital = (value: number): string => {
    if (value >= 1e12) return `§${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `§${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `§${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `§${(value / 1e3).toFixed(1)}K`;
    return `§${value.toFixed(0)}`;
};

const ActionButton: React.FC<{ title: string; cost: number; capital: number; onClick: () => void; children: React.ReactNode; }> = ({ title, cost, capital, onClick, children }) => (
    <button
        onClick={onClick}
        disabled={capital < cost}
        className="action-button text-gray-800 dark:text-gray-200"
    >
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-indigo-500/20 rounded-lg text-indigo-500 dark:text-indigo-300">
            {children}
        </div>
        <div className="flex-grow">
            <span className="action-button-title">{title}</span>
            <p className="text-sm text-gray-500 dark:text-gray-400">Execute strategic intervention.</p>
        </div>
        <div className="text-right">
             <span className="action-button-cost">Cost: {formatCapital(cost)}</span>
        </div>
    </button>
);


const ResourceIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const RiskIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const OpportunityIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const ScienceIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>;
const QuarantineIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const categoryIcons: Record<StrategicPoint['category'], React.ReactNode> = {
    resource: <ResourceIcon />,
    risk: <RiskIcon />,
    opportunity: <OpportunityIcon />,
    science: <ScienceIcon />,
};

const StrategicAnalysisSkeleton: React.FC = () => (
    <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
             <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
                <div className="flex-grow space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-5/6"></div>
                </div>
            </div>
        ))}
    </div>
);

const formatValue = (value: number): string => {
    if (value >= 1e12) return `§${(value / 1e12).toFixed(2)} T`;
    if (value >= 1e9) return `§${(value / 1e9).toFixed(2)} B`;
    if (value >= 1e6) return `§${(value / 1e6).toFixed(2)} M`;
    return `§${value.toLocaleString()}`;
}

type Tab = 'overview' | 'planets' | 'orbital' | 'analysis' | 'mission' | 'quarantine' | 'chat' | 'actions';

export const DetailViewModal: React.FC<DetailViewModalProps> = ({ isOpen, onClose, item, rank, chatHistory, onSendMessage, isLoading, strategicAnalysis, isAnalysisLoading, missionPlan, isMissionLoading, onGenerateMission, markedLocation, isAcquired, onAcquire, containmentPlan, isContainmentLoading, onGenerateContainmentPlan, onIntervention, capital }) => {
    const [newMessage, setNewMessage] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory, isLoading]);
    
    // Reset to overview tab when a new item is selected
    useEffect(() => {
        if(isOpen) {
            setActiveTab(item.status === 'suspect' ? 'quarantine' : 'overview');
        }
    }, [item.id, isOpen, item.status]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(newMessage);
            setNewMessage('');
        }
    };
    
    const isStarSystem = item.type === 'star_system';
    const starSystemItem = isStarSystem ? (item as ErvinRemusStarSystemResult) : null;

    if (!isOpen) return null;

    const riskColorMap: Record<'low' | 'medium' | 'high', string> = {
        low: 'text-green-400 border-green-500/50 bg-green-500/10',
        medium: 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10',
        high: 'text-red-400 border-red-500/50 bg-red-500/10',
    };
    
    const threatLevel = item.threat_level ?? 0;
    const threatColor = threatLevel > 0.66 ? 'text-red-400' : threatLevel > 0.33 ? 'text-yellow-400' : 'text-green-400';

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="relative w-full max-w-6xl h-[90vh] bg-gray-100/80 dark:bg-gray-800/80 border border-indigo-500/30 rounded-xl shadow-2xl flex overflow-hidden transform transition-all duration-300 scale-95"
                style={isOpen ? { opacity: 1, transform: 'scale(1)' } : {}}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors z-30"
                    aria-label="Close modal"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {item.status === 'suspect' && (
                     <div className="absolute top-0 left-0 right-0 z-20 p-2 text-center bg-red-500/80 text-white font-bold glitch-container animate-pulse-border-red">
                         <p className="glitch-text uppercase tracking-widest" data-text="Suspicious Anomaly Detected">Suspicious Anomaly Detected</p>
                    </div>
                )}
                
                <div className="w-full h-full flex flex-col md:flex-row">
                    {/* Left Panel: 3D Viewer & Core Info */}
                    <aside className="w-full md:w-1/3 bg-gray-200/50 dark:bg-gray-900/50 p-6 flex flex-col pt-12">
                        <div className="mb-6 flex-shrink-0">
                             {activeTab === 'orbital' && starSystemItem ? (
                               <OrbitalView system={starSystemItem} />
                            ) : (
                               <CelestialViewer3D item={item} status={isLoading ? 'analyzing' : 'idle'} markedLocation={markedLocation} />
                            )}
                        </div>
                        
                        <div>
                            <div className="flex justify-between items-start">
                                 <p className="text-sm font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
                                    {item.type.replace('_', ' ')}
                                </p>
                                 <div className="text-center bg-gray-100 dark:bg-gray-900/50 text-yellow-500 dark:text-yellow-300 rounded-full px-3 py-1 border border-yellow-400/50 flex-shrink-0">
                                    <span className="text-xs font-semibold">RANK</span>
                                    <span className="text-lg font-bold ml-2">{rank}</span>
                                </div>
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-1">{item.name}</h2>
                        </div>
                    </aside>

                    {/* Right Panel: Tabs & Content */}
                    <main className="w-full md:w-2/3 p-6 flex flex-col pt-12 overflow-hidden">
                        <div className="flex border-b border-gray-400 dark:border-gray-700 mb-4 flex-shrink-0 overflow-x-auto">
                            {item.status === 'suspect' && <button className={`tab-button quarantine-tab ${activeTab === 'quarantine' ? 'active' : ''}`} onClick={() => setActiveTab('quarantine')}><QuarantineIcon/>Quarantine</button>}
                            <button className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
                            {isAcquired && item.status !== 'suspect' && <button className={`tab-button ${activeTab === 'actions' ? 'active' : ''}`} onClick={() => setActiveTab('actions')}>Actions</button>}
                            {isStarSystem && <button className={`tab-button ${activeTab === 'planets' ? 'active' : ''}`} onClick={() => setActiveTab('planets')}>System</button>}
                            {isStarSystem && <button className={`tab-button ${activeTab === 'orbital' ? 'active' : ''}`} onClick={() => setActiveTab('orbital')}>Orbital</button>}
                            <button className={`tab-button ${activeTab === 'analysis' ? 'active' : ''}`} onClick={() => setActiveTab('analysis')}>Analysis</button>
                            <button className={`tab-button ${activeTab === 'mission' ? 'active' : ''}`} onClick={() => setActiveTab('mission')}>Mission</button>
                            <button className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>Chat</button>
                        </div>
                        
                        <div className="flex-grow overflow-y-auto pr-2">
                             {activeTab === 'quarantine' && (
                                <div className="tab-content">
                                    {!containmentPlan && !isContainmentLoading && (
                                        <div className="text-center p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                            <h4 className="font-bold text-red-700 dark:text-red-300">Containment Protocol Required</h4>
                                            <p className="mt-2 mb-4 text-sm text-red-800 dark:text-red-200">This asset exhibits anomalous behavior. Generate a strategic containment plan to assess the threat.</p>
                                            <button 
                                                onClick={() => onGenerateContainmentPlan(item)}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
                                            >
                                                Initiate Containment Scan
                                            </button>
                                        </div>
                                    )}
                                    {isContainmentLoading && <StrategicAnalysisSkeleton />}
                                    {containmentPlan && (
                                         <div className="space-y-4">
                                            {containmentPlan.map((step, index) => (
                                                <div key={index} className="bg-gray-200/60 dark:bg-gray-700/50 p-4 rounded-lg">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="font-bold text-indigo-700 dark:text-indigo-300">Stage {index + 1}: {step.stage_name}</h4>
                                                        <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full border ${riskColorMap[step.risk_assessment as keyof typeof riskColorMap]}`}>{step.risk_assessment}</span>
                                                    </div>
                                                    <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">{step.objective}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            {activeTab === 'overview' && (
                                <div className="tab-content space-y-3">
                                    <DataPill label="Composite Score" value={item.ERVINREMUS.toFixed(4)} />
                                    <div className="grid grid-cols-2 gap-2">
                                         <DataPill label="Economic Value">
                                            <p>{item.economic_value ? formatValue(item.economic_value) : 'N/A'}</p>
                                        </DataPill>
                                        <DataPill label="Threat Level">
                                            <p className={threatColor}>{(threatLevel * 100).toFixed(0)}%</p>
                                        </DataPill>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        <DataPill label="EAI" value={(item.EAI * 100).toFixed(1)} unit="%" />
                                        {starSystemItem && <DataPill label="HPI" value={(starSystemItem.HPI_best * 100).toFixed(1)} unit="%" />}
                                        <DataPill label="MFI" value={(item.MFI * 100).toFixed(1)} unit="%" />
                                        <DataPill label="ECI" value={(item.ECI * 100).toFixed(1)} unit="%" />
                                    </div>
                                     <div className="pt-4 relative group">
                                         <button
                                            onClick={() => onAcquire(item.id)}
                                            disabled={isAcquired || item.status === 'suspect'}
                                            className="w-full px-4 py-3 font-bold text-lg rounded-lg transition-colors duration-200 disabled:cursor-not-allowed
                                                bg-green-600 text-white hover:bg-green-500 disabled:bg-green-800/50 disabled:text-green-300/50"
                                        >
                                            {isAcquired ? 'Asset Acquired' : 'Acquire Asset'}
                                        </button>
                                        {item.status === 'suspect' && (
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max p-2 bg-gray-900 text-gray-200 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                Cannot acquire anomalous asset. Quarantine protocol required.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {activeTab === 'actions' && (
                               <div className="tab-content space-y-3">
                                   <ActionButton title="Invest in Economy" cost={100000} capital={capital} onClick={() => onIntervention(item.id, 'invest', 100000)}>
                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                   </ActionButton>
                                   <ActionButton title="Bolster Defenses" cost={75000} capital={capital} onClick={() => onIntervention(item.id, 'defend', 75000)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                   </ActionButton>
                                    <ActionButton title="Fund Exploration" cost={50000} capital={capital} onClick={() => onIntervention(item.id, 'explore', 50000)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /></svg>
                                    </ActionButton>
                               </div>
                            )}
                            {activeTab === 'planets' && starSystemItem && (
                                <div className="tab-content space-y-2">
                                    {starSystemItem.planets.map(p => <PlanetInfo key={p.name} planet={p} />)}
                                </div>
                            )}
                             {activeTab === 'orbital' && (
                               <div className="tab-content text-center text-gray-500 dark:text-gray-400">
                                   {isStarSystem ? 'Orbital view is active in the main display.' : 'Orbital view only available for star systems.'}
                               </div>
                            )}
                            {activeTab === 'analysis' && (
                                <div className="tab-content">
                                    {isAnalysisLoading ? <StrategicAnalysisSkeleton /> : (
                                        <ul className="space-y-4">
                                            {strategicAnalysis?.map((point, index) => (
                                                <li key={index} className="flex items-start gap-3 text-sm text-gray-800 dark:text-gray-200">
                                                    <div className="flex-shrink-0 mt-0.5">{categoryIcons[point.category as keyof typeof categoryIcons]}</div>
                                                    <p className="leading-relaxed">{point.text}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                            {activeTab === 'mission' && (
                                <div className="tab-content">
                                    {!missionPlan && !isMissionLoading && (
                                        <div className="text-center">
                                            <p className="mb-4 text-gray-600 dark:text-gray-300">Generate a strategic mission plan for {item.name}.</p>
                                            <button 
                                                onClick={() => onGenerateMission(item)}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
                                            >
                                                Generate Plan
                                            </button>
                                        </div>
                                    )}
                                    {isMissionLoading && <StrategicAnalysisSkeleton />}
                                    {missionPlan && (
                                         <div className="space-y-4">
                                            {missionPlan.map((step, index) => (
                                                <div key={index} className="bg-gray-200/60 dark:bg-gray-700/50 p-4 rounded-lg">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="font-bold text-indigo-700 dark:text-indigo-300">Phase {index + 1}: {step.title}</h4>
                                                        <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full border ${riskColorMap[step.risk as keyof typeof riskColorMap]}`}>{step.risk}</span>
                                                    </div>
                                                    <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">{step.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                             {activeTab === 'chat' && (
                               <div className="tab-content h-full flex flex-col">
                                   <div ref={chatContainerRef} className="flex-grow overflow-y-auto pr-2 space-y-4 -mr-2">
                                      {chatHistory.length === 0 && !isLoading && (
                                        <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                                          <p className="font-semibold">AI Advisor Online</p>
                                          <p className="text-sm">Ask anything about {item.name}.</p>
                                        </div>
                                      )}
                                      {chatHistory.map((msg, index) => (
                                          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                              <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                                                  <p className="whitespace-pre-wrap leading-relaxed">
                                                      {msg.content}
                                                      {isLoading && msg.role === 'model' && index === chatHistory.length - 1 && <span className="blinking-cursor">▍</span>}
                                                  </p>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                                   <div className="mt-4 flex-shrink-0">
                                      <form onSubmit={handleSubmit} className="flex items-center gap-3">
                                          <input
                                              type="text"
                                              value={newMessage}
                                              onChange={(e) => setNewMessage(e.target.value)}
                                              placeholder={isLoading ? "Advisor is thinking..." : "Ask a follow-up question..."}
                                              disabled={isLoading}
                                              className="flex-grow bg-gray-200 dark:bg-gray-700/80 border border-gray-400 dark:border-gray-600 rounded-lg py-2 px-4 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                                          />
                                          <button type="submit" disabled={isLoading || !newMessage.trim()} className="bg-indigo-600 text-white rounded-lg p-2 hover:bg-indigo-500 transition-colors disabled:bg-indigo-400 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed">
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                          </button>
                                      </form>
                                  </div>
                               </div>
                            )}
                        </div>
                    </main>
                </div>

            </div>
        </div>
    );
};