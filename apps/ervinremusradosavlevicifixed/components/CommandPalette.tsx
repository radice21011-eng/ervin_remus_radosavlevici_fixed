/*
 * © 2025 Ervin Remus Radosavlevici. All rights reserved.
 * Watermarked & timestamped: 2025-08-19 Europe/London
 * This file is part of the secured project under authorship of Ervin Remus Radosavlevici.
 */


import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Command } from './types';

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  commands: Command[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, setIsOpen, commands }) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCommands = query
    ? commands.filter(cmd => cmd.name.toLowerCase().includes(query.toLowerCase()))
    : commands;

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
        setQuery('');
        setActiveIndex(0);
    }
  }, [isOpen]);
  
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleSelect = useCallback((command: Command) => {
    command.action();
    setIsOpen(false);
  }, [setIsOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[activeIndex]) {
          handleSelect(filteredCommands[activeIndex]);
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, activeIndex, handleSelect]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/70 backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="relative w-full max-w-lg bg-gray-100/95 dark:bg-gray-800/95 border border-indigo-500/30 rounded-xl shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-3 border-b border-gray-300 dark:border-gray-700">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search commands..."
            className="w-full bg-transparent border-none text-lg text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0"
          />
        </div>
        <div className="flex-grow overflow-y-auto max-h-[60vh] p-2">
          {filteredCommands.length > 0 ? (
            <ul>
              {filteredCommands.map((cmd, index) => (
                <li
                  key={cmd.id}
                  onClick={() => handleSelect(cmd)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`p-3 rounded-lg cursor-pointer flex justify-between items-center text-gray-800 dark:text-gray-200 ${
                    activeIndex === index ? 'bg-indigo-500 text-white' : 'hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <span>{cmd.name}</span>
                  <span className={`text-xs ${activeIndex === index ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'}`}>{cmd.category}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-center text-gray-500">No commands found.</p>
          )}
        </div>
      </div>
    </div>
  );
};
