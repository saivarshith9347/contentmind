'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Target, TrendingUp, Zap } from 'lucide-react';

interface TopicData {
  topic: string;
  count: number;
  percentage: string;
}

interface OpportunityRadarProps {
  data: TopicData[];
  onTopicClick?: (topic: string) => void;
}

export default function OpportunityRadar({ data, onTopicClick }: OpportunityRadarProps) {
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);

  // Calculate opportunity score (inverse of coverage)
  const maxCount = Math.max(...data.map(d => d.count));
  
  const topicsWithMetrics = data.map(item => {
    const coveragePercent = (item.count / maxCount) * 100;
    const opportunityScore = 100 - coveragePercent; // Lower coverage = higher opportunity
    
    return {
      ...item,
      coverage: coveragePercent,
      opportunity: opportunityScore,
      performance: 75 + Math.random() * 25, // Mock performance data
    };
  });

  // Position topics in a circular radar layout
  const positionTopic = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const radius = 40; // percentage from center
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return { x, y };
  };

  const getOpportunityColor = (opportunity: number) => {
    if (opportunity > 70) return 'rgb(239, 68, 68)'; // High opportunity (red)
    if (opportunity > 40) return 'rgb(251, 146, 60)'; // Medium (amber)
    return 'rgb(34, 197, 94)'; // Low opportunity (green)
  };

  return (
    <div className="relative w-full h-[500px] surface-primary rounded-2xl overflow-hidden">
      {/* Radar circles */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(168, 85, 247, 0.1)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Center point */}
        <circle cx="50%" cy="50%" r="3" fill="rgb(168, 85, 247)" />
        
        {/* Radar rings */}
        {[20, 35, 50, 65, 80].map((radius, i) => (
          <motion.circle
            key={radius}
            cx="50%"
            cy="50%"
            r={`${radius}%`}
            fill="none"
            stroke="rgba(168, 85, 247, 0.1)"
            strokeWidth="1"
            strokeDasharray="4 4"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          />
        ))}

        {/* Radar sweep animation */}
        <motion.line
          x1="50%"
          y1="50%"
          x2="50%"
          y2="10%"
          stroke="rgba(168, 85, 247, 0.4)"
          strokeWidth="2"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '50% 50%' }}
        />
      </svg>

      {/* Topics */}
      {topicsWithMetrics.map((topic, index) => {
        const pos = positionTopic(index, topicsWithMetrics.length);
        const isHovered = hoveredTopic === topic.topic;
        const color = getOpportunityColor(topic.opportunity);
        
        // Size based on opportunity (bigger = more opportunity)
        const size = 40 + (topic.opportunity / 100) * 40;
        
        return (
          <motion.div
            key={topic.topic}
            className="absolute cursor-pointer"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
            }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.1 }}
            onHoverStart={() => setHoveredTopic(topic.topic)}
            onHoverEnd={() => setHoveredTopic(null)}
            onClick={() => onTopicClick?.(topic.topic)}
          >
            {/* Topic bubble */}
            <motion.div
              className="relative flex flex-col items-center justify-center rounded-full transition-all duration-300"
              style={{
                width: size,
                height: size,
                background: `radial-gradient(circle, ${color}40 0%, ${color}20 100%)`,
                border: `2px solid ${color}`,
                boxShadow: isHovered ? `0 0 30px ${color}80` : `0 0 15px ${color}40`,
              }}
              animate={isHovered ? {
                scale: [1, 1.05, 1],
              } : {}}
              transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
            >
              {/* Pulse on high opportunity */}
              {topic.opportunity > 70 && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: `2px solid ${color}` }}
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}

              <Target 
                className="w-5 h-5 mb-1" 
                style={{ color }}
              />
              <span 
                className="text-xs font-bold"
                style={{ color }}
              >
                {topic.count}
              </span>
            </motion.div>

            {/* Label */}
            <p 
              className="text-center mt-2 font-semibold text-xs whitespace-nowrap transition-colors"
              style={{ color: isHovered ? color : 'rgb(203, 213, 225)' }}
            >
              {topic.topic}
            </p>

            {/* Tooltip on hover */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-4 left-1/2 -translate-x-1/2 surface-elevated rounded-lg p-4 min-w-[200px] z-20"
                style={{
                  boxShadow: `0 4px 12px ${color}40`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4" style={{ color }} />
                  <p className="font-bold" style={{ color }}>
                    {topic.topic}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-secondary">Coverage:</span>
                    <span className="text-primary font-semibold">{topic.count} posts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary">Performance:</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-ai" />
                      <span className="text-ai font-semibold">{topic.performance.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary">Opportunity:</span>
                    <div className="flex items-center gap-1">
                      {topic.opportunity > 70 ? (
                        <>
                          <Zap className="w-3 h-3" style={{ color }} />
                          <span className="font-semibold" style={{ color }}>High</span>
                        </>
                      ) : topic.opportunity > 40 ? (
                        <>
                          <Zap className="w-3 h-3" style={{ color }} />
                          <span className="font-semibold" style={{ color }}>Medium</span>
                        </>
                      ) : (
                        <span className="font-semibold" style={{ color }}>Low</span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-tertiary text-xs mt-2 pt-2 border-t border-[rgb(var(--border-subtle))]">
                  Click to explore opportunities
                </p>
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 surface-secondary rounded-lg p-3 text-xs">
        <p className="text-secondary font-semibold mb-2">Opportunity Level</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgb(239, 68, 68)' }} />
            <span className="text-tertiary">High (create more)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgb(251, 146, 60)' }} />
            <span className="text-tertiary">Medium (balance)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgb(34, 197, 94)' }} />
            <span className="text-tertiary">Low (maintain)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
