'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, TrendingUp, TrendingDown, Minus, Target, 
  Brain, Activity, Lightbulb, Loader2, ArrowRight, Send 
} from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import MemoryPulse from './ui/MemoryPulse';
import MemoryConstellation from './ui/MemoryConstellation';
import { parseApiResponse } from '@/lib/client-api';

interface Analytics {
  totalPosts: number;
  memoriesStored: number;
  topPerformingTopic: { name: string; avgEngagement: string };
  topFormat: { name: string; avgEngagement: string };
  contentGaps: Array<{ topic: string; count: number; percentage: number }>;
  recentLearning: Array<{ id: number; event: string; description: string; timestamp: string }>;
}

const examplePrompts = [
  "What should we post next week?",
  "Find our biggest content opportunity",
  "Why are tutorials performing better?",
  "What did our audience teach us?",
  "Build a cybersecurity campaign",
];

const contentSignals = [
  { label: 'Practical tutorials', direction: 'up', status: 'Strong positive signal', color: 'learning' },
  { label: 'Cloud content', direction: 'stable', status: 'Stable', color: 'ai' },
  { label: 'Generic awareness posts', direction: 'down', status: 'Weak signal', color: 'dim' },
];

export default function OverviewTab() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [askQuery, setAskQuery] = useState('');
  const [teachFeedback, setTeachFeedback] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      const data = await parseApiResponse(response);
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  const handleAsk = () => {
    if (askQuery.trim()) {
      // This would integrate with existing strategy generation
      console.log('Ask ContentMind:', askQuery);
      // TODO: Navigate to Strategy tab with pre-filled query
    }
  };

  const handleTeach = async () => {
    if (teachFeedback.trim()) {
      try {
        // Use existing feedback API
        await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ feedback: teachFeedback }),
        });
        setTeachFeedback('');
        // Refresh analytics to show new learning
        fetchAnalytics();
      } catch (error) {
        console.error('Error teaching AI:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-intelligence animate-spin mb-4" />
        <p className="text-secondary">Loading mission control...</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-20">
        <p className="text-tertiary">Failed to load analytics</p>
      </div>
    );
  }

  // Calculate active opportunities (gaps with <15% coverage)
  const activeOpportunities = analytics.contentGaps.filter(g => g.percentage < 15).length;

  return (
    <div className="space-y-8 pb-12">
      {/* ============================================ */}
      {/* HERO SECTION */}
      {/* ============================================ */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl surface-elevated p-12 text-center"
      >
        <MemoryPulse />
        
        <div className="relative z-10">
          <motion.h1 
            className="text-6xl md:text-7xl font-black tracking-tighter text-primary mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            CONTENTMIND
          </motion.h1>
          
          <motion.p 
            className="text-2xl md:text-3xl text-secondary mb-6 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Your content intelligence, <span className="text-intelligence">remembered</span>.
          </motion.p>

          <motion.div 
            className="inline-flex items-center gap-3 surface-primary px-6 py-3 rounded-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              className="w-2 h-2 bg-learning rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-learning font-semibold text-sm">MEMORY ONLINE</span>
            <span className="text-tertiary text-sm">•</span>
            <span className="text-secondary text-sm">{analytics.memoriesStored} memories</span>
            <span className="text-tertiary text-sm">•</span>
            <span className="text-tertiary text-sm">learning continuously</span>
          </motion.div>
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* PRIMARY ACTION - ASK CONTENTMIND */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card variant="elevated" className="p-8" glow="intelligence">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-7 h-7 text-intelligence" />
            <h2 className="text-2xl font-bold text-primary">Ask ContentMind</h2>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              value={askQuery}
              onChange={(e) => setAskQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              placeholder="What do you want to know about your content?"
              className="w-full px-6 py-5 bg-[rgb(var(--bg-tertiary))] border border-[rgb(var(--border-subtle))] rounded-xl text-primary placeholder-dim focus:outline-none focus:border-intelligence focus:ring-2 focus:ring-intelligence/30 transition-all text-lg"
            />
            <Button
              variant="intelligence"
              size="md"
              onClick={handleAsk}
              disabled={!askQuery.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2"
              icon={<Send className="w-4 h-4" />}
            >
              Ask
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((prompt, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                onClick={() => setAskQuery(prompt)}
                className="inline-flex items-center gap-2 px-4 py-2 surface-secondary rounded-lg text-secondary hover:text-intelligence hover:bg-[rgb(var(--bg-elevated))]/60 transition-all text-sm"
              >
                <ArrowRight className="w-3 h-3" />
                {prompt}
              </motion.button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* ============================================ */}
      {/* MEMORY CONSTELLATION */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-intelligence tracking-wider uppercase mb-1">
            ContentMind Memory Field
          </h2>
          <p className="text-tertiary text-sm">
            Interactive memory nodes showing what ContentMind knows
          </p>
        </div>
        <MemoryConstellation />
      </motion.div>

      {/* ============================================ */}
      {/* INTELLIGENCE SNAPSHOT */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card variant="secondary" className="text-center p-6">
          <div className="text-5xl font-black text-ai mb-2">{analytics.totalPosts}</div>
          <div className="text-xs text-secondary uppercase tracking-wide">Content Pieces Analyzed</div>
        </Card>

        <Card variant="secondary" className="text-center p-6">
          <div className="text-5xl font-black text-intelligence mb-2">{analytics.memoriesStored}</div>
          <div className="text-xs text-secondary uppercase tracking-wide">Memories Retained</div>
        </Card>

        <Card variant="secondary" className="text-center p-6">
          <div className="text-5xl font-black text-learning mb-2">{analytics.topPerformingTopic.avgEngagement}%</div>
          <div className="text-xs text-secondary uppercase tracking-wide">Best Engagement</div>
        </Card>

        <Card variant="secondary" className="text-center p-6">
          <div className="text-5xl font-black text-opportunity mb-2">{activeOpportunities}</div>
          <div className="text-xs text-secondary uppercase tracking-wide">Active Content Opportunities</div>
        </Card>
      </motion.div>

      {/* ============================================ */}
      {/* CONTENT SIGNAL */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold text-primary mb-1">What's changing?</h2>
          <p className="text-tertiary text-sm">Real-time content performance signals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contentSignals.map((signal, i) => {
            const Icon = signal.direction === 'up' ? TrendingUp : signal.direction === 'down' ? TrendingDown : Minus;
            const colorClass = signal.direction === 'up' ? 'text-learning' : signal.direction === 'down' ? 'text-opportunity' : 'text-ai';
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <Card variant="secondary" hover className="p-5">
                  <div className="flex items-start gap-3">
                    <Icon className={`w-6 h-6 ${colorClass} flex-shrink-0 mt-1`} />
                    <div className="flex-1">
                      <h3 className="text-primary font-semibold mb-1">{signal.label}</h3>
                      <p className={`text-sm ${colorClass.replace('text-', 'text-')}`}>{signal.status}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* OPPORTUNITY RADAR */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold text-primary mb-1">Opportunity Radar</h2>
          <p className="text-tertiary text-sm">Content gaps detected by ContentMind</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analytics.contentGaps.slice(0, 3).map((gap, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.1 }}
            >
              <Card variant="elevated" className="p-6" glow={gap.percentage < 10 ? 'opportunity' : 'none'}>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-bold text-primary uppercase tracking-tight">{gap.topic}</h3>
                  <Target className="w-6 h-6 text-opportunity" />
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-secondary uppercase tracking-wide">Coverage</span>
                      <span className="text-opportunity font-semibold">{gap.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[rgb(var(--bg-tertiary))] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[rgb(var(--accent-opportunity-dim))] to-[rgb(var(--accent-opportunity))]"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(gap.percentage, 3)}%` }}
                        transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <Lightbulb className="w-4 h-4 text-opportunity" />
                    <span className="text-opportunity font-medium">
                      {gap.percentage < 10 ? 'High potential' : gap.percentage < 15 ? 'Opportunity detected' : 'Monitor'}
                    </span>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full"
                  icon={<Sparkles className="w-4 h-4" />}
                >
                  Generate 5 ideas
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* RECENT LEARNING STREAM */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card variant="secondary" className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-intelligence" />
            <h2 className="text-xl font-bold text-primary">Recent Learning</h2>
          </div>

          <div className="space-y-4">
            {analytics.recentLearning.slice(0, 3).map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="flex items-start gap-4 p-4 surface-primary rounded-lg hover:bg-[rgb(var(--bg-elevated))]/50 transition-colors cursor-pointer"
              >
                <Brain className="w-5 h-5 text-intelligence flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-primary font-medium mb-1">{item.event}</p>
                  <p className="text-secondary text-sm">{item.description}</p>
                </div>
                <span className="text-tertiary text-xs whitespace-nowrap">{formatTimeAgo(item.timestamp)}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* ============================================ */}
      {/* DAILY AI BRIEF */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card variant="elevated" className="p-8" glow="intelligence">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-7 h-7 text-intelligence" />
            <h2 className="text-2xl font-bold text-primary">Your Content Brief</h2>
          </div>

          <div className="space-y-4 mb-6">
            <p className="text-secondary text-lg">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}.</p>
            <p className="text-secondary">ContentMind noticed <span className="text-intelligence font-semibold">3 things</span>:</p>

            <div className="space-y-4 pl-4">
              <div className="flex gap-3">
                <span className="text-intelligence font-bold text-xl">01</span>
                <p className="text-primary flex-1 pt-1">
                  <span className="font-semibold">{analytics.topFormat.name}</span> content continues to outperform other formats.
                </p>
              </div>

              <div className="flex gap-3">
                <span className="text-intelligence font-bold text-xl">02</span>
                <p className="text-primary flex-1 pt-1">
                  <span className="font-semibold">{analytics.contentGaps[0]?.topic || 'DevOps'}</span> is underrepresented in your content library.
                </p>
              </div>

              <div className="flex gap-3">
                <span className="text-intelligence font-bold text-xl">03</span>
                <p className="text-primary flex-1 pt-1">
                  Your audience prefers <span className="font-semibold">practical demonstrations</span> over theoretical content.
                </p>
              </div>
            </div>

            <div className="border-l-2 border-intelligence pl-4 py-2 mt-6">
              <p className="text-secondary text-sm mb-2">Recommended next action:</p>
              <p className="text-primary font-semibold text-lg">
                Create a {analytics.contentGaps[0]?.topic || 'DevOps'} {analytics.topFormat.name.toLowerCase()}.
              </p>
            </div>
          </div>

          <Button 
            variant="intelligence" 
            size="lg"
            icon={<Sparkles className="w-5 h-5" />}
            className="w-full"
          >
            Generate Strategy
          </Button>
        </Card>
      </motion.div>

      {/* ============================================ */}
      {/* ENDING CTA - TEACH CONTENTMIND */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card variant="secondary" className="p-8 text-center">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Teach ContentMind something new.
          </h2>

          <div className="max-w-2xl mx-auto">
            <div className="relative mb-4">
              <textarea
                value={teachFeedback}
                onChange={(e) => setTeachFeedback(e.target.value)}
                placeholder="Our audience prefers..."
                rows={3}
                className="w-full px-6 py-4 bg-[rgb(var(--bg-tertiary))] border border-[rgb(var(--border-subtle))] rounded-xl text-primary placeholder-dim focus:outline-none focus:border-learning focus:ring-2 focus:ring-learning/30 transition-all resize-none"
              />
            </div>

            <Button
              variant="learning"
              size="lg"
              onClick={handleTeach}
              disabled={!teachFeedback.trim()}
              icon={<Brain className="w-5 h-5" />}
              className="w-full md:w-auto"
            >
              Teach the AI
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
