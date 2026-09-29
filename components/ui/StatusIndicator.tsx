'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Activity, Clock } from 'lucide-react';

interface StatusIndicatorProps {
  memoriesCount: number;
  lastLearning?: string;
}

export default function StatusIndicator({ memoriesCount, lastLearning }: StatusIndicatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 surface-secondary rounded-lg text-sm transition-all hover:surface-elevated group"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-[rgb(var(--accent-learning))] shadow-[0_0_8px_rgba(34,197,94,0.6)]"
        />
        <span className="text-secondary group-hover:text-primary transition-colors">
          MEMORY ONLINE
        </span>
        <span className="text-dim">
          {memoriesCount}
        </span>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-64 surface-elevated rounded-xl p-4 shadow-xl z-50"
          >
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-intelligence" />
              <span className="font-semibold text-primary text-sm">Hindsight Cloud</span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-secondary">Total Memories</span>
                <span className="font-mono text-primary font-semibold">{memoriesCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-secondary">Strategic Memories</span>
                <span className="font-mono text-intelligence font-semibold">
                  {Math.floor(memoriesCount * 0.15)}
                </span>
              </div>
              
              {lastLearning && (
                <div className="flex items-start gap-2 pt-2 border-t border-[rgb(var(--border-subtle))]">
                  <Clock className="w-3 h-3 text-learning mt-0.5" />
                  <div className="flex-1">
                    <div className="text-dim text-xs">Last learning event</div>
                    <div className="text-secondary">{lastLearning}</div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-1.5 pt-2 border-t border-[rgb(var(--border-subtle))]">
                <Activity className="w-3 h-3 text-learning" />
                <span className="text-learning text-xs font-medium">Active & Learning</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
