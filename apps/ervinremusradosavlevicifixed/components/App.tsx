/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */



import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { v4 as uuidv4 } from 'uuid';
import type { ErvinRemusResult, SortConfig, SortKey, ChatMessage, CelestialObject, Snapshot, AppState, ErvinRemusWeights, ErvinRemusStarSystemResult, ErvinRemusGalaxyResult, Command, ViewMode, SimulationStatus, EventLogEntry, ContainmentPlan, AIOverview, MissionGenerationResult, MarkedLocation } from './types';
import { DEFAULT_ERVINREMUS_WEIGHTS } from './constants';
import { useCelestialData } from './useCelestialData';
import { RankingCard } from './RankingCard';
import { SecurityDashboard } from './SecurityDashboard';
import { SkeletonCard } from './SkeletonCard';
import { SortControls } from './SortControls';
import { SearchInput } from './SearchInput';
import { DetailViewModal } from './DetailViewModal';
import { ComparisonView } from './ComparisonView';
import { ThemeToggle } from './ThemeToggle';
import { SnapshotControls } from './SnapshotControls';
import { SnapshotPanel } from './SnapshotPanel';
import { SettingsPanel } from './SettingsPanel';
import { SettingsButton } from './SettingsButton';
import { Watermark } from './Watermark';
import { useToast } from './ToastProvider';
import { CommandPalette } from './CommandPalette';
import { StarmapView } from './StarmapView';
import { AssetManagerButton } from './AssetManagerButton';
import { AssetManagerPanel } from './AssetManagerPanel';
import { TimeControls } from './TimeControls';
import { EventLogButton } from './EventLogButton';
import { EventLogPanel } from './EventLogPanel';
import { CapitalDisplay } from './CapitalDisplay';
import { AIOverviewModal } from './AIOverviewModal';


// Helper to safely get config from localStorage
const getInitialConfig = <T,>(key: string, defaultConfig: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultConfig;
    } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
        return defaultConfig;
    }
};

type Theme = 'light' | 'dark';

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const GalaxyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline-block text-purple-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 7.113a5.5 5.5 0 014.237-4.237L8 4.632l.555-1.756A5.503 5.503 0 0110 2.5c.194 0 .386.01.574.029l.432-1.365a6.503 6.503 0 00-1.006-.029c-3.584 0-6.5 2.916-6.5 6.5 0 .341.026.676.076 1.003l1.254-.33zM10 17.5a6.5 6.5 0 006.424-5.997l-1.254.33A5.5 5.5 0 0111.43 7.6l-1.888-.598a.5.5 0 00-.582.122L7.6 8.568l-.598-1.888a.5.5 0 00-.122-.582L4.632 8l-1.756.555a5.5 5.5 0 014.237 4.237L8 15.368l.555 1.756A5.503 5.503 0 0110 17.5zm.93-1.077l-1.218-3.85a.5.5 0 00-.597-.37l-3.85 1.218A6.502 6.502 0 0010 17.5c.341 0 .676-.026 1.003-.076l-.073-.23z" clipRule="evenodd" />
    </svg>
);

const App: React.FC = () => {
  const [ervinRemusWeights, setErvinRemusWeights] = useState<ErvinRemusWeights>(() => getInitialConfig('ervinRemus_weights', DEFAULT_ERVINREMUS_WEIGHTS));
  
  const { rankings, timestamp, loading, error, rankChanges, loadSnapshotData, celestialData, setCelestialData, addCelestialObject } = useCelestialData(ervinRemusWeights);
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [comparisonList, setComparisonList] = useState<string[]>([]);
  const [theme, setTheme] = useState<Theme>(() => getInitialConfig<Theme>('ervinRemus_theme', 'dark'));
  const MAX_COMPARE_ITEMS = 4;
  
  const [selectedObject, setSelectedObject] = useState<ErvinRemusResult | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatIsLoading, setChatIsLoading] = useState<boolean>(false);
  const [chatInstance, setChatInstance] = useState<Chat | null>(null);
  const [strategicAnalysis, setStrategicAnalysis] = useState<any[] | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState<boolean>(false);
  const [missionPlan, setMissionPlan] = useState<any | null>(null);
  const [isMissionLoading, setIsMissionLoading] = useState<boolean>(false);
  const [markedLocation, setMarkedLocation] = useState<MarkedLocation | null>(null);
  
  const [containmentPlan, setContainmentPlan] = useState<ContainmentPlan | null>(null);
  const [isContainmentLoading, setIsContainmentLoading] = useState<boolean>(false);
  const [isAIOverviewModalOpen, setIsAIOverviewModalOpen] = useState(false);
  const [aiOverview, setAIOverview] = useState<AIOverview | null>(null);
  const [isAIOverviewLoading, setIsAIOverviewLoading] = useState(false);

  const [snapshots, setSnapshots] = useState<Snapshot[]>(() => getInitialConfig<Snapshot[]>('ervinRemus_snapshots', []));
  const [isSnapshotPanelOpen, setIsSnapshotPanelOpen] = useState<boolean>(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [acquiredAssets, setAcquiredAssets] = useState<Set<string>>(() => new Set(getInitialConfig<string[]>('ervinRemus_acquiredAssets', [])));
  const [isAssetManagerOpen, setIsAssetManagerOpen] = useState(false);
  const [showThreatOverlay, setShowThreatOverlay] = useState(false);
  
  const [simulationStatus, setSimulationStatus] = useState<SimulationStatus>('paused');
  const [currentYear, setCurrentYear] = useState(() => getInitialConfig('ervinRemus_currentYear', 2800));
  const [eventLog, setEventLog] = useState<EventLogEntry[]>(() => getInitialConfig('ervinRemus_eventLog', []));
  const [isEventLogOpen, setIsEventLogOpen] = useState(false);
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);
  
  const [capital, setCapital] = useState(() => getInitialConfig('ervinRemus_capital', 1000000));
  const [isGeneratingObject, setIsGeneratingObject] = useState(false);


  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.API_KEY as string }), []);

  const [starSystemSort, setStarSystemSort] = useState<SortConfig>(() => getInitialConfig('ervinRemus_starSystemSort', { key: 'ERVINREMUS', direction: 'desc' }));
  const [galaxySort, setGalaxySort] = useState<SortConfig>(() => getInitialConfig('ervinRemus_galaxySort', { key: 'ERVINREMUS', direction: 'desc' }));

  useEffect(() => { localStorage.setItem('ervinRemus_starSystemSort', JSON.stringify(starSystemSort)); }, [starSystemSort]);
  useEffect(() => { localStorage.setItem('ervinRemus_galaxySort', JSON.stringify(galaxySort)); }, [galaxySort]);
  useEffect(() => { localStorage.setItem('ervinRemus_snapshots', JSON.stringify(snapshots)); }, [snapshots]);
  useEffect(() => { localStorage.setItem('ervinRemus_weights', JSON.stringify(ervinRemusWeights)); }, [ervinRemusWeights]);
  useEffect(() => { localStorage.setItem('ervinRemus_acquiredAssets', JSON.stringify(Array.from(acquiredAssets))); }, [acquiredAssets]);
  useEffect(() => { localStorage.setItem('ervinRemus_currentYear', JSON.stringify(currentYear)); }, [currentYear]);
  useEffect(() => { localStorage.setItem('ervinRemus_eventLog', JSON.stringify(eventLog)); }, [eventLog]);
  useEffect(() => { localStorage.setItem('ervinRemus_capital', JSON.stringify(capital)); }, [capital]);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('ervinRemus_theme', theme);
  }, [theme]);
  
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setIsCommandPaletteOpen(o => !o); } };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // --- "Chronos" & "Prometheus" Simulation Loop ---
  useEffect(() => {
      if (simulationStatus === 'running') {
          simulationInterval.current = setInterval(() => {
              const nextYear = currentYear + 1;
              setCurrentYear(nextYear);

              let wasUpdated = false;
              let updatedData = [...celestialData];
              
              let income = 0;
              for (const assetId of acquiredAssets) {
                  const asset = updatedData.find(d => d.id === assetId);
                  if (asset) income += (asset.economic_value ?? 0) * 0.0000000001;
              }
              if (income > 0) setCapital(c => c + income);

              updatedData = updatedData.map(obj => {
                  if (obj.status && obj.status_expiry_year && nextYear >= obj.status_expiry_year) {
                      wasUpdated = true;
                      const message = `Anomaly near ${obj.name} cleared. System returning to nominal threat levels.`;
                      setEventLog(prev => [{ id: uuidv4(), year: nextYear, message, objectId: obj.id, objectName: obj.name }, ...prev].slice(0, 100));
                      addToast(`Status normal for ${obj.name}`, 'info');
                      return { ...obj, status: null, status_expiry_year: undefined, threat_level: (obj.threat_level ?? 0.5) / 2 };
                  }
                  return obj;
              });

              updatedData = updatedData.map(obj => {
                  if (obj.economic_value) {
                      const fluctuation = (Math.random() - 0.5) * 0.02; // +/- 1%
                      return { ...obj, economic_value: Math.max(0, obj.economic_value * (1 + fluctuation)) };
                  }
                  return obj;
              });

              if (Math.random() < 0.02) { 
                  wasUpdated = true;
                  const targetIndex = Math.floor(Math.random() * updatedData.length);
                  const targetObject = updatedData[targetIndex];
                  targetObject.status = 'suspect';
                  targetObject.status_expiry_year = nextYear + Math.floor(Math.random() * 5) + 1;
                  targetObject.threat_level = 1.0;
                  const message = `Anomalous signals detected near ${targetObject.name}. Object status is... suspect.`;
                  addToast(message, 'error');
                  setEventLog(prev => [{ id: uuidv4(), year: nextYear, message, objectId: targetObject.id, objectName: targetObject.name }, ...prev].slice(0, 100));

              } else if (Math.random() < 0.1) {
                  wasUpdated = true;
                  const targetIndex = Math.floor(Math.random() * updatedData.length);
                  const targetObject = updatedData[targetIndex];
                  const eventType = ['boom', 'bust', 'threat', 'discovery'][Math.floor(Math.random() * 4)];
                  let message = '';

                  switch(eventType) {
                      case 'boom':
                          const boomFactor = 1.1 + Math.random() * 0.2;
                          targetObject.economic_value = (targetObject.economic_value || 1e9) * boomFactor;
                          message = `Economic boom in ${targetObject.name}. Value increased by ${(boomFactor * 100 - 100).toFixed(0)}%.`;
                          addToast(message, 'success');
                          break;
                      case 'bust':
                           const bustFactor = 0.7 + Math.random() * 0.2;
                           targetObject.economic_value = (targetObject.economic_value || 1e9) * bustFactor;
                           message = `Recession hits ${targetObject.name}. Value decreased by ${(100 - bustFactor * 100).toFixed(0)}%.`;
                           addToast(message, 'error');
                           break;
                      case 'threat':
                           targetObject.threat_level = Math.min(1.0, (targetObject.threat_level || 0) + 0.1 + Math.random() * 0.2);
                           message = `Anomalous energy signatures increase threat level in ${targetObject.name}.`;
                           addToast(message, 'error');
                           break;
                      case 'discovery':
                           targetObject.resource_potential = Math.min(1.0, (targetObject.resource_potential || 0) + 0.1 + Math.random() * 0.1);
                           message = `New valuable resources discovered in ${targetObject.name}.`;
                           addToast(message, 'info');
                           break;
                  }
                  setEventLog(prev => [{ id: uuidv4(), year: nextYear, message, objectId: targetObject.id, objectName: targetObject.name }, ...prev].slice(0, 100));
              }
              
              if (wasUpdated) setCelestialData(updatedData);

          }, 2000);
      } else if (simulationInterval.current) {
          clearInterval(simulationInterval.current);
      }
      return () => { if (simulationInterval.current) clearInterval(simulationInterval.current); };
  }, [simulationStatus, celestialData, setCelestialData, addToast, currentYear, acquiredAssets]);

  const filteredRankings = useMemo(() => {
    if (!searchQuery) return rankings;
    return rankings.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [rankings, searchQuery]);

  const starmapData = useMemo(() => {
      return rankings.map(r => ({
          ...r,
          coordinates: r.coordinates || { x: Math.random(), y: Math.random() }
      }));
  }, [rankings]);

  const starSystems = useMemo(() => filteredRankings.filter((r): r is ErvinRemusStarSystemResult => r.type === 'star_system'), [filteredRankings]);
  const galaxies = useMemo(() => filteredRankings.filter((r): r is ErvinRemusGalaxyResult => r.type === 'galaxy'), [filteredRankings]);
  
  const sortData = <T extends ErvinRemusResult>(data: T[], sortConfig: SortConfig) => {
    return [...data].sort((a, b) => {
        const key = sortConfig.key as keyof T;
        const aVal = a[key] as number;
        const bVal = b[key] as number;
        return sortConfig.direction === 'desc' ? bVal - aVal : aVal - bVal;
    });
  };

  const sortedStarSystems = useMemo(() => sortData(starSystems, starSystemSort), [starSystems, starSystemSort]);
  const sortedGalaxies = useMemo(() => sortData(galaxies, galaxySort), [galaxies, galaxySort]);
  
  const handleSortChange = useCallback((setter: React.Dispatch<React.SetStateAction<SortConfig>>) => (key: SortKey) => {
    setter(prev => ({ key, direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc' }));
  }, []);

  const handleSelectObject = useCallback(async (item: ErvinRemusResult) => {
    setSelectedObject(item);
    setIsDetailModalOpen(true);
    setChatHistory([]);
    setChatInstance(null);
    setStrategicAnalysis(null);
    setMissionPlan(null);
    setContainmentPlan(null);
    setMarkedLocation(null);
    
    setIsAnalysisLoading(true);
    try {
        const analysisPrompt = `Based on the following data for "${item.name}", provide a concise strategic analysis. Identify key points for resources, risks, opportunities, and science. Data: ${JSON.stringify(item)}`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', contents: analysisPrompt,
            config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { analysisPoints: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, text: { type: Type.STRING } } } } } }
        });
        const jsonResponse = JSON.parse(response.text);
        setStrategicAnalysis(jsonResponse.analysisPoints);
    } catch (err) {
        console.error("Strategic Analysis error:", err);
        setStrategicAnalysis([{ category: 'risk', text: 'Analysis generation failed.' }]);
    } finally {
        setIsAnalysisLoading(false);
    }
  }, [ai]);
  
  const handleSendMessage = useCallback(async (message: string) => {
      if (!selectedObject) return;
  
      const userMessage: ChatMessage = { role: 'user', content: message };
      setChatHistory(prev => [...prev, userMessage]);
      setChatIsLoading(true);
      setChatHistory(prev => [...prev, { role: 'model', content: '' }]);
  
      try {
          let currentChat = chatInstance;
          if (!currentChat) {
              const systemInstruction = `You are Ervin Remus, an AI strategic advisor. Your task is to provide analysis on the celestial object: ${JSON.stringify(selectedObject)}. Be concise, insightful, and stay in character. The current year is ${currentYear}.`;
              currentChat = ai.chats.create({ model: 'gemini-2.5-flash', config: { systemInstruction } });
              setChatInstance(currentChat);
          }
  
          const stream = await currentChat.sendMessageStream({ message });
          let text = '';
          for await (const chunk of stream) {
              text += chunk.text;
              setChatHistory(prev => {
                  const newHistory = [...prev];
                  newHistory[newHistory.length - 1] = { role: 'model', content: text };
                  return newHistory;
              });
          }
      } catch (err) {
          console.error("Chat error:", err);
           setChatHistory(prev => {
                  const newHistory = [...prev];
                  newHistory[newHistory.length - 1] = { role: 'model', content: 'Error communicating with the AI advisor.' };
                  return newHistory;
              });
      } finally {
          setChatIsLoading(false);
      }
  }, [selectedObject, chatInstance, ai, currentYear]);

  const handleGenerateMission = useCallback(async (item: ErvinRemusResult) => {
      setIsMissionLoading(true);
      setMissionPlan(null);
      setMarkedLocation(null);
      addToast(`Generating mission plan for ${item.name}...`, 'info');
      try {
          const prompt = `Generate a multi-phase strategic mission plan for "${item.name}". If it is a star system, also identify a specific "Point of Interest" with coordinates as percentages (e.g., x: "50%", y: "30%") and a label. Data: ${JSON.stringify(item)}`;
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash', contents: prompt,
              config: {
                  responseMimeType: "application/json",
                  responseSchema: {
                      type: Type.OBJECT, properties: {
                          mission_plan: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, risk: { type: Type.STRING } } } },
                          point_of_interest: { type: Type.OBJECT, properties: { x: { type: Type.STRING }, y: { type: Type.STRING }, label: { type: Type.STRING }, details: { type: Type.STRING } } }
                      }
                  }
              }
          });
          const jsonResponse: MissionGenerationResult = JSON.parse(response.text);
          setMissionPlan(jsonResponse.mission_plan);
          if (jsonResponse.point_of_interest) setMarkedLocation(jsonResponse.point_of_interest);
          addToast(`Mission plan for ${item.name} generated.`, 'success');
      } catch (err) {
          console.error("Mission Plan generation error:", err);
          addToast(`Failed to generate mission plan.`, 'error');
      } finally {
          setIsMissionLoading(false);
      }
  }, [ai, addToast]);

  const handleGenerateContainmentPlan = useCallback(async (item: ErvinRemusResult) => {
      setIsContainmentLoading(true);
      setContainmentPlan(null);
      addToast(`Generating containment plan for ${item.name}...`, 'info');
      try {
          const prompt = `Generate a multi-stage strategic containment protocol for a suspicious celestial anomaly named "${item.name}". The protocol should identify potential threats and outline steps for investigation, quarantine, and neutralization. Data: ${JSON.stringify(item)}.`;
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash', contents: prompt,
              config: {
                  responseMimeType: "application/json",
                  responseSchema: { type: Type.OBJECT, properties: { containment_plan: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { stage_name: { type: Type.STRING }, objective: { type: Type.STRING }, risk_assessment: { type: Type.STRING } } } } } }
              }
          });
          const jsonResponse = JSON.parse(response.text);
          setContainmentPlan(jsonResponse.containment_plan);
          addToast(`Containment plan for ${item.name} generated.`, 'success');
      } catch (err) {
          console.error("Containment Plan error:", err);
          addToast(`Failed to generate containment plan.`, 'error');
          setContainmentPlan([{ stage_name: 'Generation Failed', objective: 'AI service failed. Check console.', risk_assessment: 'high' }]);
      } finally {
          setIsContainmentLoading(false);
      }
  }, [ai, addToast]);
  
  const handleGenerateAIOverview = useCallback(async () => {
      setIsAIOverviewModalOpen(true);
      setIsAIOverviewLoading(true);
      setAIOverview(null);
      try {
          const prompt = `Provide a global strategic analysis based on the current state. Portfolio value: ${capital}, Acquired Assets: ${Array.from(acquiredAssets).map(id => rankings.find(r=>r.id===id)?.name).join(', ')}. Analyze capital flow, top assets, and emerging threats based on the full dataset: ${JSON.stringify(rankings.slice(0, 10))}.`;
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash', contents: prompt,
              config: {
                  responseMimeType: "application/json",
                  responseSchema: { type: Type.OBJECT, properties: { strategic_summary: {type: Type.STRING}, top_assets: {type: Type.ARRAY, items: {type: Type.OBJECT, properties: {name: {type: Type.STRING}, value: {type: Type.STRING}}}}, emerging_threats: {type: Type.ARRAY, items: {type: Type.STRING}}, capital_flow_analysis: {type: Type.STRING} } }
              }
          });
          const jsonResponse = JSON.parse(response.text);
          setAIOverview(jsonResponse);
      } catch(err) {
          console.error("AI Overview error:", err);
          addToast('Failed to generate AI Global Overview.', 'error');
          setAIOverview({ strategic_summary: 'Error generating analysis.', top_assets: [], emerging_threats: [], capital_flow_analysis: 'N/A' });
      } finally {
          setIsAIOverviewLoading(false);
      }
  }, [ai, addToast, capital, acquiredAssets, rankings]);
  
  const handleGenerateNewObject = useCallback(async () => {
    setIsGeneratingObject(true);
    addToast('Scanning for new celestial objects...', 'info');
    try {
        const prompt = `Generate a new, scientifically plausible but fictional celestial object, either a star system with 1-5 planets or a galaxy. It should not be a real, known object. Provide its data in the specified JSON format. Ensure all numerical values are within reasonable astronomical ranges. The ID must be a new UUID. The name should be unique and sound like a survey designation (e.g., 'Xylos-7 System' or 'NGC-9934 Analog'). Set isProcedural to true. Provide an economic value between 1e9 and 1e14. Provide a threat level between 0.0 and 1.0. The object status must be null.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        object: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.STRING },
                                name: { type: Type.STRING },
                                type: { type: Type.STRING, enum: ['star_system', 'galaxy'] },
                                star_l_lsun: { type: Type.NUMBER, nullable: true },
                                total_l_lsun: { type: Type.NUMBER, nullable: true },
                                variability: { type: Type.NUMBER, nullable: true },
                                threat_level: { type: Type.NUMBER },
                                economic_value: { type: Type.NUMBER },
                                isProcedural: { type: Type.BOOLEAN },
                                planets: {
                                    type: Type.ARRAY,
                                    nullable: true,
                                    items: {
                                        type: Type.OBJECT,
                                        properties: {
                                            name: { type: Type.STRING },
                                            insolation_s_earth: { type: Type.NUMBER, nullable: true },
                                            eq_temp_K: { type: Type.NUMBER, nullable: true },
                                            radius_Re: { type: Type.NUMBER, nullable: true },
                                            orbital_period_days: { type: Type.NUMBER, nullable: true },
                                            semi_major_axis_au: { type: Type.NUMBER, nullable: true },
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        const jsonResponse = JSON.parse(response.text);
        const newObject = jsonResponse.object;
        
        if (newObject && newObject.id && newObject.name && newObject.type) {
            addCelestialObject(newObject);
            addToast(`New object discovered: ${newObject.name}`, 'success');
        } else {
            throw new Error("Generated object has invalid format.");
        }
    } catch(err) {
        console.error("Procedural Generation error:", err);
        addToast('Failed to generate new celestial object.', 'error');
    } finally {
        setIsGeneratingObject(false);
    }
  }, [ai, addToast, addCelestialObject]);

  const handleCloseDetailModal = useCallback(() => setIsDetailModalOpen(false), []);

  const handleAcquireAsset = useCallback((id: string) => {
      setAcquiredAssets(prev => {
          const newSet = new Set(prev);
          if (!newSet.has(id)) {
              newSet.add(id);
              addToast(`${rankings.find(r => r.id === id)?.name} acquired!`, 'success');
          }
          return newSet;
      });
  }, [addToast, rankings]);

  const handleIntervention = useCallback((objectId: string, action: 'invest' | 'defend' | 'explore', cost: number) => {
      if (capital < cost) {
          addToast("Insufficient capital.", 'error');
          return;
      }
      setCapital(c => c - cost);
      
      let message = '';
      setCelestialData(prevData => {
          const newData = [...prevData];
          const targetIndex = newData.findIndex(o => o.id === objectId);
          if (targetIndex === -1) return prevData;
          const targetObject = { ...newData[targetIndex] };
          
          if (Math.random() < 0.8) { // Success
              switch(action) {
                  case 'invest':
                      targetObject.economic_value = (targetObject.economic_value ?? 0) * 1.1;
                      message = `Investment in ${targetObject.name} boosted economic value.`;
                      addToast(message, 'success');
                      break;
                  case 'defend':
                      targetObject.threat_level = Math.max(0, (targetObject.threat_level ?? 0) - 0.1);
                      message = `Defenses bolstered at ${targetObject.name}, reducing threat.`;
                      addToast(message, 'success');
                      break;
                  case 'explore':
                      targetObject.resource_potential = Math.min(1.0, (targetObject.resource_potential ?? 0) + 0.05);
                      message = `Exploration at ${targetObject.name} yielded new resource potential.`;
                      addToast(message, 'success');
                      break;
              }
          } else { // Failure
              message = `Strategic intervention at ${targetObject.name} failed. Capital lost.`;
              addToast(message, 'error');
          }
          
          newData[targetIndex] = targetObject;
          setEventLog(prev => [{ id: uuidv4(), year: currentYear, message, objectId: targetObject.id, objectName: targetObject.name }, ...prev].slice(0, 100));
          return newData;
      });
  }, [capital, addToast, currentYear]);

  const handleToggleComparison = useCallback((itemId: string) => {
      setComparisonList(prev => {
          const newSet = new Set(prev);
          if (newSet.has(itemId)) newSet.delete(itemId);
          else if (newSet.size < MAX_COMPARE_ITEMS) newSet.add(itemId);
          else addToast(`Cannot compare more than ${MAX_COMPARE_ITEMS} items.`, 'error');
          return Array.from(newSet);
      });
  }, [addToast]);

  const handleClearComparison = useCallback(() => setComparisonList([]), []);

  // --- Snapshot Handlers ---
  const handleSaveSnapshot = useCallback(() => {
      const name = prompt("Enter a name for this snapshot:", `Snapshot ${new Date().toLocaleString()}`);
      if (name) {
          const appState: AppState = { rankings, celestialData, starSystemSort, galaxySort, searchQuery, comparisonList, timestamp, acquiredAssets: Array.from(acquiredAssets), currentYear, eventLog, capital };
          const newSnapshot: Snapshot = { id: uuidv4(), name, timestamp: new Date().toISOString(), data: appState };
          setSnapshots(prev => [newSnapshot, ...prev]);
          addToast(`Snapshot "${name}" saved successfully.`, 'success');
      }
  }, [rankings, celestialData, starSystemSort, galaxySort, searchQuery, comparisonList, timestamp, acquiredAssets, currentYear, eventLog, capital, addToast]);
  
  const handleLoadSnapshot = useCallback((snapshot: Snapshot) => {
      if (window.confirm(`Load snapshot "${snapshot.name}"? This will overwrite your current state.`)) {
          loadSnapshotData(snapshot.data.celestialData, snapshot.data.timestamp);
          setStarSystemSort(snapshot.data.starSystemSort);
          setGalaxySort(snapshot.data.galaxySort);
          setSearchQuery(snapshot.data.searchQuery);
          setComparisonList(snapshot.data.comparisonList);
          setAcquiredAssets(new Set(snapshot.data.acquiredAssets));
          setCurrentYear(snapshot.data.currentYear);
          setEventLog(snapshot.data.eventLog);
          setCapital(snapshot.data.capital);
          addToast(`Snapshot "${snapshot.name}" loaded.`, 'info');
          setIsSnapshotPanelOpen(false);
      }
  }, [loadSnapshotData, addToast]);

  const handleDeleteSnapshot = useCallback((id: string) => {
      if (window.confirm("Are you sure you want to delete this snapshot?")) {
          setSnapshots(prev => prev.filter(s => s.id !== id));
          addToast('Snapshot deleted.', 'error');
      }
  }, [addToast]);

  const handleRenameSnapshot = useCallback((id: string, newName: string) => {
      setSnapshots(prev => prev.map(s => s.id === id ? { ...s, name: newName } : s));
      addToast('Snapshot renamed.', 'info');
  }, [addToast]);

  const exportSnapshotToPDF = useCallback((snapshot: Snapshot) => {
    const doc = new jsPDF();
    const data = snapshot.data;
    doc.setFontSize(18);
    doc.text(`RADOS Strategic Snapshot: ${snapshot.name}`, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date(snapshot.timestamp).toLocaleString()}`, 14, 30);
    doc.text(`Data Timestamp: ${data.timestamp}`, 14, 36);

    const starSystems = data.rankings.filter(r => r.type === 'star_system');
    const galaxies = data.rankings.filter(r => r.type === 'galaxy');

    if (starSystems.length > 0) {
        (doc as any).autoTable({
            startY: 45,
            head: [['Rank', 'Name', 'Score', 'Econ Value', 'Threat']],
            body: starSystems.map((s, i) => [i + 1, s.name, s.ERVINREMUS.toFixed(4), `§${(s.economic_value || 0).toExponential(2)}`, `${((s.threat_level || 0) * 100).toFixed(0)}%`]),
            headStyles: { fillColor: [74, 85, 104] },
            didDrawPage: (data: any) => { doc.setFontSize(14); doc.text("Star Systems Analysis", 14, data.cursor.y - 10); }
        });
    }

    if (galaxies.length > 0) {
        (doc as any).autoTable({
            startY: (doc as any).lastAutoTable.finalY + 20,
            head: [['Rank', 'Name', 'Score', 'Econ Value', 'Threat']],
            body: galaxies.map((g, i) => [i + 1, g.name, g.ERVINREMUS.toFixed(4), `§${(g.economic_value || 0).toExponential(2)}`, `${((g.threat_level || 0) * 100).toFixed(0)}%`]),
            headStyles: { fillColor: [74, 85, 104] },
            didDrawPage: (data: any) => { doc.setFontSize(14); doc.text("Galaxy Analysis", 14, data.cursor.y - 10); }
        });
    }

    doc.save(`${snapshot.name.replace(/\s/g, '_')}.pdf`);
    addToast('Snapshot exported to PDF.', 'success');
  }, [addToast]);

  const handleResetWeights = useCallback(() => {
    if (window.confirm("Reset weights to default?")) {
      setErvinRemusWeights(DEFAULT_ERVINREMUS_WEIGHTS);
      addToast('Algorithm weights reset.', 'info');
    }
  }, [addToast]);
  
  const toggleTheme = useCallback(() => setTheme(t => t === 'light' ? 'dark' : 'light'), []);

  const commands: Command[] = useMemo(() => [
      { id: 'global-analysis', name: 'Run Global Strategic Analysis', action: handleGenerateAIOverview, category: 'AI' },
      { id: 'generate-object', name: 'Scan for New Celestial Object', action: handleGenerateNewObject, category: 'AI' },
      { id: 'toggle-sim', name: `Toggle Simulation (${simulationStatus})`, action: () => setSimulationStatus(s => s === 'paused' ? 'running' : 'paused'), category: 'Simulation' },
      { id: 'save-snapshot', name: 'Save Snapshot', action: handleSaveSnapshot, category: 'Data' },
      { id: 'manage-snapshots', name: 'Manage Snapshots', action: () => setIsSnapshotPanelOpen(true), category: 'Data' },
      { id: 'open-settings', name: 'Open Algorithm Settings', action: () => setIsSettingsPanelOpen(true), category: 'System' },
      { id: 'open-assets', name: 'Open Asset Manager', action: () => setIsAssetManagerOpen(true), category: 'System' },
      { id: 'open-log', name: 'Open Event Log', action: () => setIsEventLogOpen(true), category: 'System' },
      { id: 'toggle-theme', name: 'Toggle Theme', action: toggleTheme, category: 'System' },
      { id: 'toggle-threat', name: 'Toggle Threat Overlay', action: () => setShowThreatOverlay(s => !s), category: 'View' },
  ], [simulationStatus, handleGenerateAIOverview, handleGenerateNewObject, handleSaveSnapshot, toggleTheme]);

  const EmptyState = ({ query }: { query?: string }) => (
    <div className="text-center py-16 col-span-full">
        <h3 className="mt-2 text-lg font-medium">No Results Found</h3>
        <p className="mt-1 text-sm text-gray-500">{query ? `Your search for "${query}" did not return any results.` : "No items to display."}</p>
    </div>
  );
  
  return (
    <div className={`h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300`}>
      <Watermark />
      <CommandPalette isOpen={isCommandPaletteOpen} setIsOpen={setIsCommandPaletteOpen} commands={commands} />
      
      <header className="flex-shrink-0 container mx-auto px-4 pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <div className="relative">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 title-glow">Ervin Remus Radosavlevici</h1>
            <span className="absolute -top-2 -right-24 text-xs font-mono bg-green-500/20 text-green-300 px-2 py-0.5 rounded-md border border-green-500/50">RADOS v5.0</span>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Last update: {timestamp}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button onClick={handleGenerateNewObject} disabled={isGeneratingObject} className="px-3 py-2 text-sm font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-500 transition-colors shadow disabled:bg-teal-800 disabled:cursor-wait">
              {isGeneratingObject ? 'Scanning...' : 'Scan for New Objects'}
            </button>
            <button onClick={handleGenerateAIOverview} className="px-3 py-2 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow">Global Analysis</button>
            <CapitalDisplay capital={capital} />
            <TimeControls status={simulationStatus} onToggle={() => setSimulationStatus(s => s === 'paused' ? 'running' : 'paused')} currentYear={currentYear} />
            <SnapshotControls onSave={handleSaveSnapshot} onManage={() => setIsSnapshotPanelOpen(true)} />
            <AssetManagerButton onClick={() => setIsAssetManagerOpen(true)} assetCount={acquiredAssets.size} />
            <EventLogButton onClick={() => setIsEventLogOpen(true)} />
            <SettingsButton onClick={() => setIsSettingsPanelOpen(true)} />
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-grow">
            <SearchInput value={searchQuery} onChange={setSearchQuery} onCommandPaletteOpen={() => setIsCommandPaletteOpen(true)} placeholder="Search celestial objects..." />
          </div>
          <div className="flex items-center p-1 rounded-lg bg-gray-200/60 dark:bg-gray-800/60">
             <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-300/50 dark:hover:bg-gray-700/50'}`}>List</button>
             <button onClick={() => setViewMode('map')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'map' ? 'bg-indigo-600 text-white' : 'hover:bg-gray-300/50 dark:hover:bg-gray-700/50'}`}>Map</button>
          </div>
        </div>
        
        {error && <div className="text-center text-red-500 bg-red-500/10 p-4 rounded-lg mb-4">{error}</div>}
      </header>

      <main className="flex-grow overflow-hidden container mx-auto px-4 pb-8">
        {viewMode === 'map' ? (
          <StarmapView data={starmapData} onSelectObject={handleSelectObject} showThreatOverlay={showThreatOverlay} onToggleThreatOverlay={() => setShowThreatOverlay(s => !s)} />
        ) : (
          <div className="h-full overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />) : (
              <>
                 <div className="md:col-span-2 lg:col-span-3">
                  <SecurityDashboard />
                </div>
                {sortedStarSystems.length === 0 && sortedGalaxies.length === 0 ? <EmptyState query={searchQuery}/> : null}

                <div className="contents">
                    {sortedStarSystems.length > 0 && (
                        <>
                            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-indigo-500/30 pb-2 col-span-full flex items-center gap-2">
                                <StarIcon /> Star Systems
                            </h2>
                            <div className="col-span-full"><SortControls sortConfig={starSystemSort} onSortChange={handleSortChange(setStarSystemSort)} availableSorters={['ERVINREMUS', 'EAI', 'HPI_best', 'MFI', 'ECI']} /></div>
                            {sortedStarSystems.map((item) => (
                                <RankingCard key={item.id} item={item} rank={rankings.findIndex(r => r.id === item.id) + 1} rankChange={rankChanges[item.id] || 'none'} onSelectObject={handleSelectObject} onToggleComparison={handleToggleComparison} isSelectedForComparison={comparisonList.includes(item.id)} isComparisonDisabled={comparisonList.length >= MAX_COMPARE_ITEMS && !comparisonList.includes(item.id)} isAcquired={acquiredAssets.has(item.id)} status={item.status} />
                            ))}
                        </>
                    )}

                    {sortedGalaxies.length > 0 && (
                        <>
                           <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 border-b-2 border-indigo-500/30 pb-2 mt-8 col-span-full flex items-center gap-2">
                               <GalaxyIcon /> Galaxies
                            </h2>
                           <div className="col-span-full"><SortControls sortConfig={galaxySort} onSortChange={handleSortChange(setGalaxySort)} availableSorters={['ERVINREMUS', 'EAI', 'MFI', 'ECI']} /></div>
                            {sortedGalaxies.map((item) => (
                                <RankingCard key={item.id} item={item} rank={rankings.findIndex(r => r.id === item.id) + 1} rankChange={rankChanges[item.id] || 'none'} onSelectObject={handleSelectObject} onToggleComparison={handleToggleComparison} isSelectedForComparison={comparisonList.includes(item.id)} isComparisonDisabled={comparisonList.length >= MAX_COMPARE_ITEMS && !comparisonList.includes(item.id)} isAcquired={acquiredAssets.has(item.id)} status={item.status} />
                            ))}
                        </>
                    )}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      <ComparisonView items={rankings.filter(r => comparisonList.includes(r.id))} onRemove={handleToggleComparison} onClear={handleClearComparison} />
      
      {selectedObject && (
        <DetailViewModal
            isOpen={isDetailModalOpen} onClose={handleCloseDetailModal} item={selectedObject}
            rank={rankings.findIndex(r => r.id === selectedObject.id) + 1}
            chatHistory={chatHistory} onSendMessage={handleSendMessage} isLoading={chatIsLoading}
            strategicAnalysis={strategicAnalysis} isAnalysisLoading={isAnalysisLoading}
            missionPlan={missionPlan} isMissionLoading={isMissionLoading} onGenerateMission={handleGenerateMission}
            markedLocation={markedLocation}
            isAcquired={acquiredAssets.has(selectedObject.id)}
            onAcquire={handleAcquireAsset}
            containmentPlan={containmentPlan}
            isContainmentLoading={isContainmentLoading}
            onGenerateContainmentPlan={handleGenerateContainmentPlan}
            onIntervention={handleIntervention}
            capital={capital}
        />
      )}

      <AIOverviewModal isOpen={isAIOverviewModalOpen} onClose={() => setIsAIOverviewModalOpen(false)} overview={aiOverview} isLoading={isAIOverviewLoading} onGenerate={handleGenerateAIOverview} />
      <SnapshotPanel isOpen={isSnapshotPanelOpen} onClose={() => setIsSnapshotPanelOpen(false)} snapshots={snapshots} onLoad={handleLoadSnapshot} onDelete={handleDeleteSnapshot} onRename={handleRenameSnapshot} onExport={exportSnapshotToPDF} />
      <AssetManagerPanel isOpen={isAssetManagerOpen} onClose={() => setIsAssetManagerOpen(false)} assets={rankings.filter(r => acquiredAssets.has(r.id))} />
      <EventLogPanel isOpen={isEventLogOpen} onClose={() => setIsEventLogOpen(false)} events={eventLog} />
      <SettingsPanel isOpen={isSettingsPanelOpen} onClose={() => setIsSettingsPanelOpen(false)} weights={ervinRemusWeights} onWeightsChange={setErvinRemusWeights} onReset={handleResetWeights} />
    </div>
  );
};

export default App;