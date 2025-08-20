/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */

import type { CelestialObject, ErvinRemusResult, StarSystem, Galaxy, Planet, ErvinRemusStarSystemResult, ErvinRemusWeights, StarSystemWeights, GalaxyWeights } from './types';

/**
 * EAI: log10(L/L_sun) scaled to [0,1] in a typical range [-4, 12].
 */
function energyAvailabilityIndex(l_lsun: number | null | undefined): number {
  if (!l_lsun || l_lsun <= 0) {
    return 0.0;
  }
  // -4..12 typical across objects (illustrative bounds)
  const val = Math.log10(l_lsun);
  // scale to 0..1
  return Math.max(0.0, Math.min(1.0, (val + 4) / 16));
}

/**
 * HPI: simple windowing proxy based on insolation closeness to 1.0 and temp band 240..310K.
 */
function habitabilityPotentialIndex(insolation: number | null | undefined, eq_temp_K: number | null | undefined): number {
  if (insolation === null || insolation === undefined || eq_temp_K === null || eq_temp_K === undefined) {
    return 0.0;
  }
  // Insolation closeness
  const inso = Math.max(0.0, 1.0 - Math.min(1.0, Math.abs(insolation - 1.0)));
  
  // Temperature band (triangular between 240 and 310K, peak at ~288K)
  let temp = 0.0;
  if (eq_temp_K >= 240 && eq_temp_K <= 310) {
    const peak = 288.0;
    const half_width = 48.0;
    temp = Math.max(0.0, 1.0 - Math.abs(eq_temp_K - peak) / half_width);
  }
  
  // Combine (geometric mean to reward both)
  return Math.sqrt(Math.max(1e-9, inso) * Math.max(1e-9, temp));
}

/**
 * MFI: favors higher luminosity and lower variability (engineering stability proxy).
 */
function megastructureFeasibilityIndex(l_lsun: number | null | undefined, variability: number | null | undefined): number {
  const eai = energyAvailabilityIndex(l_lsun);
  const var_term = 1.0 - Math.max(0.0, Math.min(1.0, variability ?? 0.5));
  return Math.max(0.0, Math.min(1.0, 0.7 * eai + 0.3 * var_term));
}

/**
 * ECI: Log-scaled economic value. Assumes a max value around 10^18 for scaling.
 */
function economicIndex(value: number | null | undefined): number {
    if (!value || value <= 0) {
        return 0.0;
    }
    const val = Math.log10(value);
    // Scale from a plausible range, e.g., 10^9 to 10^18 (billion to quintillion)
    return Math.max(0.0, Math.min(1.0, (val - 9) / 9));
}

/**
 * Threat Modifier: Penalizes the score based on threat level.
 * A threat of 1.0 reduces the final score by 50%.
 */
function threatModifier(threat: number | null | undefined): number {
    const threatLevel = threat ?? 0;
    return 1.0 - (Math.max(0.0, Math.min(1.0, threatLevel)) * 0.5);
}


/**
 * Composite Scoring for a Star System
 */
function scoreStarSystem(sys: StarSystem, weights: StarSystemWeights): ErvinRemusResult {
  const eai = energyAvailabilityIndex(sys.star_l_lsun);
  
  // Best planet's HPI used as system proxy
  let hpi_best = 0.0;
  let best_planet: string | null = null;
  for (const p of sys.planets) {
    const hpi = habitabilityPotentialIndex(p.insolation_s_earth, p.eq_temp_K);
    if (hpi > hpi_best) {
      hpi_best = hpi;
      best_planet = p.name;
    }
  }

  const mfi = megastructureFeasibilityIndex(sys.star_l_lsun, sys.variability);
  const eci = economicIndex(sys.economic_value);
  const threat = threatModifier(sys.threat_level);
  
  const raw_score = weights.w_eai * eai + weights.w_hpi * hpi_best + weights.w_mfi * mfi + weights.w_eci * eci;
  const score = raw_score * threat;


  return {
    id: sys.id,
    name: sys.name,
    type: 'star_system',
    EAI: parseFloat(eai.toFixed(4)),
    HPI_best: parseFloat(hpi_best.toFixed(4)),
    best_planet: best_planet,
    MFI: parseFloat(mfi.toFixed(4)),
    ECI: parseFloat(eci.toFixed(4)),
    ERVINREMUS: parseFloat(score.toFixed(4)),
    planets: sys.planets,
    isProcedural: sys.isProcedural,
    economic_value: sys.economic_value,
    threat_level: sys.threat_level,
    status: sys.status,
    income: (sys.economic_value ?? 0) * 0.0000000001,
  };
}

/**
 * Composite Scoring for a Galaxy
 */
function scoreGalaxy(gal: Galaxy, weights: GalaxyWeights): ErvinRemusResult {
  const eai = energyAvailabilityIndex(gal.total_l_lsun);
  const mfi = megastructureFeasibilityIndex(gal.total_l_lsun, gal.variability);
  const eci = economicIndex(gal.economic_value);
  const threat = threatModifier(gal.threat_level);

  const raw_score = weights.w_eai * eai + weights.w_mfi * mfi + weights.w_eci * eci;
  const score = raw_score * threat;

  return {
    id: gal.id,
    name: gal.name,
    type: 'galaxy',
    EAI: parseFloat(eai.toFixed(4)),
    MFI: parseFloat(mfi.toFixed(4)),
    ECI: parseFloat(eci.toFixed(4)),
    ERVINREMUS: parseFloat(score.toFixed(4)),
    isProcedural: gal.isProcedural,
    economic_value: gal.economic_value,
    threat_level: gal.threat_level,
    status: gal.status,
    income: (gal.economic_value ?? 0) * 0.0000000001,
  };
}


/**
 * Orchestrator
 */
export function computeRankings(dataset: CelestialObject[], weights: ErvinRemusWeights): { results: ErvinRemusResult[], timestamp: string } {
  const results: ErvinRemusResult[] = [];
  for (const item of dataset) {
    if (item.type === 'star_system') {
      results.push(scoreStarSystem(item, weights.starSystem));
    } else if (item.type === 'galaxy') {
      results.push(scoreGalaxy(item, weights.galaxy));
    }
  }

  // Sort by ERVINREMUS descending
  results.sort((a, b) => b.ERVINREMUS - a.ERVINREMUS);

  return {
    timestamp: new Date().toISOString(),
    results: results,
  };
}

/**
 * Simulates fetching and processing data from an API.
 */
export function fetchAndComputeRankings(dataset: CelestialObject[], weights: ErvinRemusWeights): Promise<{ results: ErvinRemusResult[], timestamp: string }> {
  console.log('Computing rankings from dataset...');
  return new Promise((resolve, reject) => {
    try {
        const result = computeRankings(dataset, weights);
        console.log('Data processing complete.');
        resolve(result);
    } catch (error) {
        console.error('Data processing failed.', error);
        reject(error);
    }
  });
}