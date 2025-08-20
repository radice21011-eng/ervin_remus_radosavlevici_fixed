/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */

import React, { useState } from 'react';
import type { Snapshot } from './types';

interface SnapshotPanelProps {
  isOpen: boolean;
  onClose: () => void;
  snapshots: Snapshot[];
  onLoad: (snapshot: Snapshot) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onExport: (snapshot: Snapshot) => void;
}

interface SnapshotItemProps {
  snapshot: Snapshot;
  onLoad: (snapshot: Snapshot) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onExport: (snapshot: Snapshot) => void;
}

const SnapshotItem: React.FC<SnapshotItemProps> = ({ snapshot, onLoad, onDelete, onRename, onExport }) => {
    const [isRenaming, setIsRenaming] = useState(false);
    const [name, setName] = useState(snapshot.name);

    const handleRename = () => {
        if (name.trim() && name.trim() !== snapshot.name) {
            onRename(snapshot.id, name.trim());
        }
        setIsRenaming(false);
    };

    return (
        <li className="bg-gray-200/50 dark:bg-gray-800/50 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-grow">
                {isRenaming ? (
                     <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={handleRename}
                        onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                        autoFocus
                        className="w-full bg-gray-100 dark:bg-gray-700 border border-indigo-500 rounded-md py-1 px-2 text-gray-800 dark:text-gray-200"
                    />
                ) : (
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{snapshot.name}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(snapshot.timestamp).toLocaleString()}
                </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                 <button onClick={() => onLoad(snapshot)} className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors">Load</button>
                 <button onClick={() => setIsRenaming(true)} className="px-3 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-300 dark:bg-gray-700 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors">Rename</button>
                 <button onClick={() => onExport(snapshot)} className="px-3 py-1 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-300 dark:bg-gray-700 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors">Export PDF</button>
                 <button onClick={() => onDelete(snapshot.id)} className="px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-md hover:bg-red-500 transition-colors">Delete</button>
            </div>
        </li>
    );
};

export const SnapshotPanel: React.FC<SnapshotPanelProps> = ({ isOpen, onClose, snapshots, ...rest }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside 
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-gray-100 dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="snapshot-panel-title"
      >
        <div className="flex flex-col h-full">
            <header className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700 flex-shrink-0">
                 <h2 id="snapshot-panel-title" className="text-2xl font-bold text-gray-900 dark:text-gray-100">Manage Snapshots</h2>
                 <button onClick={onClose} className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white" aria-label="Close snapshot panel">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
            </header>
            <div className="flex-grow p-4 overflow-y-auto">
                 {snapshots.length > 0 ? (
                    <ul className="space-y-3">
                        {snapshots.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(snapshot => (
                            <SnapshotItem key={snapshot.id} snapshot={snapshot} {...rest} />
                        ))}
                    </ul>
                 ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500 dark:text-gray-400">No snapshots saved yet.</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Click the 'Save' icon in the header to capture the current state.</p>
                    </div>
                 )}
            </div>
        </div>
      </aside>
    </>
  );
};