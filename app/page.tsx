'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Loader2, Sparkles, Play } from 'lucide-react';
import Navigation from '@/components/Navigation';
import CommandCenter from '@/components/CommandCenter';
import DemoMode from '@/components/DemoMode';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import OverviewTab from '@/components/OverviewTab';
import StrategyAgentTab from '@/components/StrategyAgentTab';
import MemoryExplorerTab from '@/components/MemoryExplorerTab';
import ContentGapsTab from '@/components/ContentGapsTab';
import LearningTimelineTab from '@/components/LearningTimelineTab';
import { parseApiResponse } from '@/lib/client-api';

type Tab = 'overview' | 'strategy' | 'memories' | 'gaps' | 'timeline';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isSeeded, setIsSeeded] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [memoriesCount, setMemoriesCount] = useState(0);
  const [demoMode, setDemoMode] = useState(false);

  // Check if already seeded on mount
  useEffect(() => {
    checkIfSeeded();
  }, []);

  // Command palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const checkIfSeeded = async () => {
    try {
      const response = await fetch('/api/memories?limit=1');
      const data = await parseApiResponse(response);
      if (data.success && data.memories && data.memories.length > 0) {
        setIsSeeded(true);
        setMemoriesCount(data.total || 0);
      }
    } catch (error) {
      console.error('Error checking seed status:', error);
      // Silently fail - user can still load demo memory
    }
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedError(null);

    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
      });

      const data = await parseApiResponse(response);

      if (data.success) {
        setIsSeeded(true);
        // Refresh memories count
        await checkIfSeeded();
      } else {
        setSeedError(data.error || 'Failed to seed data');
      }
    } catch (error: any) {
      setSeedError(error.message || 'Failed to seed data');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleCommandNavigate = (section: string) => {
    setActiveTab(section as Tab);
  };

  return (
    <div className="min-h-screen">
      {/* Demo Mode */}
      <AnimatePresence>
        {demoMode && (
          <DemoMode onExit={() => setDemoMode(false)} />
        )}
      </AnimatePresence>

      {!demoMode && (
        <>
          {/* Command Center */}
          <CommandCenter
            isOpen={commandOpen}
            onClose={() => setCommandOpen(false)}
            onNavigate={handleCommandNavigate}
          />

          {/* Navigation */}
          <Navigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            memoriesCount={memoriesCount}
            onOpenCommand={() => setCommandOpen(true)}
            onStartDemo={() => setDemoMode(true)}
          />

          {/* Main Content */}
          <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-8">
        {!isSeeded ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center min-h-[calc(100vh-12rem)]"
          >
            <Card variant="elevated" className="max-w-xl w-full text-center p-8 md:p-10">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[rgb(var(--accent-intelligence))] to-[rgb(var(--accent-ai))] flex items-center justify-center glow-intelligence"
              >
                <Database className="w-8 h-8 text-white" />
              </motion.div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
                Welcome to ContentMind
              </h2>
              
              <p className="text-sm md:text-base text-secondary mb-8 max-w-md mx-auto leading-relaxed">
                AI content strategy powered by persistent memory. Load the demo dataset to explore
                how ContentMind learns from feedback.
              </p>
              
              {seedError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-left"
                >
                  <p className="text-red-400 text-sm font-medium mb-1">{seedError}</p>
                  <p className="text-red-300/70 text-xs">
                    Verify API keys in .env.local file
                  </p>
                </motion.div>
              )}
              
              <div className="space-y-3">
                <Button
                  variant="intelligence"
                  size="lg"
                  onClick={handleSeed}
                  loading={isSeeding}
                  icon={!isSeeding && <Sparkles className="w-5 h-5" />}
                  className="w-full"
                >
                  {isSeeding ? 'Loading Demo Memory...' : 'Load Demo Memory'}
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setDemoMode(true)}
                  icon={<Play className="w-5 h-5" />}
                  className="w-full"
                >
                  Start Demo Mode
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'strategy' && <StrategyAgentTab />}
            {activeTab === 'memories' && <MemoryExplorerTab />}
            {activeTab === 'gaps' && <ContentGapsTab />}
            {activeTab === 'timeline' && <LearningTimelineTab />}
          </motion.div>
        )}
          </main>
        </>
      )}
    </div>
  );
}
