'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Brain, ThumbsUp, ThumbsDown, Lightbulb, Users, 
  FileType, MessageCircle, Target, TrendingUp, AlertCircle,
  CheckCircle2, X, Copy, Download, FileText, Sparkles,
  ChevronDown, ChevronUp
} from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import GenerationStages from './ui/GenerationStages';
import MemoryParticle from './ui/MemoryParticle';
import MemoryFormationFlow from './ui/MemoryFormationFlow';
import { parseApiResponse } from '@/lib/client-api';

interface Memory {
  id: number;
  text: string;
  type: string;
  relevance: number;
}

interface Recommendation {
  recommendation: string;
  reasoning: string;
  suggestedTopics: string[];
  suggestedFormats: string[];
  targetAudience: string[];
  confidence: string;
  memoriesUsed: Memory[];
  memoryCount: number;
}

type FeedbackType = 'matches' | 'partial' | 'missed' | null;

interface PromptChip {
  id: string;
  label: string;
  value: string;
}

export default function StrategyAgentTab() {
  const [query, setQuery] = useState('');
  const [chips, setChips] = useState<PromptChip[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [previousRecommendation, setPreviousRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [generationStage, setGenerationStage] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [showMemoryParticle, setShowMemoryParticle] = useState(false);
  const [showMemoryFormation, setShowMemoryFormation] = useState(false);
  const [showMemoryPreview, setShowMemoryPreview] = useState(false);
  const [memoryStats, setMemoryStats] = useState({
    totalMemories: 120,
    historicalPosts: 45,
    audienceSignals: 12,
  });

  const exampleQueries = [
    'What should we post next week?',
    'What cybersecurity content should we create?',
    'Which topics are performing well?',
    'What content gaps should we fill?',
  ];

  const chipOptions = [
    { id: 'goal', label: 'GOAL', placeholder: 'Increase engagement' },
    { id: 'audience', label: 'AUDIENCE', placeholder: 'Developers' },
    { id: 'topic', label: 'TOPIC', placeholder: 'Cybersecurity' },
    { id: 'timeframe', label: 'TIMEFRAME', placeholder: 'Next 2 weeks' },
  ];

  const memoryConsiderations = [
    'Audience preferences',
    'Historical performance',
    'Previous feedback',
    'Topic coverage',
    'Brand voice',
  ];

  // Simulate stage progression during generation
  useEffect(() => {
    if (loading) {
      const stageTimings = [0, 800, 1600, 2400, 3200];
      const timeouts = stageTimings.map((delay, index) =>
        setTimeout(() => setGenerationStage(index), delay)
      );
      return () => timeouts.forEach(clearTimeout);
    } else {
      setGenerationStage(0);
    }
  }, [loading]);

  const addChip = (option: typeof chipOptions[0]) => {
    const existingChip = chips.find(c => c.id === option.id);
    if (!existingChip) {
      const value = prompt(`Enter ${option.label}:`, option.placeholder);
      if (value) {
        setChips([...chips, { id: option.id, label: option.label, value }]);
      }
    }
  };

  const removeChip = (id: string) => {
    setChips(chips.filter(c => c.id !== id));
  };

  const buildFinalQuery = () => {
    if (chips.length === 0) return query;
    
    const chipText = chips.map(c => `${c.label}: ${c.value}`).join(', ');
    return query ? `${query}\n\nContext: ${chipText}` : chipText;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalQuery = buildFinalQuery();
    if (!finalQuery.trim()) return;

    // Store previous recommendation before generating new one
    if (recommendation) {
      setPreviousRecommendation(recommendation);
    }

    setLoading(true);
    setRecommendation(null);
    setShowFeedback(false);
    setFeedbackSubmitted(false);
    setFeedbackType(null);
    setGenerationStage(0);

    try {
      const response = await fetch('/api/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: finalQuery, budget: 'mid' }),
      });

      const data = await parseApiResponse(response);

      if (data.success) {
        // Wait for final stage animation
        await new Promise(resolve => setTimeout(resolve, 3500));
        
        setRecommendation({
          recommendation: data.recommendation,
          reasoning: data.reasoning,
          suggestedTopics: data.suggestedTopics,
          suggestedFormats: data.suggestedFormats,
          targetAudience: data.targetAudience,
          confidence: data.confidence,
          memoriesUsed: data.memoriesUsed,
          memoryCount: data.memoryCount,
        });
        setShowFeedback(true);
      } else {
        alert(data.error || 'Failed to generate strategy');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to generate strategy');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (type: FeedbackType) => {
    setFeedbackType(type);
    
    if (!feedbackText.trim()) return;

    try {
      const helpful = type === 'matches';
      const finalQuery = buildFinalQuery();
      
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          helpful,
          feedback: `${type}: ${feedbackText}`,
          query: finalQuery,
        }),
      });

      const data = await parseApiResponse(response);

      if (data.success) {
        setShowMemoryFormation(true);
        // Memory formation flow will handle the completion
      }
    } catch (error: any) {
      alert(error.message || 'Failed to submit feedback');
    }
  };

  const handleMemoryFormationComplete = () => {
    setFeedbackSubmitted(true);
    setFeedbackText('');
    setShowMemoryFormation(false);
  };

  const copyStrategy = () => {
    if (!recommendation) return;
    
    const text = `CONTENT STRATEGY\n\n${recommendation.recommendation}\n\nREASONING:\n${recommendation.reasoning}\n\nTOPICS: ${recommendation.suggestedTopics.join(', ')}\nFORMATS: ${recommendation.suggestedFormats.join(', ')}\nAUDIENCE: ${recommendation.targetAudience.join(', ')}`;
    
    navigator.clipboard.writeText(text);
    alert('Strategy copied to clipboard!');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Memory Particle Animation */}
      {showMemoryParticle && (
        <MemoryParticle onComplete={() => setShowMemoryParticle(false)} />
      )}

      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-black text-primary mb-3">
          Ask ContentMind
        </h1>
        <p className="text-xl text-secondary mb-6">
          Give me a goal. I'll remember what worked.
        </p>

        {/* Memory Status */}
        <div className="inline-flex items-center gap-6 surface-primary px-6 py-3 rounded-full">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 bg-intelligence rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-intelligence text-sm font-semibold">{memoryStats.totalMemories} memories ready</span>
          </div>
          <span className="text-tertiary text-sm">•</span>
          <span className="text-secondary text-sm">{memoryStats.historicalPosts} historical posts analyzed</span>
          <span className="text-tertiary text-sm">•</span>
          <span className="text-secondary text-sm">{memoryStats.audienceSignals} audience signals</span>
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* STRATEGY INPUT */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card variant="elevated" className="p-8" glow="intelligence">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Main Query Input */}
            <div>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you trying to achieve?"
                rows={4}
                className="w-full px-6 py-5 bg-[rgb(var(--bg-tertiary))] border border-[rgb(var(--border-subtle))] rounded-xl text-primary text-lg placeholder-dim focus:outline-none focus:border-intelligence focus:ring-2 focus:ring-intelligence/30 transition-all resize-none"
              />
            </div>

            {/* Chip Options */}
            <div>
              <p className="text-secondary text-sm mb-3">Add context (optional):</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {chipOptions.map((option) => {
                  const hasChip = chips.find(c => c.id === option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => addChip(option)}
                      disabled={!!hasChip}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        hasChip
                          ? 'surface-secondary text-tertiary cursor-not-allowed'
                          : 'surface-primary text-secondary hover:bg-[rgb(var(--bg-elevated))]/60 hover:text-intelligence'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {/* Active Chips */}
              {chips.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {chips.map((chip) => (
                    <motion.div
                      key={chip.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[rgb(var(--accent-intelligence-dim))] to-[rgb(var(--accent-intelligence))] rounded-lg text-white text-sm"
                    >
                      <span className="font-semibold">{chip.label}:</span>
                      <span>{chip.value}</span>
                      <button
                        type="button"
                        onClick={() => removeChip(chip.id)}
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Example Queries */}
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((example, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setQuery(example)}
                  className="inline-flex items-center gap-2 px-4 py-2 surface-secondary rounded-lg text-secondary hover:text-intelligence hover:bg-[rgb(var(--bg-elevated))]/60 transition-all text-sm"
                >
                  {example}
                </button>
              ))}
            </div>

            {/* Generate Button */}
            <Button
              type="submit"
              variant="intelligence"
              size="lg"
              disabled={loading || (!query.trim() && chips.length === 0)}
              icon={<Sparkles className="w-5 h-5" />}
              className="w-full"
            >
              {loading ? 'Generating Strategy...' : 'Generate Strategy'}
            </Button>
          </form>
        </Card>
      </motion.div>

      {/* ============================================ */}
      {/* MEMORY PREVIEW */}
      {/* ============================================ */}
      {!loading && !recommendation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="secondary" className="p-6">
            <button
              onClick={() => setShowMemoryPreview(!showMemoryPreview)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-intelligence" />
                <div>
                  <h3 className="text-primary font-semibold">ContentMind will consider</h3>
                  <p className="text-tertiary text-sm">Click to see what memories inform the strategy</p>
                </div>
              </div>
              {showMemoryPreview ? (
                <ChevronUp className="w-5 h-5 text-secondary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-secondary" />
              )}
            </button>

            <AnimatePresence>
              {showMemoryPreview && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 space-y-2 overflow-hidden"
                >
                  {memoryConsiderations.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 text-secondary"
                    >
                      <div className="w-2 h-2 rounded-full bg-intelligence" />
                      <span className="text-sm">{item}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      )}

      {/* ============================================ */}
      {/* GENERATION ANIMATION */}
      {/* ============================================ */}
      <GenerationStages isGenerating={loading} currentStage={generationStage} />

      {/* ============================================ */}
      {/* BEFORE/AFTER LEARNING */}
      {/* ============================================ */}
      {previousRecommendation && recommendation && feedbackSubmitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <Card variant="elevated" className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-primary mb-2">Learning in Action</h2>
              <p className="text-secondary">See how your feedback improved the strategy</p>
            </div>

            <div className="space-y-6">
              {/* Before */}
              <div className="surface-secondary rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-tertiary" />
                  <h3 className="text-secondary font-semibold">BEFORE LEARNING</h3>
                </div>
                <p className="text-tertiary text-sm line-clamp-3">
                  {previousRecommendation.recommendation}
                </p>
              </div>

              {/* You Taught */}
              <div className="flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[rgb(var(--accent-learning-dim))] to-[rgb(var(--accent-learning))] flex items-center justify-center mb-2">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-learning font-semibold text-sm mb-1">YOU TAUGHT CONTENTMIND</p>
                  <p className="text-secondary text-sm text-center max-w-md">
                    "{feedbackText || 'Your feedback was recorded'}"
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
                  <CheckCircle2 className="w-5 h-5 text-learning" />
                  <h3 className="text-intelligence font-semibold">AFTER LEARNING</h3>
                </div>
                <p className="text-primary text-sm">
                  {recommendation.recommendation}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* ============================================ */}
      {/* RESULT */}
      {/* ============================================ */}
      {recommendation && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main Strategy */}
          <Card variant="elevated" className="p-8" glow="intelligence">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-7 h-7 text-intelligence" />
                <h2 className="text-2xl font-bold text-primary">Content Strategy</h2>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyStrategy}
                  icon={<Copy className="w-4 h-4" />}
                >
                  Copy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Download className="w-4 h-4" />}
                >
                  Export
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Why This Strategy */}
              <div>
                <h3 className="text-intelligence font-semibold mb-2 uppercase text-sm tracking-wide">
                  Why This Strategy
                </h3>
                <p className="text-secondary leading-relaxed">
                  {recommendation.reasoning}
                </p>
              </div>

              {/* What to Create */}
              <div>
                <h3 className="text-intelligence font-semibold mb-2 uppercase text-sm tracking-wide">
                  What to Create
                </h3>
                <p className="text-primary text-lg leading-relaxed">
                  {recommendation.recommendation}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-[rgb(var(--border-subtle))]">
                {/* Format */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileType className="w-4 h-4 text-learning" />
                    <h4 className="text-secondary font-semibold text-sm">Format</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.suggestedFormats.map((format, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-[rgb(var(--accent-learning-dim))]/20 to-[rgb(var(--accent-learning))]/20 border border-learning/30 rounded-full text-learning text-xs font-medium"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Target Audience */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-ai" />
                    <h4 className="text-secondary font-semibold text-sm">Target Audience</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.targetAudience.map((audience, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-[rgb(var(--accent-ai-dim))]/20 to-[rgb(var(--accent-ai))]/20 border border-ai/30 rounded-full text-ai text-xs font-medium"
                      >
                        {audience}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Topics */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MessageCircle className="w-4 h-4 text-opportunity" />
                    <h4 className="text-secondary font-semibold text-sm">Topics</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.suggestedTopics.map((topic, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-[rgb(var(--accent-opportunity-dim))]/20 to-[rgb(var(--accent-opportunity))]/20 border border-opportunity/30 rounded-full text-opportunity text-xs font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Next Action */}
              <div className="border-l-2 border-intelligence pl-4 py-2 bg-[rgb(var(--accent-intelligence))]/5 rounded-r-lg">
                <p className="text-intelligence text-sm font-semibold mb-1 uppercase tracking-wide">
                  Next Action
                </p>
                <p className="text-primary">
                  Start with a {recommendation.suggestedFormats[0]?.toLowerCase()} on {recommendation.suggestedTopics[0]} 
                  targeting {recommendation.targetAudience[0]?.toLowerCase()}
                </p>
              </div>
            </div>
          </Card>

          {/* ============================================ */}
          {/* MEMORY TRACE */}
          {/* ============================================ */}
          <Card variant="secondary" className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-intelligence" />
              <h3 className="text-xl font-bold text-primary">Why ContentMind recommended this</h3>
            </div>
            
            <p className="text-secondary text-sm mb-4">
              These {recommendation.memoriesUsed.length} memories from Hindsight informed this strategy
            </p>

            <div className="grid md:grid-cols-2 gap-3">
              {recommendation.memoriesUsed.slice(0, 5).map((memory, index) => (
                <motion.button
                  key={memory.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-left p-4 surface-primary rounded-lg hover:bg-[rgb(var(--bg-elevated))]/60 transition-all border border-transparent hover:border-intelligence/30 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[rgb(var(--accent-intelligence-dim))]/30 to-[rgb(var(--accent-intelligence))]/30 flex items-center justify-center flex-shrink-0 group-hover:from-[rgb(var(--accent-intelligence-dim))]/50 group-hover:to-[rgb(var(--accent-intelligence))]/50 transition-all">
                      {memory.type === 'feedback' && <MessageCircle className="w-4 h-4 text-intelligence" />}
                      {memory.type === 'performance' && <TrendingUp className="w-4 h-4 text-intelligence" />}
                      {memory.type === 'content' && <FileText className="w-4 h-4 text-intelligence" />}
                      {memory.type === 'gap' && <Target className="w-4 h-4 text-intelligence" />}
                      {!['feedback', 'performance', 'content', 'gap'].includes(memory.type) && <Brain className="w-4 h-4 text-intelligence" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-primary text-sm line-clamp-2 group-hover:text-intelligence transition-colors">
                        {memory.text}
                      </p>
                      <p className="text-tertiary text-xs mt-1">{memory.type}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </Card>

          {/* ============================================ */}
          {/* STRATEGY CONFIDENCE */}
          {/* ============================================ */}
          <Card variant="secondary" className="p-6">
            <h3 className="text-primary font-semibold mb-4 uppercase text-sm tracking-wide">
              Memory Support
            </h3>
            
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-3 bg-[rgb(var(--bg-tertiary))] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[rgb(var(--accent-intelligence-dim))] to-[rgb(var(--accent-intelligence))]"
                    initial={{ width: 0 }}
                    animate={{ width: recommendation.confidence === 'High' ? '85%' : recommendation.confidence === 'Medium' ? '65%' : '45%' }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
                <span className="text-intelligence font-semibold text-sm min-w-[60px]">
                  {recommendation.confidence === 'High' ? 'Strong' : recommendation.confidence === 'Medium' ? 'Good' : 'Moderate'}
                </span>
              </div>
            </div>

            <p className="text-secondary text-sm">
              Based on <span className="text-intelligence font-semibold">{recommendation.memoryCount}</span> relevant memories
            </p>
          </Card>

          {/* ============================================ */}
          {/* FEEDBACK */}
          {/* ============================================ */}
          {showFeedback && !feedbackSubmitted && (
            <Card variant="elevated" className="p-8" glow="learning">
              <h3 className="text-2xl font-bold text-primary mb-2 text-center">
                Teach ContentMind
              </h3>
              <p className="text-secondary text-center mb-6">
                Was this strategy useful?
              </p>

              {!feedbackType && (
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <Button
                    variant="learning"
                    size="lg"
                    onClick={() => setFeedbackType('matches')}
                    icon={<CheckCircle2 className="w-5 h-5" />}
                    className="h-auto py-4"
                  >
                    <div className="text-center">
                      <div className="font-bold">This matches our audience</div>
                      <div className="text-xs opacity-80 mt-1">Perfect recommendation</div>
                    </div>
                  </Button>

                  <Button
                    variant="ai"
                    size="lg"
                    onClick={() => setFeedbackType('partial')}
                    icon={<TrendingUp className="w-5 h-5" />}
                    className="h-auto py-4"
                  >
                    <div className="text-center">
                      <div className="font-bold">Partially useful</div>
                      <div className="text-xs opacity-80 mt-1">Good direction, needs tweaks</div>
                    </div>
                  </Button>

                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setFeedbackType('missed')}
                    icon={<AlertCircle className="w-5 h-5" />}
                    className="h-auto py-4"
                  >
                    <div className="text-center">
                      <div className="font-bold">This missed the mark</div>
                      <div className="text-xs opacity-80 mt-1">Not quite right</div>
                    </div>
                  </Button>
                </div>
              )}

              {feedbackType && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-secondary text-sm mb-2 block">
                      What should I remember?
                    </label>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Our audience prefers..."
                      rows={4}
                      className="w-full px-6 py-4 bg-[rgb(var(--bg-tertiary))] border border-[rgb(var(--border-subtle))] rounded-xl text-primary placeholder-dim focus:outline-none focus:border-learning focus:ring-2 focus:ring-learning/30 transition-all resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="learning"
                      size="lg"
                      onClick={() => handleFeedback(feedbackType)}
                      disabled={!feedbackText.trim()}
                      icon={<Brain className="w-5 h-5" />}
                      className="flex-1"
                    >
                      Teach ContentMind
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => {
                        setFeedbackType(null);
                        setFeedbackText('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              )}
            </Card>
          )}

          {/* Memory Formation Flow */}
          <AnimatePresence>
            {showMemoryFormation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                onClick={() => {}}
              >
                <div className="relative">
                  <Card variant="elevated" className="p-12" glow="learning">
                    <MemoryFormationFlow
                      isActive={showMemoryFormation}
                      onComplete={handleMemoryFormationComplete}
                      trigger="feedback"
                      size="lg"
                    />
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {feedbackSubmitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card variant="elevated" className="p-8 text-center" glow="learning">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-20 h-20 bg-gradient-to-br from-[rgb(var(--accent-learning-dim))] to-[rgb(var(--accent-learning))] rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-learning mb-2">✓ Learned</h3>
                <p className="text-primary text-lg mb-1">
                  ContentMind will remember this for future strategies.
                </p>
                <p className="text-secondary text-sm">
                  Your feedback has been stored in Hindsight memory.
                </p>
              </Card>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
