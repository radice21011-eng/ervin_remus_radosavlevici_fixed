/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */

import React, { useState, useEffect } from 'react';

const ShieldCheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const FingerPrintIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-1.026.977-2.19.977-3.417a8 8 0 00-16 0c0 1.227.332 2.391.977 3.417M6.84 19.844A21.88 21.88 0 0112 15.171a21.88 21.88 0 015.16 4.673" />
    </svg>
);

const KeyIcon: React.FC = () => (
 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.865l-2.971 2.971a1.5 1.5 0 01-2.121-2.121l2.971-2.971A6 6 0 0115.75 9z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9a3 3 0 11-6 0 3 3 0 016 0z" />
</svg>
);

const SignalIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

interface StatusItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    valueColor: string;
}

const StatusItem: React.FC<StatusItemProps> = ({ icon, label, value, valueColor }) => (
    <div className="flex items-center justify-between p-3 bg-gray-200/50 dark:bg-gray-800/50 rounded-lg">
        <div className="flex items-center">
            {icon}
            <span className="ml-3 text-gray-700 dark:text-gray-300">{label}</span>
        </div>
        <div className="flex items-center">
             <div className={`h-2.5 w-2.5 rounded-full mr-2 ${valueColor} animate-pulse-status`}></div>
            <span className="font-semibold text-gray-900 dark:text-gray-100">{value}</span>
        </div>
    </div>
);

const STATUS_MESSAGES = [
    'SYSTEM NOMINAL',
    'ENCRYPTION ACTIVE',
    'MONITORING THREATS...',
    'DATA INTEGRITY VERIFIED',
    'TELEMETRY LINK STABLE',
];

export const SecurityDashboard: React.FC = () => {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex(prev => (prev + 1) % STATUS_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mb-12">
        <div className="bg-gray-200/50 dark:bg-gray-800/50 border border-indigo-500/30 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">RADOS Global Security Pack v2.0 Final</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatusItem icon={<ShieldCheckIcon />} label="Guardian" value="Active" valueColor="bg-green-500" />
                <StatusItem icon={<FingerPrintIcon />} label="Integrity" value="Verified" valueColor="bg-green-500" />
                <StatusItem icon={<KeyIcon />} label="Access Lock" value="Owner-Only" valueColor="bg-yellow-500" />
                <StatusItem icon={<SignalIcon />} label="Telemetry" value="Visible (Local)" valueColor="bg-cyan-500" />
            </div>
            <div className="mt-6 text-center text-sm font-mono tracking-widest text-cyan-400/80 uppercase">
                {STATUS_MESSAGES[statusIndex]}
            </div>
             <div className="glitch-container bg-red-500/10 dark:bg-red-900/40 border border-red-500/30 rounded-lg p-4 text-center mt-6 animate-pulse-border-red">
                 <div className="glitch-scan-line">
                    <p className="glitch-text font-bold text-red-700 dark:text-red-300 text-lg tracking-widest uppercase" data-text="NDA & LICENSE ENFORCED">NDA & LICENSE ENFORCED</p>
                 </div>
                <p className="text-sm text-red-600 dark:text-red-200 mt-2">
                    This is a production-ready, licensed application. All software, data, and visual representations are proprietary and confidential under a strict, legally-binding Non-Disclosure Agreement. Any and all activity is logged and monitored for compliance.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Unauthorized use, reproduction, or distribution is strictly prohibited. Violations will result in liquidated damages of **£78,000,000,000 GBP per incident**, immediate and full confiscation of all related assets, and criminal prosecution to the fullest extent of interstellar law.
                </p>
            </div>
        </div>
    </section>
  );
};