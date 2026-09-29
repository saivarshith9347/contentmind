'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Brain, Database, TrendingUp, MessageSquare, 
  Target, Sparkles, CheckCircle, Clock, Zap
} from 'lucide-react';
import Card from './ui/Card';
import LearningLoop from './ui/LearningLoop';
import LearningEventParticle from './ui/LearningEventParticle';
import MemoryPulseIndicator from './ui/MemoryPulseIndicator';
import { parseApiResponse } from '@/lib/client-api';

interface LearningEvent {
  id: number;
  event: string;
  description: string;
  timestamp: string;
}

interface LearningDelta {
  before: string;
  after: string;
  trigger: string;
}

export default function LearningTimelineTab() {
  const [events, setEvents] = useState<LearningEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showParticle, setShowParticle] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  
  // Learning velocity metrics
  const [velocity] = useState({
    memoriesThisWeek: 12,
    feedbackReceived: 8,
    strategiesInfluenced: 15,
    patternsDetected: 4,
  });

  // Example learning delta
  const [learningDelta] = useState<LearningDelta>({
    before: 'Generic cybersecurity recommendations',
    after: 'Practical attack/defense demonstrations',
    trigger: 'User feedback: "Audience prefers hands-on examples"',
  });

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      const response = await fetch('/api/analytics');
      const data = await parseApiResponse(response);

      if (data.success) {
        setEvents(data.analytics.recentLearning);
      }
    } catch (error) {
      console.error('Error fetching timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (event: string) => {
    if (event.toLowerCase().includes('brand')) return Brain;
    if (event.toLowerCase().includes('historical') || event.toLowerCase().includes('analyzed')) return Database;
    if (event.toLowerCase().includes('performance') || event.toLowerCase().includes('pattern')) return TrendingUp;
    if (event.toLowerCase().includes('gap')) return Target;
    if (event.toLowerCase().includes('strategy') || event.toLowerCase().includes('generated')) return Sparkles;
    if (event.toLowerCase().includes('feedback') || event.toLowerCase().includes('learned')) return MessageSquare;
    return CheckCircle;
  };

  const getEventColor = (event: string) => {
    if (event.toLowerCase().includes('brand')) return 'rgb(168, 85, 247)';
    if (event.toLowerCase().includes('historical') || event.toLowerCase().includes('analyzed')) return 'rgb(59, 130, 246)';
    if (event.toLowerCase().includes('performance') || event.toLowerCase().includes('pattern')) return 'rgb(34, 197, 94)';
    if (event.toLowerCase().includes('gap')) return 'rgb(251, 146, 60)';
    if (event.toLowerCase().includes('strategy')) return 'rgb(139, 92, 246)';
    if (event.toLowerCase().includes('feedback') || event.toLowerCase().includes('learned')) return 'rgb(236, 72, 153)';
    return 'rgb(148, 163, 184)';
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getImpactText = (index: number) => {
    // Mock impact data - in real app would come from API
    const impacts = [
      'Influenced 3 future strategies',
      'Updated content recommendations',
      'Improved gap detection',
      'Enhanced audience targeting',
      'Refined format suggestions',
    ];
    return impacts[index % impacts.length];
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <MemoryPulseIndicator 
          state="analyzing" 
          size="lg"
          showLabel={true}
        />
        <p className="text-secondary mt-8">Analyzing ContentMind's learning patterns...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Learning Event Particle */}
      {showParticle && (
        <LearningEventParticle onComplete={() => setShowParticle(false)} />
      )}

      {/* ============================================ */}
      {/* HERO */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-black text-primary mb-3">
          ContentMind's Learning Journey
        </h1>
        <p className="text-xl text-secondary">
          See how every interaction changes what the agent knows.
        </p>
      </motion.div>

      {/* ============================================ */}
      {/* LEARNING LOOP */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-intelligence tracking-wider uppercase mb-1">
            The Learning Loop
          </h2>
          <p className="text-tertiary text-sm">
            Click any stage to see how ContentMind processes information
          </p>
        </div>
        <LearningLoop onStageClick={setSelectedStage} />
      </motion.div>

      {/* ============================================ */}
      {/* LEARNING VELOCITY */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold text-primary mb-1">
            Learning Velocity
          </h2>
          <p className="text-secondary text-sm">
            ContentMind's learning activity over the past week
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card variant="secondary" className="p-5 text-center">
            <div className="text-4xl font-black text-intelligence mb-2">
              {velocity.memoriesThisWeek}
            </div>
            <div className="text-xs text-secondary uppercase tracking-wide">
              Memories learned this week
            </div>
          </Card>

          <Card variant="secondary" className="p-5 text-center">
            <div className="text-4xl font-black text-learning mb-2">
              {velocity.feedbackReceived}
            </div>
            <div className="text-xs text-secondary uppercase tracking-wide">
              Feedback received
            </div>
          </Card>

          <Card variant="secondary" className="p-5 text-center">
            <div className="text-4xl font-black text-ai mb-2">
              {velocity.strategiesInfluenced}
            </div>
            <div className="text-xs text-secondary uppercase tracking-wide">
              Strategies influenced
            </div>
          </Card>

          <Card variant="secondary" className="p-5 text-center">
            <div className="text-4xl font-black text-opportunity mb-2">
              {velocity.patternsDetected}
            </div>
            <div className="text-xs text-secondary uppercase tracking-wide">
              New patterns detected
            </div>
          </Card>
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* LEARNING DELTA */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold text-primary mb-1">
            Learning Transformation
          </h2>
          <p className="text-secondary text-sm">
            See how feedback changes ContentMind's recommendations
          </p>
        </div>

        <Card variant="elevated" className="p-8" glow="intelligence">
          <div className="space-y-6">
            {/* Before */}
            <div className="surface-secondary rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-tertiary/30 flex items-center justify-center">
                  <span className="text-tertiary font-bold text-sm">BEFORE</span>
                </div>
              </div>
              <p className="text-tertiary text-lg line-through">
                {learningDelta.before}
              </p>
            </div>

            {/* Trigger */}
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-learning to-intelligence flex items-center justify-center mb-2">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <p className="text-learning font-semibold text-sm mb-1">LEARNING TRIGGER</p>
                <p className="text-secondary text-sm text-center max-w-md">
                  {learningDelta.trigger}
                </p>
                <motion.div
                  className="w-px h-12 bg-gradient-to-b from-learning to-intelligence mt-4"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.5 }}
                />
              </motion.div>
            </div>

            {/* After */}
            <div className="surface-elevated rounded-xl p-6 glow-intelligence">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-intelligence/30 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-intelligence" />
                </div>
                <span className="text-intelligence font-bold text-sm uppercase">AFTER</span>
              </div>
              <p className="text-primary text-lg font-medium">
                {learningDelta.after}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ============================================ */}
      {/* TIMELINE */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold text-primary mb-1">
            Learning Timeline
          </h2>
          <p className="text-secondary text-sm">
            Chronological record of ContentMind's knowledge evolution
          </p>
        </div>

        <Card variant="secondary" className="p-8">
          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-intelligence via-ai to-learning" />

            {/* Events */}
            <div className="space-y-8">
              <AnimatePresence>
                {events.map((event, index) => {
                  const Icon = getEventIcon(event.event);
                  const color = getEventColor(event.event);
                  
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="relative flex gap-6 items-start"
                    >
                      {/* Icon */}
                      <div 
                        className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: `radial-gradient(circle, ${color}40 0%, ${color}20 100%)`,
                          border: `2px solid ${color}`,
                          boxShadow: `0 0 15px ${color}40`,
                        }}
                      >
                        <Icon className="w-6 h-6" style={{ color }} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-primary font-bold text-lg mb-1">
                              {event.event}
                            </p>
                            <div className="flex items-center gap-2 text-tertiary text-xs">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimeAgo(event.timestamp)}</span>
                            </div>
                          </div>
                          <div 
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              background: `${color}20`,
                              color,
                            }}
                          >
                            Event #{index + 1}
                          </div>
                        </div>

                        <p className="text-secondary leading-relaxed mb-3">
                          {event.description}
                        </p>

                        <div className="flex items-center gap-2 p-3 surface-primary rounded-lg">
                          <TrendingUp className="w-4 h-4 text-intelligence" />
                          <span className="text-sm text-secondary">
                            <span className="text-intelligence font-semibold">Impact:</span>{' '}
                            {getImpactText(index)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ============================================ */}
      {/* DEMO TRIGGER */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card variant="elevated" className="p-6" glow="learning">
          <div className="text-center">
            <Brain className="w-16 h-16 text-intelligence mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-primary mb-3">
              See Learning in Real-Time
            </h3>
            <p className="text-secondary mb-6 max-w-2xl mx-auto">
              Go to the Strategy Agent, generate a recommendation, provide feedback with 
              "Teach ContentMind", and watch the learning particle travel from Strategy → 
              Feedback → Hindsight → Timeline.
            </p>
            <button
              onClick={() => setShowParticle(true)}
              className="px-6 py-3 bg-gradient-to-r from-learning to-intelligence text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Preview Learning Animation
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
