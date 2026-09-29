'use client';

import { Brain, TrendingUp, Target, Database, Clock, Command, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

type Tab = 'overview' | 'strategy' | 'memories' | 'gaps' | 'timeline';

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  memoriesCount: number;
  onOpenCommand: () => void;
  onStartDemo?: () => void;
}

const navItems = [
  { id: 'overview' as Tab, label: 'Overview', icon: TrendingUp },
  { id: 'strategy' as Tab, label: 'Strategy', icon: Brain },
  { id: 'memories' as Tab, label: 'Memory', icon: Database },
  { id: 'gaps' as Tab, label: 'Gaps', icon: Target },
  { id: 'timeline' as Tab, label: 'Learning', icon: Clock },
];

export default function Navigation({ activeTab, onTabChange, memoriesCount, onOpenCommand, onStartDemo }: NavigationProps) {
  return (
    <motion.nav
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 bg-[rgb(var(--bg-secondary))]/80 backdrop-blur-xl border-b border-[rgb(var(--border-subtle))]/50"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-[rgb(var(--accent-intelligence))] to-[rgb(var(--accent-ai))] flex items-center justify-center glow-intelligence"
            >
              <Brain className="w-4 h-4 text-white" />
            </motion.div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-primary group-hover:text-intelligence transition-colors">
                ContentMind
              </span>
              {memoriesCount > 0 && (
                <span className="text-[10px] text-dim font-medium">
                  {memoriesCount} memories
                </span>
              )}
            </div>
          </Link>
          
          {/* Center: Navigation */}
          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onTabChange(item.id)}
                  className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-primary'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-intelligence' : ''}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[rgb(var(--accent-intelligence))]/10 rounded-lg border border-[rgb(var(--accent-intelligence))]/30"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
          
          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {onStartDemo && memoriesCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStartDemo}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[rgb(var(--accent-intelligence))] to-[rgb(var(--accent-ai))] rounded-lg text-xs font-semibold text-white glow-intelligence"
                title="Start 60-90s Demo"
              >
                <Play className="w-3 h-3" />
                <span className="hidden lg:inline">Demo</span>
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenCommand}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[rgb(var(--bg-tertiary))]/50 rounded-lg text-xs transition-all hover:bg-[rgb(var(--bg-elevated))]/60 group border border-[rgb(var(--border-subtle))]/30"
              title="Open Command Palette (⌘K)"
            >
              <Command className="w-3.5 h-3.5 text-dim group-hover:text-intelligence transition-colors" />
              <span className="hidden lg:inline text-dim group-hover:text-secondary transition-colors">
                ⌘K
              </span>
            </motion.button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'text-primary bg-[rgb(var(--accent-intelligence))]/10 border border-[rgb(var(--accent-intelligence))]/30'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-intelligence' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
