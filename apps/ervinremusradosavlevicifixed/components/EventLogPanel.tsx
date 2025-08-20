/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */

import React from 'react';
import type { EventLogEntry } from './types';

interface EventLogPanelProps {
  isOpen: boolean;
  onClose: () => void;
  events: EventLogEntry[];
}

const EventItem: React.FC<{ event: EventLogEntry }> = ({ event }) => {
    return (
        <li className="bg-gray-200/50 dark:bg-gray-800/50 p-3 rounded-lg flex items-start gap-4">
            <div className="flex-shrink-0 font-mono text-indigo-500 dark:text-indigo-400 text-sm pt-0.5">
                GSY {event.year}
            </div>
            <div className="flex-grow text-gray-800 dark:text-gray-200 text-sm">
                {event.message}
            </div>
        </li>
    );
};

export const EventLogPanel: React.FC<EventLogPanelProps> = ({ isOpen, onClose, events }) => {

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
        aria-labelledby="event-panel-title"
      >
        <div className="flex flex-col h-full">
            <header className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700 flex-shrink-0">
                 <h2 id="event-panel-title" className="text-2xl font-bold text-gray-900 dark:text-gray-100">Event Log</h2>
                 <button onClick={onClose} className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white" aria-label="Close event log">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
            </header>
            <div className="flex-grow p-4 overflow-y-auto">
                 {events.length > 0 ? (
                    <ul className="space-y-3">
                        {events.map(event => (
                            <EventItem key={event.id} event={event} />
                        ))}
                    </ul>
                 ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500 dark:text-gray-400">No events have occurred yet.</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Start the simulation to see dynamic events unfold.</p>
                    </div>
                 )}
            </div>
        </div>
      </aside>
    </>
  );
};