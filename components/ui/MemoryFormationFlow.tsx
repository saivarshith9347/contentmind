'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import MemoryPulseIndicator, { MemoryPulseState } from './MemoryPulseIndicator';

interface MemoryFormationFlowProps {
  isActive: boolean;
  onComplete?: () => void;
  trigger?: 'feedback' | 'strategy' | 'learning';
  size?: 'sm' | 'md' | 'lg';
}

interface FlowStep {
  state: MemoryPulseState;
  duration: number;
  message: string;
}

export default function MemoryFormationFlow({ 
  isActive, 
  onComplete,
  trigger = 'feedback',
  size = 'md'
}: MemoryFormationFlowProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);

  // Define flow steps based on trigger
  const flowSteps: FlowStep[] = trigger === 'feedback' ? [
    { state: 'recalling', duration: 2000, message: 'Retrieving related memories...' },
    { state: 'analyzing', duration: 1800, message: 'Analyzing feedback context...' },
    { state: 'learning', duration: 1500, message: 'Forming new memory...' },
    { state: 'learned', duration: 1000, message: 'Memory stored in Hindsight!' }
  ] : trigger === 'strategy' ? [
    { state: 'recalling', duration: 2200, message: 'Searching memory archive...' },
    { state: 'analyzing', duration: 2000, message: 'Connecting patterns...' },
    { state: 'learned', duration: 1000, message: 'Strategy enhanced with memory!' }
  ] : [
    { state: 'recalling', duration: 1800, message: 'Accessing past experiences...' },
    { state: 'learning', duration: 1500, message: 'Integrating new insight...' },
    { state: 'learned', duration: 1000, message: 'Knowledge expanded!' }
  ];

  // Reset when isActive changes to true
  useEffect(() => {
    if (isActive) {
      setCurrentStepIndex(0);
      setIsComplete(false);
    } else {
      setCurrentStepIndex(-1);
      setIsComplete(false);
    }
  }, [isActive]);

  // Progress through steps
  useEffect(() => {
    if (currentStepIndex >= 0 && currentStepIndex < flowSteps.length) {
      const timer = setTimeout(() => {
        if (currentStepIndex === flowSteps.length - 1) {
          // Last step - mark as complete
          setIsComplete(true);
          if (onComplete) {
            setTimeout(onComplete, 800);
          }
        } else {
          setCurrentStepIndex(currentStepIndex + 1);
        }
      }, flowSteps[currentStepIndex].duration);

      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, flowSteps, onComplete]);

  if (!isActive && currentStepIndex === -1) {
    return null;
  }

  const currentStep = flowSteps[currentStepIndex];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center justify-center"
    >
      {/* Memory Pulse Indicator */}
      <MemoryPulseIndicator
        state={currentStep?.state || 'idle'}
        size={size}
        showLabel={false}
      />

      {/* Status message */}
      <AnimatePresence mode="wait">
        {currentStep && (
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="mt-6 text-center"
          >
            <p className="text-sm font-medium text-[rgb(var(--text-primary))]">
              {currentStep.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      <div className="flex items-center gap-2 mt-4">
        {flowSteps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.8, opacity: 0.3 }}
            animate={{
              scale: index === currentStepIndex ? 1.2 : 1,
              opacity: index <= currentStepIndex ? 1 : 0.3
            }}
            className="w-2 h-2 rounded-full"
            style={{
              background: index <= currentStepIndex 
                ? `rgb(var(--accent-${step.state === 'recalling' ? 'recall' : step.state === 'analyzing' ? 'intelligence' : 'learning'}))`
                : 'rgb(var(--border-subtle))'
            }}
          />
        ))}
      </div>

      {/* Success message */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{
              background: 'rgba(var(--accent-growth), 0.1)',
              border: '1px solid rgba(var(--accent-growth), 0.3)'
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <Check className="w-5 h-5 text-[rgb(var(--accent-growth))]" />
            </motion.div>
            <p className="text-sm font-medium text-[rgb(var(--accent-growth))]">
              ContentMind learned something new
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
