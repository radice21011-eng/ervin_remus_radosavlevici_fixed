/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */

import type { ReactNode } from 'react';

export interface Planet {
  name: string;
  insolation_s_earth?: number | null;
  eq_temp_K?: number | null;
  radius_Re?: number | null;
  orbital_period_days?: number | null;
  semi_major_axis_au?: number | null;
  resource_potential?: number | null;
  economic_value?: number | null;
  threat_level?: number | null;
}

export interface StarSystem {
  id: string;
  name: string;
  type: 'star_system';
  star_l_lsun?: number | null;
  variability?: number | null;
  planets: Planet[];
  isProcedural?: boolean;
  resource_potential?: number | null; // Aggregate from planets
  economic_value?: number | null; // Aggregate from planets
  threat_level?: number | null; // System-wide threat
  status?: 'suspect' | null;
  status_expiry_year?: number;
}

export interface Galaxy {
  id: string;
  name: string;
  type: 'galaxy';
  total_l_lsun?: number | null;
  variability?: number | null;
  isProcedural?: boolean;
  resource_potential?: number | null;
  economic_value?: number | null;
  threat_level?: number | null;
  status?: 'suspect' | null;
  status_expiry_year?: number;
}

export type CelestialObject = StarSystem | Galaxy;

export interface Coordinates {
    x: number;
    y: number;
}

export interface ErvinRemusStarSystemResult {
    id: string;
    name: string;
    type: 'star_system';
    EAI: number;
    HPI_best: number;
    best_planet: string | null;
    MFI: number;
    ECI: number;
    ERVINREMUS: number;
    planets: Planet[];
    isProcedural?: boolean;
    economic_value?: number | null;
    threat_level?: number | null;
    isAcquired?: boolean;
    coordinates?: Coordinates;
    status?: 'suspect' | null;
    income?: number;
}

export interface ErvinRemusGalaxyResult {
    id: string;
    name: string;
    type: 'galaxy';
    EAI: number;
    MFI: number;
    ECI: number;
    ERVINREMUS: number;
    isProcedural?: boolean;
    economic_value?: number | null;
    threat_level?: number | null;
    isAcquired?: boolean;
    coordinates?: Coordinates;
    status?: 'suspect' | null;
    income?: number;
}

export type ErvinRemusResult = ErvinRemusStarSystemResult | ErvinRemusGalaxyResult;

export type SortKey = 'ERVINREMUS' | 'EAI' | 'HPI_best' | 'MFI' | 'ECI';

export interface SortConfig {
  key: SortKey;
  direction: 'asc' | 'desc';
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
}

export interface AppState {
  rankings: ErvinRemusResult[];
  celestialData: CelestialObject[];
  starSystemSort: SortConfig;
  galaxySort: SortConfig;
  searchQuery: string;
  comparisonList: string[];
  timestamp: string;
  acquiredAssets: string[];
  currentYear: number;
  eventLog: EventLogEntry[];
  capital: number;
}

export interface Snapshot {
    id: string;
    name: string;
    timestamp: string;
    data: AppState;
}

// --- ErvinRemus Algorithm Weights ---

export interface StarSystemWeights {
  w_eai: number;
  w_hpi: number;
  w_mfi: number;
  w_eci: number;
}

export interface GalaxyWeights {
  w_eai: number;
  w_mfi: number;
  w_eci: number;
}

export interface ErvinRemusWeights {
  starSystem: StarSystemWeights;
  galaxy: GalaxyWeights;
}

// --- AI Generated Content ---

export interface StrategicPoint {
  category: 'resource' | 'risk' | 'opportunity' | 'science';
  text: string;
}

export interface MarkedLocation {
    x: string;
    y: string;
    label: string;
    details?: string;
}

export interface MissionStep {
    title: string;
    description: string;
    risk: 'low' | 'medium' | 'high';
}

export type MissionPlan = MissionStep[];

export interface MissionGenerationResult {
    mission_plan: MissionPlan;
    point_of_interest?: MarkedLocation;
}

export interface ContainmentStep {
    stage_name: string;
    objective: string;
    risk_assessment: 'low' | 'medium' | 'high';
}
export type ContainmentPlan = ContainmentStep[];

export interface AIOverview {
    strategic_summary: string;
    top_assets: { name: string, value: string }[];
    emerging_threats: string[];
    capital_flow_analysis: string;
}

// --- UI & System Types ---
export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

export interface Command {
    id: string;
    name: string;
    action: () => void;
    icon?: ReactNode;
    category: string;
}

export type ViewMode = 'list' | 'map';

export type SimulationStatus = 'paused' | 'running';

export interface EventLogEntry {
    id: string;
    year: number;
    message: string;
    objectId?: string;
    objectName?: string;
}