/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */


import { useState, useEffect, useRef, useCallback } from 'react';
import type { CelestialObject, ErvinRemusResult, ErvinRemusWeights } from './types';
import { computeRankings } from './kaieService';
import { EXAMPLE_DATASET } from './constants';

type RankChange = 'up' | 'down' | 'none';
type RankChangeMap = Record<string, RankChange>;

// Helper to safely get/set celestial data from localStorage
const getInitialData = (): CelestialObject[] => {
    try {
        const item = window.localStorage.getItem('ervinRemus_celestialData');
        return item ? JSON.parse(item) : EXAMPLE_DATASET;
    } catch (error) {
        console.warn(`Error reading localStorage for celestialData:`, error);
        return EXAMPLE_DATASET;
    }
};

export const useCelestialData = (ervinRemusWeights: ErvinRemusWeights) => {
  const [celestialData, setCelestialData] = useState<CelestialObject[]>(getInitialData);
  const [rankings, setRankings] = useState<ErvinRemusResult[]>([]);
  
  const [timestamp, setTimestamp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rankChanges, setRankChanges] = useState<RankChangeMap>({});

  // Persist celestial data to localStorage whenever it changes
  useEffect(() => {
    try {
        localStorage.setItem('ervinRemus_celestialData', JSON.stringify(celestialData));
    } catch (error) {
        console.error("Failed to save celestial data to localStorage:", error);
    }
  }, [celestialData]);
  
  const addCelestialObject = useCallback((newObject: CelestialObject) => {
    setCelestialData(prevData => [...prevData, newObject]);
  }, []);
  
  const recalculateAndSetRankings = useCallback((data: CelestialObject[]) => {
      const { results: newResults, timestamp: ts } = computeRankings(data, ervinRemusWeights);
      
      setRankings(previousRankings => {
          if (!previousRankings || previousRankings.length === 0) {
              setRankChanges({});
              return newResults;
          }

          const oldRanks: Record<string, number> = previousRankings.reduce((acc, item, index) => ({...acc, [item.id]: index}), {});
          const newRanks: Record<string, number> = newResults.reduce((acc, item, index) => ({...acc, [item.id]: index}), {});

          const changes: RankChangeMap = {};
          newResults.forEach(item => {
              const oldRank = oldRanks[item.id];
              const newRank = newRanks[item.id];
              if (oldRank === undefined || newRank === undefined || oldRank === newRank) {
                  changes[item.id] = 'none';
              } else if (newRank < oldRank) {
                  changes[item.id] = 'up';
              } else {
                  changes[item.id] = 'down';
              }
          });
          
          setRankChanges(changes);
          return newResults;
      });
      
      setTimestamp(new Date(ts).toLocaleString());
  }, [ervinRemusWeights]);

  const loadSnapshotData = useCallback((snapshotData: CelestialObject[], snapshotTimestamp: string) => {
    setCelestialData(snapshotData);
    // Recalculate rankings based on loaded data and current weights
    const { results, timestamp: ts } = computeRankings(snapshotData, ervinRemusWeights);
    setRankings(results);
    setTimestamp(snapshotTimestamp || new Date(ts).toLocaleString());
    setRankChanges({}); // Reset changes on load
  }, [ervinRemusWeights]);

  // Initial calculation and recalculation on data/weight changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
        recalculateAndSetRankings(celestialData);
    } catch (err) {
        setError('Failed to compute ranking data.');
        console.error(err);
    } finally {
        setLoading(false);
    }
  }, [celestialData, recalculateAndSetRankings]);


   return { 
       rankings, 
       timestamp, 
       loading, 
       error, 
       rankChanges, 
       loadSnapshotData,
       addCelestialObject,
       celestialData, // Expose for snapshot saving
       setCelestialData, // Expose setter for simulation
    };
};
