/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */

import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="relative rounded-xl p-0.5 bg-gray-300 dark:bg-gray-700/50 animate-pulse">
        <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-6 h-full">
            <div className="flex justify-between items-start">
              <div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded-full w-24 mb-2"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-md w-48"></div>
              </div>
              <div className="bg-gray-200 dark:bg-gray-900/50 rounded-full w-16 h-16 border-2 border-gray-300 dark:border-gray-700"></div>
            </div>

            <div className="mt-6 border-t border-gray-300 dark:border-gray-700/50 pt-4">
                <div className="text-center mb-4">
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded-full w-32 mx-auto mb-2"></div>
                    <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-md w-40 mx-auto"></div>
                </div>
                <div className="space-y-4">
                    {/* Placeholder for ScoreBar */}
                    <div className="w-full">
                        <div className="flex justify-between items-center mb-1">
                            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded-full w-28"></div>
                            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded-full w-12"></div>
                        </div>
                        <div className="w-full bg-gray-300 dark:bg-gray-700/50 rounded-full h-2.5"></div>
                    </div>
                    {/* Placeholder for ScoreBar */}
                    <div className="w-full">
                        <div className="flex justify-between items-center mb-1">
                            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded-full w-36"></div>
                            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded-full w-12"></div>
                        </div>
                        <div className="w-full bg-gray-300 dark:bg-gray-700/50 rounded-full h-2.5"></div>
                    </div>
                    {/* Placeholder for ScoreBar */}
                    <div className="w-full">
                        <div className="flex justify-between items-center mb-1">
                            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded-full w-40"></div>
                            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded-full w-12"></div>
                        </div>
                        <div className="w-full bg-gray-300 dark:bg-gray-700/50 rounded-full h-2.5"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};