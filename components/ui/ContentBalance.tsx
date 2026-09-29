'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface TopicData {
  topic: string;
  count: number;
  percentage: string;
}

interface ContentBalanceProps {
  data: TopicData[];
}

export default function ContentBalance({ data }: ContentBalanceProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const colors = [
    'rgb(168, 85, 247)',  // Intelligence purple
    'rgb(59, 130, 246)',  // AI blue
    'rgb(34, 197, 94)',   // Learning green
    'rgb(251, 146, 60)',  // Opportunity amber
    'rgb(236, 72, 153)',  // Pink
  ];

  // Calculate cumulative percentages for positioning
  let cumulative = 0;
  const segments = data.map((item, index) => {
    const percentage = parseFloat(item.percentage);
    const start = cumulative;
    const end = cumulative + percentage;
    cumulative = end;
    
    return {
      ...item,
      percentage,
      start,
      end,
      color: colors[index % colors.length],
    };
  });

  return (
    <div className="space-y-6">
      {/* Portfolio Bar */}
      <div className="relative">
        <div className="h-16 bg-[rgb(var(--bg-tertiary))] rounded-xl overflow-hidden flex">
          {segments.map((segment, index) => (
            <motion.div
              key={segment.topic}
              className="relative cursor-pointer transition-all duration-300"
              style={{
                width: `${segment.percentage}%`,
                background: hoveredIndex === index 
                  ? `linear-gradient(to bottom, ${segment.color}, ${segment.color}dd)`
                  : segment.color,
                boxShadow: hoveredIndex === index ? `inset 0 0 20px ${segment.color}` : 'none',
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Label (only show if enough space) */}
              {segment.percentage > 10 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <span className="font-bold text-sm">{segment.topic}</span>
                  <span className="text-xs opacity-90">{segment.percentage.toFixed(1)}%</span>
                </div>
              )}

              {/* Hover highlight */}
              {hoveredIndex === index && (
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Hover tooltip */}
        {hoveredIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full mt-3 left-1/2 -translate-x-1/2 surface-elevated rounded-lg p-4 min-w-[200px] z-10"
            style={{
              boxShadow: `0 4px 12px ${segments[hoveredIndex].color}40`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ background: segments[hoveredIndex].color }}
              />
              <p className="font-bold text-primary">
                {segments[hoveredIndex].topic}
              </p>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-secondary">Posts:</span>
                <span className="text-primary font-semibold">
                  {segments[hoveredIndex].count}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary">Portfolio share:</span>
                <span 
                  className="font-semibold"
                  style={{ color: segments[hoveredIndex].color }}
                >
                  {segments[hoveredIndex].percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {segments.map((segment, index) => (
          <motion.div
            key={segment.topic}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.05 }}
            className="text-center p-4 surface-secondary rounded-lg cursor-pointer transition-all duration-300 hover:bg-[rgb(var(--bg-elevated))]/60"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              borderTop: hoveredIndex === index ? `2px solid ${segment.color}` : '2px solid transparent',
            }}
          >
            <div 
              className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
              style={{
                background: `${segment.color}20`,
                border: `2px solid ${segment.color}`,
              }}
            >
              <span 
                className="text-lg font-bold"
                style={{ color: segment.color }}
              >
                {segment.count}
              </span>
            </div>
            <p className="text-primary font-semibold text-sm mb-1">
              {segment.topic}
            </p>
            <p 
              className="text-xs font-medium"
              style={{ color: segment.color }}
            >
              {segment.percentage.toFixed(1)}%
            </p>
          </motion.div>
        ))}
      </div>

      {/* Balance Indicator */}
      <div className="flex items-center justify-center gap-2 text-sm">
        {Math.max(...segments.map(s => s.percentage)) - Math.min(...segments.map(s => s.percentage)) > 15 ? (
          <>
            <div className="w-3 h-3 rounded-full bg-opportunity animate-pulse" />
            <span className="text-opportunity font-medium">
              Unbalanced portfolio - opportunity to diversify
            </span>
          </>
        ) : (
          <>
            <div className="w-3 h-3 rounded-full bg-learning" />
            <span className="text-learning font-medium">
              Balanced portfolio
            </span>
          </>
        )}
      </div>
    </div>
  );
}
