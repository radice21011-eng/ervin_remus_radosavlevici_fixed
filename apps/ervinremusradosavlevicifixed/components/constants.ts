/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */

import { type CelestialObject, type ErvinRemusWeights } from './types';

export const EXAMPLE_DATASET: CelestialObject[] = [
  {
    "id": "e4a7b7e8-5b0c-4b3d-8f9a-0c1e2d3f4b5a",
    "name": "Kepler-452 System",
    "type": "star_system",
    "star_l_lsun": 1.2,
    "variability": 0.02,
    "threat_level": 0.1,
    "resource_potential": 0.8,
    "economic_value": 1.5e12,
    "planets": [
      {
        "name": "Kepler-452 b",
        "insolation_s_earth": 1.1,
        "eq_temp_K": 265,
        "radius_Re": 1.6,
        "orbital_period_days": 385,
        "semi_major_axis_au": 1.05,
        "resource_potential": 0.8,
        "economic_value": 1.5e12,
        "threat_level": 0.1
      }
    ]
  },
  {
    "id": "f9c8d7e6-4a1b-3c2d-9e8f-1a2b3c4d5e6f",
    "name": "TRAPPIST-1 System",
    "type": "star_system",
    "star_l_lsun": 0.00052,
    "variability": 0.05,
    "threat_level": 0.6,
    "resource_potential": 0.5,
    "economic_value": 8.0e10,
    "planets": [
      {
        "name": "TRAPPIST-1 e",
        "insolation_s_earth": 0.66,
        "eq_temp_K": 251,
        "radius_Re": 0.92,
        "orbital_period_days": 6.1,
        "semi_major_axis_au": 0.029,
        "resource_potential": 0.6,
        "economic_value": 5.0e10,
        "threat_level": 0.5
      },
      {
        "name": "TRAPPIST-1 f",
        "insolation_s_earth": 0.38,
        "eq_temp_K": 219,
        "radius_Re": 1.05,
        "orbital_period_days": 9.2,
        "semi_major_axis_au": 0.038,
        "resource_potential": 0.4,
        "economic_value": 3.0e10,
        "threat_level": 0.7
      }
    ]
  },
  {
    "id": "a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
    "name": "Messier 81 (M81)",
    "type": "galaxy",
    "total_l_lsun": 50000000000.0,
    "variability": 0.2,
    "threat_level": 0.3,
    "resource_potential": 0.95,
    "economic_value": 2.2e15
  }
];

export const DEFAULT_ERVINREMUS_WEIGHTS: ErvinRemusWeights = {
  starSystem: {
    w_eai: 0.35,
    w_hpi: 0.30,
    w_mfi: 0.15,
    w_eci: 0.20,
  },
  galaxy: {
    w_eai: 0.6,
    w_mfi: 0.15,
    w_eci: 0.25,
  },
};