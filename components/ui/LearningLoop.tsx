'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Eye, Brain, Lightbulb, Sparkles, MessageSquare, TrendingUp } from 'lucide-react';

interface LearningLoopProps {
  onStageClick?: (stage: string) => void;
}

const stages = [
  { 
    id: 'observe', 
    label: 'OBSERVE', 
    icon: Eye, 
    color: 'rgb(59, 130, 246)',
    description: 'ContentMind monitors content performance and audience behavior',
    example: 'Tracking engagement on tutorials vs awareness posts'
  },
  { 
    id: 'remember', 
    label: 'REMEMBER', 
    icon: Brain, 
    color: 'rgb(168, 85, 247)',
    description: 'Patterns and insights are stored in Hindsight memory',
    example: 'Storing: "Tutorials get 10.7% avg engagement"'
  },
  { 
    id: 'recall', 
    label: 'RECALL', 
    icon: Lightbulb, 
    color: 'rgb(251, 146, 60)',
    description: 'Relevant memories are retrieved when generating strategies',
    example: 'Retrieving tutorial performance data for recommendation'
  },
  { 
    id: 'recommend', 
    label: 'RECOMMEND', 
    icon: Sparkles, 
    color: 'rgb(34, 197, 94)',
    description: 'Data-informed strategies are generated using recalled memories',
    example: 'Suggesting: "Create cybersecurity tutorial series"'
  },
  { 
    id: 'feedback', 
    label: 'FEEDBACK', 
    icon: MessageSquare, 
    color: 'rgb(236, 72, 153)',
    description: 'User provides feedback on strategy quality and preferences',
    example: 'User: "Audience prefers hands-on demonstrations"'
  },
  { 
    id: 'learn', 
    label: 'LEARN', 
    icon: TrendingUp, 
    color: 'rgb(14, 165, 233)',
    description: 'Feedback becomes new knowledge, improving future recommendations',
    example: 'Storing preference → influencing next strategy'
  },
];

export default function LearningLoop({ onStageClick }: LearningLoopProps) {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);

  const handleStageClick = (stageId: string) => {
    setSelectedStage(selectedStage === stageId ? null : stageId);
    onStageClick?.(stageId);
  };

  // Position stages in a circle
  const getStagePosition = (index: number) => {
    const angle = (index / stages.length) * 2 * Math.PI - Math.PI / 2;
    const radius = 35; // percentage
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return { x, y };
  };

  return (
    <div className="relative w-full h-[600px] surface-primary rounded-2xl overflow-hidden">
      {/* Center "Learning Loop" label */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-0">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="w-32 h-32 rounded-full border-2 border-intelligence/20"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Brain className="w-12 h-12 text-intelligence mb-2" />
          <p className="text-intelligence font-bold text-sm uppercase tracking-wider">
            Learning
          </p>
          <p className="text-tertiary text-xs">
            Continuous
          </p>
        </div>
      </div>

      {/* Connection circle */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <circle
          cx="50%"
          cy="50%"
          r="35%"
          fill="none"
          stroke="rgba(168, 85, 247, 0.2)"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* Animated flow */}
        <motion.circle
          r="4"
          fill="rgb(168, 85, 247)"
          initial={{ offsetDistance: '0%' }}
          animate={{ offsetDistance: '100%' }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        >
          <animateMotion
            dur="6s"
            repeatCount="indefinite"
            path={`M ${window.innerWidth/2 + window.innerWidth*0.35 * Math.cos(-Math.PI/2)},${window.innerHeight/2 + window.innerHeight*0.35 * Math.sin(-Math.PI/2)} A ${window.innerWidth*0.35},${window.innerHeight*0.35} 0 1,1 ${window.innerWidth/2 + window.innerWidth*0.35 * Math.cos(-Math.PI/2-0.01)},${window.innerHeight/2 + window.innerHeight*0.35 * Math.sin(-Math.PI/2-0.01)}`}
          />
        </motion.circle>

        {/* Arrows between stages */}
        {stages.map((_, index) => {
          const current = getStagePosition(index);
          const next = getStagePosition((index + 1) % stages.length);
          
          return (
            <g key={index}>
              <defs>
                <marker
                  id={`arrowhead-${index}`}
                  markerWidth="10"
                  markerHeight="10"
                  refX="8"
                  refY="3"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3, 0 6"
                    fill="rgba(168, 85, 247, 0.3)"
                  />
                </marker>
              </defs>
            </g>
          );
        })}
      </svg>

      {/* Stages */}
      {stages.map((stage, index) => {
        const pos = getStagePosition(index);
        const Icon = stage.icon;
        const isSelected = selectedStage === stage.id;
        const isHovered = hoveredStage === stage.id;
        const isActive = isSelected || isHovered;

        return (
          <motion.div
            key={stage.id}
            className="absolute cursor-pointer z-10"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.1 }}
            onHoverStart={() => setHoveredStage(stage.id)}
            onHoverEnd={() => setHoveredStage(null)}
            onClick={() => handleStageClick(stage.id)}
          >
            {/* Stage node */}
            <motion.div
              className="relative w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300"
              style={{
                background: `radial-gradient(circle, ${stage.color}40 0%, ${stage.color}20 100%)`,
                border: `3px solid ${stage.color}`,
                boxShadow: isActive ? `0 0 30px ${stage.color}80` : `0 0 15px ${stage.color}40`,
              }}
              animate={isActive ? {
                scale: [1, 1.05, 1],
              } : {}}
              transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
            >
              <Icon 
                className="w-8 h-8 mb-1" 
                style={{ color: stage.color }}
              />
              <span 
                className="text-[10px] font-bold uppercase tracking-wide"
                style={{ color: stage.color }}
              >
                {stage.label}
              </span>

              {/* Pulse ring */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: `2px solid ${stage.color}` }}
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.div>

            {/* Stage number */}
            <div 
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: stage.color }}
            >
              {index + 1}
            </div>
          </motion.div>
        );
      })}

      {/* Selected stage detail */}
      <AnimatePresence>
        {selectedStage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 left-6 right-6 surface-elevated rounded-xl p-6 z-20"
          >
            {(() => {
              const stage = stages.find(s => s.id === selectedStage);
              if (!stage) return null;
              const Icon = stage.icon;

              return (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: `${stage.color}20`,
                        border: `2px solid ${stage.color}`,
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: stage.color }} />
                    </div>
                    <div>
                      <h3 
                        className="text-xl font-bold uppercase tracking-wide"
                        style={{ color: stage.color }}
                      >
                        {stage.label}
                      </h3>
                      <p className="text-tertiary text-xs">Stage {stages.findIndex(s => s.id === selectedStage) + 1} of 6</p>
                    </div>
                  </div>

                  <p className="text-primary mb-3">
                    {stage.description}
                  </p>

                  <div className="p-3 surface-secondary rounded-lg">
                    <p className="text-secondary text-xs uppercase tracking-wide mb-1">Example</p>
                    <p className="text-primary text-sm italic">
                      "{stage.example}"
                    </p>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
