'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Loader2, Target, Lightbulb, Sparkles, Brain, 
  TrendingUp, Video, FileText, Play, Zap 
} from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import OpportunityRadar from './ui/OpportunityRadar';
import ContentBalance from './ui/ContentBalance';
import { parseApiResponse } from '@/lib/client-api';

interface TopicData {
  topic: string;
  count: number;
  percentage: string;
}

interface Gap {
  topic: string;
  count: number;
  percentage: number;
  audienceInterest: 'High' | 'Medium' | 'Low';
  opportunity: 'High' | 'Medium' | 'Low';
  recommendedFormats: string[];
}

export default function ContentGapsTab() {
  const [topicData, setTopicData] = useState<TopicData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      const data = await parseApiResponse(response);

      if (data.success) {
        setTopicData(data.analytics.topicDistribution);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate gaps (lowest 3 topics)

  // Calculate gaps (lowest 3 topics)
  const sortedByCount = [...topicData].sort((a, b) => a.count - b.count);
  const gaps: Gap[] = sortedByCount.slice(0, 3).map(topic => ({
    ...topic,
    percentage: parseFloat(topic.percentage),
    audienceInterest: topic.count < 5 ? 'High' : topic.count < 8 ? 'Medium' : 'Low',
    opportunity: topic.count < 5 ? 'High' : topic.count < 8 ? 'Medium' : 'Low',
    recommendedFormats: ['Tutorial', 'Video', 'Live demo'],
  }));

  const getOpportunityColor = (opportunity: string) => {
    switch (opportunity) {
      case 'High': return 'rgb(239, 68, 68)';
      case 'Medium': return 'rgb(251, 146, 60)';
      default: return 'rgb(34, 197, 94)';
    }
  };

  const handleGenerateIdeas = (topic: string) => {
    // In real app, would navigate to Strategy tab with pre-filled context
    console.log('Generate ideas for:', topic);
  };

  const handleGenerateStrategy = (topic: string) => {
    // In real app, would navigate to Strategy tab with full context
    console.log('Generate strategy for:', topic);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-intelligence animate-spin mb-4" />
        <p className="text-secondary">Analyzing content opportunities...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* ============================================ */}
      {/* HERO */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-black text-primary mb-3">
          Content Opportunity Map
        </h1>
        <p className="text-xl text-secondary">
          ContentMind found areas where your content portfolio is thin.
        </p>
      </motion.div>

      {/* ============================================ */}
      {/* OPPORTUNITY RADAR */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-intelligence tracking-wider uppercase mb-1">
            Interactive Opportunity Radar
          </h2>
          <p className="text-tertiary text-sm">
            Bubble size indicates opportunity • Red = high, Amber = medium, Green = maintain
          </p>
        </div>
        <OpportunityRadar 
          data={topicData} 
          onTopicClick={setSelectedTopic}
        />
      </motion.div>

      {/* ============================================ */}
      {/* OPPORTUNITY CARDS */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold text-primary mb-1">
            Top Content Opportunities
          </h2>
          <p className="text-secondary text-sm">
            High-impact areas where ContentMind recommends creating more content
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {gaps.map((gap, index) => {
            const color = getOpportunityColor(gap.opportunity);
            
            return (
              <motion.div
                key={gap.topic}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card 
                  variant="elevated" 
                  className="p-6 h-full"
                  hover
                  style={{
                    borderTop: `3px solid ${color}`,
                  }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-black text-primary uppercase tracking-tight">
                      {gap.topic}
                    </h3>
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: `${color}20`,
                        border: `2px solid ${color}`,
                      }}
                    >
                      <Target className="w-5 h-5" style={{ color }} />
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-3 mb-6">
                    {/* Coverage */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-secondary text-xs uppercase tracking-wide">Coverage</span>
                        <span className="text-primary font-semibold">{gap.count} posts</span>
                      </div>
                      <div className="w-full h-1.5 bg-[rgb(var(--bg-tertiary))] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full"
                          style={{ background: color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${gap.percentage}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        />
                      </div>
                    </div>

                    {/* Audience Interest */}
                    <div className="flex items-center justify-between py-2 surface-secondary rounded-lg px-3">
                      <span className="text-secondary text-xs">Audience interest</span>
                      <span 
                        className="font-semibold text-sm"
                        style={{ color: gap.audienceInterest === 'High' ? color : 'rgb(148, 163, 184)' }}
                      >
                        {gap.audienceInterest}
                      </span>
                    </div>

                    {/* Opportunity */}
                    <div className="flex items-center justify-between py-2 surface-secondary rounded-lg px-3">
                      <span className="text-secondary text-xs">Opportunity</span>
                      <div className="flex items-center gap-1">
                        {gap.opportunity === 'High' && <Zap className="w-4 h-4" style={{ color }} />}
                        <span 
                          className="font-semibold text-sm"
                          style={{ color }}
                        >
                          {gap.opportunity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Formats */}
                  <div className="mb-6">
                    <p className="text-secondary text-xs uppercase tracking-wide mb-2">
                      Recommended formats
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {gap.recommendedFormats.map((format, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-xs font-medium rounded-full"
                          style={{
                            background: `${color}20`,
                            color,
                          }}
                        >
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleGenerateIdeas(gap.topic)}
                    icon={<Lightbulb className="w-4 h-4" />}
                    className="w-full"
                    style={{
                      borderColor: color,
                      color,
                    }}
                  >
                    Generate ideas
                  </Button>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* SMART RECOMMENDATIONS */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold text-primary mb-1">
            Strategic Recommendations
          </h2>
          <p className="text-secondary text-sm">
            Data-driven suggestions backed by ContentMind's memory
          </p>
        </div>

        <div className="space-y-4">
          {gaps.slice(0, 2).map((gap, index) => (
            <motion.div
              key={gap.topic}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <Card variant="elevated" className="p-6" glow="intelligence">
                <div className="space-y-4">
                  {/* Why */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-opportunity" />
                      <h3 className="text-opportunity font-semibold text-sm uppercase tracking-wide">
                        Why
                      </h3>
                    </div>
                    <p className="text-primary leading-relaxed">
                      {gap.topic} is underrepresented compared with your other topics, 
                      with only {gap.count} posts ({gap.percentage.toFixed(1)}% of content portfolio).
                    </p>
                  </div>

                  {/* Memory Support */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-intelligence" />
                      <h3 className="text-intelligence font-semibold text-sm uppercase tracking-wide">
                        Memory Support
                      </h3>
                    </div>
                    <div className="flex items-start gap-3 p-3 surface-secondary rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-intelligence/20 flex items-center justify-center flex-shrink-0">
                        <Brain className="w-4 h-4 text-intelligence" />
                      </div>
                      <div className="flex-1">
                        <p className="text-secondary text-sm">
                          "Audience responds strongly to practical tutorials with real-world examples."
                        </p>
                        <p className="text-tertiary text-xs mt-1">
                          From 22 feedback memories
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-learning" />
                      <h3 className="text-learning font-semibold text-sm uppercase tracking-wide">
                        Action
                      </h3>
                    </div>
                    <div className="border-l-2 border-learning pl-4 py-2 bg-learning/5 rounded-r-lg">
                      <p className="text-primary font-medium mb-3">
                        Create a 3-part {gap.topic} {gap.recommendedFormats[0].toLowerCase()} series 
                        with hands-on demonstrations.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="learning"
                          size="sm"
                          onClick={() => handleGenerateStrategy(gap.topic)}
                          icon={<Sparkles className="w-4 h-4" />}
                        >
                          Generate Strategy
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<FileText className="w-4 h-4" />}
                        >
                          View Examples
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* CONTENT BALANCE */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold text-primary mb-1">
            Content Portfolio Balance
          </h2>
          <p className="text-secondary text-sm">
            Current distribution across all content topics
          </p>
        </div>
        <Card variant="secondary" className="p-6">
          <ContentBalance data={topicData} />
        </Card>
      </motion.div>

      {/* ============================================ */}
      {/* QUICK ACTIONS */}
      {/* ============================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card variant="elevated" className="p-6" glow="ai">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-primary mb-2">
                Ready to fill these content gaps?
              </h3>
              <p className="text-secondary">
                Let ContentMind generate detailed strategies for each opportunity, 
                backed by your audience insights and performance data.
              </p>
            </div>
            <Button
              variant="intelligence"
              size="lg"
              icon={<Sparkles className="w-5 h-5" />}
              className="whitespace-nowrap"
            >
              Generate All Strategies
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
