'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Command, Sparkles, Target, Brain, Clock, 
  MessageSquare, Calendar, TrendingUp, Users, FileText,
  ArrowRight, Zap, Eye, Activity, X
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: 'suggested' | 'navigation' | 'action';
  keywords: string[];
  action: () => void;
}

interface RecentItem {
  id: string;
  title: string;
  type: 'viewed' | 'generated' | 'learned';
  timestamp: Date;
}

interface CommandCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: string) => void;
}

export default function CommandCenter({ isOpen, onClose, onNavigate }: CommandCenterProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const recentItems: RecentItem[] = [
    { id: '1', title: 'Overview Dashboard', type: 'viewed', timestamp: new Date(Date.now() - 180000) },
    { id: '2', title: 'Cybersecurity Strategy', type: 'generated', timestamp: new Date(Date.now() - 360000) },
    { id: '3', title: 'Tutorial Preference', type: 'learned', timestamp: new Date(Date.now() - 660000) },
  ];

  // Define all commands with proper categories
  const commands: CommandItem[] = useMemo(() => [
    // Suggested (most commonly used)
    {
      id: 'analyze',
      title: 'Analyze Topic',
      description: 'Deep dive into performance of specific topics',
      icon: TrendingUp,
      category: 'suggested',
      keywords: ['analyze', 'topic', 'performance', 'cyber'],
      action: () => { onNavigate('overview'); onClose(); },
    },
    {
      id: 'highperforming',
      title: 'Find High Performing Content',
      description: 'See what works best with your audience',
      icon: TrendingUp,
      category: 'suggested',
      keywords: ['high', 'best', 'top', 'performing'],
      action: () => { onNavigate('overview'); onClose(); },
    },
    {
      id: 'audience',
      title: 'Show Audience Preferences',
      description: 'View what your audience likes',
      icon: Users,
      category: 'suggested',
      keywords: ['audience', 'preferences', 'likes'],
      action: () => { onNavigate('memories'); onClose(); },
    },
    // Navigation
    {
      id: 'overview',
      title: 'View Overview',
      description: 'Mission control dashboard',
      icon: Activity,
      category: 'navigation',
      keywords: ['overview', 'dashboard', 'home'],
      action: () => { onNavigate('overview'); onClose(); },
    },
    {
      id: 'strategy',
      title: 'Open Strategy Agent',
      description: 'AI-powered content recommendations',
      icon: Sparkles,
      category: 'navigation',
      keywords: ['strategy', 'agent', 'ask'],
      action: () => { onNavigate('strategy'); onClose(); },
    },
    {
      id: 'memory',
      title: 'Explore Memory',
      description: 'Browse ContentMind\'s knowledge',
      icon: Brain,
      category: 'navigation',
      keywords: ['memory', 'knowledge', 'brain'],
      action: () => { onNavigate('memories'); onClose(); },
    },
    {
      id: 'gaps',
      title: 'View Content Gaps',
      description: 'Discover opportunities',
      icon: Target,
      category: 'navigation',
      keywords: ['gaps', 'opportunities', 'missing'],
      action: () => { onNavigate('gaps'); onClose(); },
    },
    {
      id: 'timeline',
      title: 'View Learning Timeline',
      description: 'ContentMind\'s evolution',
      icon: Clock,
      category: 'navigation',
      keywords: ['learning', 'timeline', 'history'],
      action: () => { onNavigate('timeline'); onClose(); },
    },
    // Actions
    {
      id: 'weekly',
      title: 'Generate Weekly Strategy',
      description: 'Create content calendar',
      icon: Calendar,
      category: 'action',
      keywords: ['weekly', 'plan', 'calendar', 'generate'],
      action: () => { onNavigate('strategy'); onClose(); },
    },
    {
      id: 'teach',
      title: 'Teach ContentMind',
      description: 'Provide feedback',
      icon: MessageSquare,
      category: 'action',
      keywords: ['teach', 'feedback', 'learn'],
      action: () => { onNavigate('strategy'); onClose(); },
    },
    {
      id: 'analyze-content',
      title: 'Analyze New Content',
      description: 'Evaluate content ideas',
      icon: FileText,
      category: 'action',
      keywords: ['analyze', 'new', 'content', 'evaluate'],
      action: () => { onNavigate('strategy'); onClose(); },
    },
  ], [onNavigate, onClose]);

  // Filter commands
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;

    const lowerQuery = query.toLowerCase();
    return commands.filter(cmd => 
      cmd.title.toLowerCase().includes(lowerQuery) ||
      cmd.description.toLowerCase().includes(lowerQuery) ||
      cmd.keywords.some(kw => kw.includes(lowerQuery) || lowerQuery.includes(kw))
    );
  }, [query, commands]);

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups = {
      suggested: filteredCommands.filter(c => c.category === 'suggested'),
      navigation: filteredCommands.filter(c => c.category === 'navigation'),
      action: filteredCommands.filter(c => c.category === 'action'),
    };
    return groups;
  }, [filteredCommands]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Scroll selected command into view
  useEffect(() => {
    if (resultsRef.current && selectedIndex >= 0) {
      const selected = resultsRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      selected?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const formatTimeAgo = (date: Date) => {
    const mins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[100]"
          />

          {/* Command Palette - Properly Centered */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 4 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="pointer-events-auto flex flex-col w-full bg-[rgb(var(--bg-secondary))]/95 backdrop-blur-xl border border-[rgb(var(--border-subtle))]/80 rounded-[20px] overflow-hidden"
              style={{
                maxWidth: 'min(760px, calc(100vw - 48px))',
                maxHeight: 'min(680px, calc(100vh - 80px))',
                boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(168, 85, 247, 0.15)',
              }}
            >
              {/* FIXED HEADER */}
              <div className="flex-shrink-0 px-5 pt-5 pb-4">
                {/* Title Row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[rgb(var(--accent-intelligence))] to-[rgb(var(--accent-ai))] flex items-center justify-center">
                      <Command className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-base font-bold text-primary">
                      ContentMind Command Center
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-7 h-7 rounded-lg bg-[rgb(var(--bg-tertiary))] hover:bg-[rgb(var(--bg-elevated))] flex items-center justify-center transition-colors text-dim hover:text-secondary"
                  >
                    <span className="text-xs font-medium">ESC</span>
                  </button>
                </div>

                {/* Subtitle */}
                <p className="text-xs text-tertiary mb-4">
                  Search memory, run actions, or ask ContentMind
                </p>

                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dim pointer-events-none" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search commands or ask ContentMind..."
                    className="w-full h-[54px] pl-11 pr-20 bg-[rgb(var(--bg-tertiary))]/80 border border-[rgb(var(--border-subtle))]/60 rounded-[14px] text-sm text-primary placeholder-dim focus:outline-none focus:border-intelligence/50 focus:ring-2 focus:ring-intelligence/20 transition-all overflow-hidden text-ellipsis whitespace-nowrap"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-[rgb(var(--bg-elevated))] border border-[rgb(var(--border-subtle))] rounded text-[10px] text-tertiary font-mono">
                      ⌘K
                    </kbd>
                  </div>
                </div>
              </div>

              {/* SCROLLABLE RESULTS */}
              <div 
                ref={resultsRef}
                className="flex-1 min-h-0 overflow-y-auto px-5 pb-3"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgb(var(--border-medium)) transparent',
                }}
              >
                {filteredCommands.length > 0 ? (
                  <div className="space-y-5">
                    {/* Suggested */}
                    {!query && groupedCommands.suggested.length > 0 && (
                      <div>
                        <p className="text-[10px] text-tertiary uppercase tracking-wider font-semibold mb-2 px-1">
                          Suggested
                        </p>
                        <div className="space-y-0.5">
                          {groupedCommands.suggested.map((cmd, idx) => {
                            const Icon = cmd.icon;
                            const globalIndex = commands.indexOf(cmd);
                            const isSelected = globalIndex === selectedIndex;
                            
                            return (
                              <CommandRow
                                key={cmd.id}
                                cmd={cmd}
                                isSelected={isSelected}
                                onClick={() => cmd.action()}
                                onHover={() => setSelectedIndex(globalIndex)}
                                dataIndex={globalIndex}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Navigation */}
                    {(!query || groupedCommands.navigation.length > 0) && (
                      <div>
                        <p className="text-[10px] text-tertiary uppercase tracking-wider font-semibold mb-2 px-1">
                          Navigation
                        </p>
                        <div className="space-y-0.5">
                          {(query ? groupedCommands.navigation : groupedCommands.navigation).map((cmd) => {
                            const Icon = cmd.icon;
                            const globalIndex = commands.indexOf(cmd);
                            const isSelected = globalIndex === selectedIndex;
                            
                            return (
                              <CommandRow
                                key={cmd.id}
                                cmd={cmd}
                                isSelected={isSelected}
                                onClick={() => cmd.action()}
                                onHover={() => setSelectedIndex(globalIndex)}
                                dataIndex={globalIndex}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {(!query || groupedCommands.action.length > 0) && (
                      <div>
                        <p className="text-[10px] text-tertiary uppercase tracking-wider font-semibold mb-2 px-1">
                          Actions
                        </p>
                        <div className="space-y-0.5">
                          {(query ? groupedCommands.action : groupedCommands.action).map((cmd) => {
                            const Icon = cmd.icon;
                            const globalIndex = commands.indexOf(cmd);
                            const isSelected = globalIndex === selectedIndex;
                            
                            return (
                              <CommandRow
                                key={cmd.id}
                                cmd={cmd}
                                isSelected={isSelected}
                                onClick={() => cmd.action()}
                                onHover={() => setSelectedIndex(globalIndex)}
                                dataIndex={globalIndex}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Recent Activity - Only when no search */}
                    {!query && (
                      <div className="pt-2 border-t border-[rgb(var(--border-subtle))]/40">
                        <p className="text-[10px] text-tertiary uppercase tracking-wider font-semibold mb-2 px-1">
                          Recent
                        </p>
                        <div className="space-y-0.5">
                          {recentItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[rgb(var(--bg-tertiary))]/60 cursor-pointer transition-all text-sm"
                            >
                              <span className="text-secondary truncate flex-1">
                                {item.title}
                              </span>
                              <div className="flex items-center gap-2 text-xs text-tertiary flex-shrink-0">
                                <span className="capitalize">{item.type}</span>
                                <span>·</span>
                                <span>{formatTimeAgo(item.timestamp)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-12 h-12 rounded-full bg-[rgb(var(--bg-tertiary))] flex items-center justify-center mb-4">
                      <Search className="w-6 h-6 text-tertiary" />
                    </div>
                    <p className="text-sm font-medium text-secondary mb-1">
                      No commands found
                    </p>
                    <p className="text-xs text-tertiary max-w-xs">
                      Try searching for a topic, strategy, memory, or action
                    </p>
                  </div>
                )}
              </div>

              {/* FIXED FOOTER */}
              <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-t border-[rgb(var(--border-subtle))]/40 bg-[rgb(var(--bg-tertiary))]/30">
                <div className="flex items-center gap-4 text-[11px] text-tertiary">
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-[rgb(var(--bg-elevated))]/80 border border-[rgb(var(--border-subtle))] rounded text-[10px] font-mono">↑↓</kbd>
                    <span>Navigate</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-[rgb(var(--bg-elevated))]/80 border border-[rgb(var(--border-subtle))] rounded text-[10px] font-mono">↵</kbd>
                    <span>Select</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-[rgb(var(--bg-elevated))]/80 border border-[rgb(var(--border-subtle))] rounded text-[10px] font-mono">Esc</kbd>
                    <span>Close</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-intelligence text-[11px]">
                  <Zap className="w-3 h-3" />
                  <span className="font-medium hidden md:inline">Power User Mode</span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Command Row Component
interface CommandRowProps {
  cmd: CommandItem;
  isSelected: boolean;
  onClick: () => void;
  onHover: () => void;
  dataIndex: number;
}

function CommandRow({ cmd, isSelected, onClick, onHover, dataIndex }: CommandRowProps) {
  const Icon = cmd.icon;
  
  return (
    <button
      data-index={dataIndex}
      onClick={onClick}
      onMouseEnter={onHover}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-left transition-all ${
        isSelected
          ? 'bg-[rgb(var(--bg-elevated))]/80 border border-intelligence/40'
          : 'hover:bg-[rgb(var(--bg-tertiary))]/60 border border-transparent'
      }`}
    >
      {/* Icon */}
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
        isSelected 
          ? 'bg-intelligence/15 border border-intelligence/30' 
          : 'bg-[rgb(var(--bg-tertiary))]/60'
      }`}>
        <Icon className={`w-4 h-4 ${isSelected ? 'text-intelligence' : 'text-dim'}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium mb-0.5 ${
          isSelected ? 'text-intelligence' : 'text-primary'
        }`}>
          {cmd.title}
        </p>
        <p className="text-xs text-tertiary truncate">
          {cmd.description}
        </p>
      </div>

      {/* Arrow or Label */}
      {isSelected && (
        <ArrowRight className="w-4 h-4 text-intelligence flex-shrink-0" />
      )}
    </button>
  );
}
