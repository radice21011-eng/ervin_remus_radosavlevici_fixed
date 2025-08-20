/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */

import React from 'react';

interface LoginScreenProps {
  onAcknowledge: () => void;
}

const asciiArt = `
            ⣠⣤⣤⣤⣤⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ 
            ⢰⡿⠋⠁⠀⠀⠈⠉⠙⠻⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ 
            ⢀⣿⠇⠀⢀⣴⣶⡾⠿⠿⠿⢿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ 
            ⣀⣀⣸⡿⠀⠀⢸⣿⣇⠀⠀⠀⠀⠀⠀⠙⣷⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ 
            ⣾⡟⠛⣿⡇⠀⠀⢸⣿⣿⣷⣤⣤⣤⣤⣶⣶⣿⠇⠀⠀⠀⠀⠀⠀⠀⣀⠀⠀ 
            ⢀⣿⠀⢀⣿⡇⠀⠀⠀⠻⢿⣿⣿⣿⣿⣿⠿⣿⡏⠀⠀⠀⠀⢴⣶⣶⣿⣿⣿⣆ 
            ⢸⣿⠀⢸⣿⡇⠀⠀⠀⠀⠀⠈⠉⠁⠀⠀⠀⣿⡇⣀⣠⣴⣾⣮⣝⠿⠿⠿⣻⡟ 
            ⢸⣿⠀⠘⣿⡇⠀⠀⠀⠀⠀⠀⠀⣠⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁⠉⠀ 
            ⠸⣿⠀⠀⣿⡇⠀⠀⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠉⠀⠀⠀⠀ 
            ⠀⠻⣷⣶⣿⣇⠀⠀⠀⢠⣼⣿⣿⣿⣿⣿⣿⣿⣛⣛⣻⠉⠁⠀⠀⠀⠀⠀⠀⠀ 
            ⠀⠀⠀⠀⢸⣿⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇
`;

export const LoginScreen: React.FC<LoginScreenProps> = ({ onAcknowledge }) => {
  return (
    <div className="h-screen w-screen bg-gray-900 text-gray-300 flex flex-col items-center justify-center p-4 font-mono">
      <div className="text-center animate-fade-in">
        <pre 
          className="text-sm sm:text-base text-indigo-400 title-glow"
          style={{ textShadow: '0 0 8px rgba(129, 140, 248, 0.5)' }}
          aria-hidden="true"
        >
          {asciiArt}
        </pre>
        <div className="mt-8 max-w-2xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-100 font-sans">RADOS v5.0 - Secure Access Portal</h1>
          <p className="mt-4 text-sm text-red-400">
            NOTICE: This system is classified and proprietary.
          </p>
          <div className="mt-4 text-xs text-gray-400 text-left border border-gray-700 bg-gray-800/50 p-4 rounded-lg font-sans">
            <p className="font-bold">© Ervin Remus Radosavlevici [ervin210@icloud.com], Owner, 2025</p>
            <p className="mt-2">All rights reserved. This software and its associated data are the confidential and proprietary information of the owner. Unauthorized access, copying, redistribution, modification, or use is strictly prohibited and constitutes a breach of the Non-Disclosure Agreement.</p>
            <p className="mt-2">Violators will be subject to legal action, including but not limited to, liquidated damages of £78,000,000,000 GBP, and prosecution under all applicable interstellar laws.</p>
          </div>
          <button 
            onClick={onAcknowledge}
            className="mt-8 px-8 py-3 text-base font-bold text-white bg-indigo-600 rounded-lg border border-indigo-500 shadow-lg shadow-indigo-600/30
                       hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-300 font-sans"
          >
            Acknowledge & Proceed
          </button>
        </div>
      </div>
    </div>
  );
};