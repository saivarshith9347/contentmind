'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Link2, Sparkles, TrendingUp } from 'lucide-react';
import Button from './Button';

interface Memory {
  id: string;
  text: string;
  type: string;
  timestamp: string;
  context: string;
}

interface MemoryDetailPanelProps {
  memory: Memory | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MemoryDetailPanel({ memory, isOpen, onClose }: MemoryDetailPanelProps) {
  if (!memory) return null;

  // Mock data for demo - in real app, would fetch from API
  const memoryDetails = {
    source: 'User feedback',
    strategiesInfluenced: 4,
    connectedMemories: [
      'Developers prefer practical examples',
      'Tutorial format has 10.7% engagement',
      'DevOps content gap detected',
    ],
    firstUsed: '2 days ago',
    lastUsed: '12 minutes ago',
    usageCount: 8,
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'audience':
        return { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgb(59, 130, 246)', text: 'rgb(59, 130, 246)' };
      case 'performance':
        return { bg: 'rgba(251, 146, 60, 0.1)', border: 'rgb(251, 146, 60)', text: 'rgb(251, 146, 60)' };
      case 'content':
        return { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgb(34, 197, 94)', text: 'rgb(34, 197, 94)' };
      case 'feedback':
        return { bg: 'rgba(168, 85, 247, 0.1)', border: 'rgb(168, 85, 247)', text: 'rgb(168, 85, 247)' };
      case 'brand':
        return { bg: 'rgba(236, 72, 153, 0.1)', border: 'rgb(236, 72, 153)', text: 'rgb(236, 72, 153)' };
      case 'strategy':
        return { bg: 'rgba(139, 92, 246, 0.1)', border: 'rgb(139, 92, 246)', text: 'rgb(139, 92, 246)' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.1)', border: 'rgb(148, 163, 184)', text: 'rgb(148, 163, 184)' };
    }
  };

  const colors = getTypeColor(memory.type);
  const formattedDate = new Date(memory.timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[500px] surface-elevated border-l border-[rgb(var(--border-medium))] z-50 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
                      style={{
                        background: colors.bg,
                        border: `1px solid ${colors.border}`,
                        color: colors.text,
                      }}
                    >
                      {memory.type}
                    </span>
                    <span className="text-tertiary text-xs">#{memory.id.slice(0, 8)}</span>
                  </div>
                  <h2 className="text-xl font-bold text-primary">Memory Details</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[rgb(var(--bg-tertiary))] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-secondary" />
                </button>
              </div>

              {/* Memory Content */}
              <div className="p-5 surface-secondary rounded-xl">
                <p className="text-primary text-lg leading-relaxed">
                  "{memory.text}"
                </p>
              </div>

              {/* Origin */}
              <div>
                <h3 className="text-sm font-semibold text-secondary uppercase tracking-wide mb-3">
                  Where it came from
                </h3>
                <div className="flex items-center gap-3 p-4 surface-secondary rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-intelligence/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-intelligence" />
                  </div>
                  <div>
                    <p className="text-primary font-medium">{memoryDetails.source}</p>
                    <p className="text-tertiary text-xs">{memory.context}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-secondary uppercase tracking-wide mb-3">
                  When it was learned
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-secondary mt-0.5" />
                    <div>
                      <p className="text-primary text-sm">Learned</p>
                      <p className="text-tertiary text-xs">{formattedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-secondary mt-0.5" />
                    <div>
                      <p className="text-primary text-sm">First used</p>
                      <p className="text-tertiary text-xs">{memoryDetails.firstUsed}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-secondary mt-0.5" />
                    <div>
                      <p className="text-primary text-sm">Last used</p>
                      <p className="text-tertiary text-xs">{memoryDetails.lastUsed}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Impact */}
              <div>
                <h3 className="text-sm font-semibold text-secondary uppercase tracking-wide mb-3">
                  What strategies it influenced
                </h3>
                <div className="p-4 surface-secondary rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-intelligence" />
                    <div>
                      <p className="text-2xl font-bold text-intelligence">
                        {memoryDetails.strategiesInfluenced}
                      </p>
                      <p className="text-secondary text-sm">strategies influenced</p>
                    </div>
                  </div>
                  <div className="text-xs text-tertiary">
                    Used {memoryDetails.usageCount} times in total
                  </div>
                </div>
              </div>

              {/* Connected Memories */}
              <div>
                <h3 className="text-sm font-semibold text-secondary uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  Connected memories
                </h3>
                <div className="space-y-2">
                  {memoryDetails.connectedMemories.map((connectedMemory, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="w-full text-left p-3 surface-secondary rounded-lg hover:bg-[rgb(var(--bg-elevated))]/60 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-intelligence" />
                        <p className="text-secondary text-sm group-hover:text-intelligence transition-colors">
                          {connectedMemory}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[rgb(var(--border-subtle))] space-y-3">
                <Button
                  variant="intelligence"
                  size="lg"
                  className="w-full"
                  icon={<Sparkles className="w-5 h-5" />}
                >
                  Use this memory
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                  >
                    View strategies
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                  >
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
