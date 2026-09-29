'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, Brain, Target, TrendingUp, Database, Play, Command } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: string) => void;
  onAction: (action: string) => void;
}

const commands = [
  { id: 'overview', label: 'Overview', icon: TrendingUp, type: 'navigate', shortcut: '1' },
  { id: 'strategy', label: 'Strategy Agent', icon: Brain, type: 'navigate', shortcut: '2' },
  { id: 'memories', label: 'Memory Explorer', icon: Database, type: 'navigate', shortcut: '3' },
  { id: 'gaps', label: 'Content Gaps', icon: Target, type: 'navigate', shortcut: '4' },
  { id: 'timeline', label: 'Learning Timeline', icon: TrendingUp, type: 'navigate', shortcut: '5' },
  { id: 'ask', label: 'Ask ContentMind', icon: Zap, type: 'action', shortcut: 'a' },
  { id: 'seed', label: 'Load Demo Memory', icon: Database, type: 'action', shortcut: 's' },
  { id: 'test', label: 'Run System Test', icon: Play, type: 'action', shortcut: 't' },
];

export default function CommandPalette({ isOpen, onClose, onNavigate, onAction }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(0);
  
  const filtered = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleSelect = useCallback((command: typeof commands[0]) => {
    if (command.type === 'navigate') {
      onNavigate(command.id);
    } else {
      onAction(command.id);
    }
    onClose();
    setSearch('');
    setSelected(0);
  }, [onNavigate, onAction, onClose]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected(prev => (prev + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected(prev => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selected]) {
          handleSelect(filtered[selected]);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selected, handleSelect, onClose]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Command Palette */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-2xl surface-elevated rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-[rgb(var(--border-subtle))]">
                <Search className="w-5 h-5 text-dim" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search commands..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelected(0);
                  }}
                  className="flex-1 bg-transparent text-primary placeholder:text-dim outline-none text-lg"
                />
                <div className="flex items-center gap-1 text-xs text-dim">
                  <kbd className="px-2 py-1 surface-secondary rounded text-xs">ESC</kbd>
                </div>
              </div>
              
              {/* Commands List */}
              <div className="max-h-[400px] overflow-y-auto p-2">
                {filtered.length === 0 ? (
                  <div className="p-8 text-center text-dim">
                    No commands found
                  </div>
                ) : (
                  filtered.map((command, index) => {
                    const Icon = command.icon;
                    const isSelected = index === selected;
                    
                    return (
                      <motion.button
                        key={command.id}
                        whileHover={{ x: 2 }}
                        onClick={() => handleSelect(command)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                          isSelected
                            ? 'bg-[rgb(var(--accent-intelligence))]/20 text-primary'
                            : 'text-secondary hover:bg-[rgb(var(--bg-tertiary))]/50'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-intelligence' : 'text-dim'}`} />
                        <span className="flex-1 font-medium">{command.label}</span>
                        {command.shortcut && (
                          <kbd className="px-2 py-1 surface-secondary rounded text-xs text-dim">
                            {command.shortcut}
                          </kbd>
                        )}
                      </motion.button>
                    );
                  })
                )}
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between p-3 border-t border-[rgb(var(--border-subtle))] text-xs text-dim">
                <div className="flex items-center gap-2">
                  <Command className="w-3 h-3" />
                  <span>ContentMind Command Palette</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 surface-secondary rounded">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 surface-secondary rounded">⏎</kbd>
                    Select
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
