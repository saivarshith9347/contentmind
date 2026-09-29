'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Clock, Search, Command, Zap, Star, 
  Activity, Filter, X
} from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import MemoryUniverse from './ui/MemoryUniverse';
import MemoryDetailPanel from './ui/MemoryDetailPanel';
import MemoryPulseIndicator from './ui/MemoryPulseIndicator';
import { parseApiResponse } from '@/lib/client-api';

interface Memory {
  id: string;
  text: string;
  type: string;
  timestamp: string;
  context: string;
}

type MemoryFilter = 'all' | 'audience' | 'performance' | 'content' | 'feedback' | 'brand' | 'strategy' | 'topics';

interface MemoryStats {
  total: number;
  strategic: number;
  recentlyRecalled: number;
  fromFeedback: number;
}

export default function MemoryExplorerTab() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRecalling, setIsRecalling] = useState(false);
  const [stats, setStats] = useState<MemoryStats>({
    total: 335,
    strategic: 51,
    recentlyRecalled: 120,
    fromFeedback: 12,
  });
  
  const [activeFilter, setActiveFilter] = useState<MemoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const response = await fetch('/api/memories?limit=50');
      const data = await parseApiResponse(response);

      if (data.success) {
        setMemories(data.memories);
        setStats(prev => ({ ...prev, total: data.total || prev.total }));
      }
    } catch (error) {
      console.error('Error fetching memories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filters: { id: MemoryFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'audience', label: 'Audience' },
    { id: 'performance', label: 'Performance' },
    { id: 'content', label: 'Content' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'brand', label: 'Brand' },
    { id: 'strategy', label: 'Strategy' },
    { id: 'topics', label: 'Topics' },
  ];

  const filteredMemories = useMemo(() => {
    let result = memories;

    // Apply type filter
    if (activeFilter !== 'all') {
      result = result.filter(m => 
        m.type.toLowerCase() === activeFilter || 
        m.context.toLowerCase().includes(activeFilter)
      );
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(m =>
        m.text.toLowerCase().includes(query) ||
        m.type.toLowerCase().includes(query) ||
        m.context.toLowerCase().includes(query)
      );
    }

    return result;
  }, [memories, activeFilter, searchQuery]);

  const handleClusterClick = (clusterId: string) => {
    setActiveFilter(clusterId as MemoryFilter);
  };

  const handleMemoryClick = (memory: Memory) => {
    setSelectedMemory(memory);
    setIsPanelOpen(true);
  };

  const getMemoryImportance = (memory: Memory): { label: string; color: string } | null => {
    const daysSinceCreation = (Date.now() - new Date(memory.timestamp).getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceCreation < 3) {
      return { label: 'Fresh', color: 'rgb(34, 197, 94)' };
    }
    
    if (memory.type.toLowerCase() === 'feedback' || memory.context.toLowerCase().includes('feedback')) {
      return { label: 'High impact', color: 'rgb(168, 85, 247)' };
    }
    
    if (memory.type.toLowerCase() === 'performance') {
      return { label: 'Relevant', color: 'rgb(59, 130, 246)' };
    }
    
    // Randomly mark some as "Frequently used" for demo
    if (parseInt(memory.id.slice(0, 2), 16) % 5 === 0) {
      return { label: 'Frequently used', color: 'rgb(251, 146, 60)' };
    }
    
    return null;
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
      case 'world':
      case 'observation':
      case 'opinion':
      default:
        return { bg: 'rgba(148, 163, 184, 0.1)', border: 'rgb(148, 163, 184)', text: 'rgb(148, 163, 184)' };
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <MemoryPulseIndicator 
          state="recalling" 
          size="lg"
          showLabel={true}
        />
        <p className="text-secondary mt-8">Accessing ContentMind's memory archive...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Memory Detail Panel */}
      <MemoryDetailPanel
        memory={selectedMemory}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />

      {/* ============================================ */}
      {/* HERO */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-black text-primary mb-3">
          Inside ContentMind's Memory
        </h1>
        <p className="text-xl text-secondary mb-6">
          Everything the agent remembers about your content.
        </p>

        {/* Stats */}
        <div className="inline-flex flex-wrap items-center justify-center gap-6 surface-primary px-8 py-4 rounded-full">
          <div className="text-center">
            <p className="text-3xl font-black text-intelligence">{stats.total}</p>
            <p className="text-xs text-secondary uppercase tracking-wide">memories</p>
          </div>
          <span className="text-tertiary">•</span>
          <div className="text-center">
            <p className="text-2xl font-bold text-ai">{stats.strategic}</p>
            <p className="text-xs text-secondary">strategic</p>
          </div>
          <span className="text-tertiary">•</span>
          <div className="text-center">
            <p className="text-2xl font-bold text-learning">{stats.recentlyRecalled}</p>
            <p className="text-xs text-secondary">recently recalled</p>
          </div>
          <span className="text-tertiary">•</span>
          <div className="text-center">
            <p className="text-2xl font-bold text-opportunity">{stats.fromFeedback}</p>
            <p className="text-xs text-secondary">from feedback</p>
          </div>
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* MEMORY UNIVERSE */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-intelligence tracking-wider uppercase mb-1">
            Memory Universe
          </h2>
          <p className="text-tertiary text-sm">
            Interactive visualization of ContentMind's knowledge clusters
          </p>
        </div>
        <MemoryUniverse
          totalMemories={stats.total}
          onClusterClick={handleClusterClick}
          activeCluster={activeFilter !== 'all' ? activeFilter : null}
        />
      </motion.div>

      {/* ============================================ */}
      {/* SEARCH & FILTERS */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {/* Search Bar */}
        <Card variant="secondary" className="p-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
              <Search className="w-5 h-5 text-tertiary" />
              {!searchFocused && !searchQuery && (
                <div className="flex items-center gap-1 text-tertiary text-sm">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </div>
              )}
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search memory... (e.g., 'show me everything about cybersecurity')"
              className="w-full pl-12 pr-12 py-4 bg-[rgb(var(--bg-tertiary))] border border-[rgb(var(--border-subtle))] rounded-xl text-primary placeholder-dim focus:outline-none focus:border-intelligence focus:ring-2 focus:ring-intelligence/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-[rgb(var(--bg-elevated))] rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-secondary" />
              </button>
            )}
          </div>
        </Card>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-secondary">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          {filters.map((filter) => (
            <motion.button
              key={filter.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-[rgb(var(--accent-intelligence-dim))] to-[rgb(var(--accent-intelligence))] text-white'
                  : 'surface-secondary text-secondary hover:bg-[rgb(var(--bg-elevated))]/60 hover:text-intelligence'
              }`}
            >
              {filter.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* MEMORY CARDS */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        {activeFilter !== 'all' && (
          <div className="flex items-center justify-between mb-2">
            <p className="text-secondary text-sm">
              Showing <span className="text-intelligence font-semibold">{filteredMemories.length}</span>{' '}
              {activeFilter} {filteredMemories.length === 1 ? 'memory' : 'memories'}
            </p>
            <button
              onClick={() => setActiveFilter('all')}
              className="text-tertiary hover:text-intelligence text-sm transition-colors"
            >
              Clear filter
            </button>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {filteredMemories.map((memory, index) => {
            const colors = getTypeColor(memory.type);
            const importance = getMemoryImportance(memory);
            
            return (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <Card
                  variant="secondary"
                  hover
                  className="p-5 cursor-pointer"
                  onClick={() => handleMemoryClick(memory)}
                >
                  <div className="flex items-start gap-4">
                    {/* Type Indicator */}
                    <div 
                      className="w-1 h-full rounded-full flex-shrink-0"
                      style={{ background: colors.border }}
                    />

                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                            style={{
                              background: colors.bg,
                              border: `1px solid ${colors.border}`,
                              color: colors.text,
                            }}
                          >
                            {memory.type}
                          </span>
                          
                          {importance && (
                            <span
                              className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                              style={{
                                background: `${importance.color}20`,
                                color: importance.color,
                              }}
                            >
                              {importance.label === 'Fresh' && <Zap className="w-3 h-3" />}
                              {importance.label === 'High impact' && <Star className="w-3 h-3" />}
                              {importance.label === 'Frequently used' && <Activity className="w-3 h-3" />}
                              {importance.label === 'Relevant' && <Activity className="w-3 h-3" />}
                              {importance.label}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-tertiary text-xs">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(memory.timestamp)}
                        </div>
                      </div>

                      {/* Memory Text */}
                      <p className="text-primary leading-relaxed mb-3">
                        {memory.text}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center gap-3 text-tertiary text-xs">
                        <span>Influenced 4 strategies</span>
                        <span>•</span>
                        <span>{memory.context}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredMemories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-[rgb(var(--bg-tertiary))] flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-tertiary" />
            </div>
            <p className="text-secondary text-lg mb-2">No memories found</p>
            <p className="text-tertiary text-sm">
              {searchQuery ? 'Try a different search query' : 'Try selecting a different filter'}
            </p>
            {(searchQuery || activeFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="mt-4"
              >
                Clear all filters
              </Button>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
