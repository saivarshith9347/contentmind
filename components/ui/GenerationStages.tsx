'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, Target, Sparkles, CheckCircle2 } from 'lucide-react';

interface GenerationStagesProps {
  isGenerating: boolean;
  currentStage: number;
}

const stages = [
  { id: 0, label: 'RECALLING MEMORY...', icon: Brain, color: 'rgb(168, 85, 247)' },
  { id: 1, label: 'ANALYZING PERFORMANCE...', icon: TrendingUp, color: 'rgb(59, 130, 246)' },
  { id: 2, label: 'CHECKING CONTENT GAPS...', icon: Target, color: 'rgb(251, 146, 60)' },
  { id: 3, label: 'FORMING STRATEGY...', icon: Sparkles, color: 'rgb(34, 197, 94)' },
  { id: 4, label: 'STRATEGY READY', icon: CheckCircle2, color: 'rgb(168, 85, 247)' },
];

export default function GenerationStages({ isGenerating, currentStage }: GenerationStagesProps) {
  if (!isGenerating && currentStage === 0) return null;

  return (
    <AnimatePresence mode="wait">
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="surface-elevated rounded-2xl p-12 text-center"
        >
          <div className="max-w-md mx-auto">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = currentStage === index;
              const isCompleted = currentStage > index;
              
              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0.3, x: -20 }}
                  animate={{ 
                    opacity: isActive ? 1 : isCompleted ? 0.5 : 0.3,
                    x: 0 
                  }}
                  className="mb-6 last:mb-0"
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <motion.div
                      animate={{
                        scale: isActive ? [1, 1.2, 1] : 1,
                        rotate: isActive ? [0, 360] : 0,
                      }}
                      transition={{
                        scale: { duration: 1, repeat: isActive ? Infinity : 0 },
                        rotate: { duration: 2, repeat: isActive ? Infinity : 0, ease: 'linear' },
                      }}
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: isActive 
                          ? `radial-gradient(circle, ${stage.color}40 0%, ${stage.color}20 100%)`
                          : 'rgba(148, 163, 184, 0.1)',
                        border: `2px solid ${isActive ? stage.color : 'rgba(148, 163, 184, 0.3)'}`,
                        boxShadow: isActive ? `0 0 20px ${stage.color}60` : 'none',
                      }}
                    >
                      <Icon 
                        className="w-6 h-6" 
                        style={{ color: isActive ? stage.color : 'rgb(148, 163, 184)' }}
                      />
                    </motion.div>

                    {/* Label */}
                    <div className="flex-1 text-left">
                      <motion.p
                        className="font-semibold tracking-wide"
                        style={{
                          color: isActive ? stage.color : isCompleted ? 'rgb(148, 163, 184)' : 'rgb(100, 116, 139)',
                        }}
                      >
                        {stage.label}
                      </motion.p>
                    </div>

                    {/* Progress indicator */}
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6"
                      >
                        <CheckCircle2 className="w-6 h-6 text-learning" />
                      </motion.div>
                    )}
                  </div>

                  {/* Connector line */}
                  {index < stages.length - 1 && (
                    <motion.div
                      className="ml-6 h-6 w-0.5 my-1"
                      style={{
                        background: isCompleted 
                          ? `linear-gradient(to bottom, ${stage.color}, ${stages[index + 1].color})`
                          : 'rgba(148, 163, 184, 0.2)',
                      }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: isCompleted ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
