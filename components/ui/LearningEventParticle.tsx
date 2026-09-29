'use client';

import { motion } from 'framer-motion';
import { Sparkles, MessageSquare, Brain } from 'lucide-react';

interface LearningEventParticleProps {
  onComplete: () => void;
}

export default function LearningEventParticle({ onComplete }: LearningEventParticleProps) {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 3 }}
      onAnimationComplete={onComplete}
    >
      {/* Path visualization */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(34, 197, 94, 0.5)" />
            <stop offset="50%" stopColor="rgba(236, 72, 153, 0.5)" />
            <stop offset="100%" stopColor="rgba(168, 85, 247, 0.5)" />
          </linearGradient>
        </defs>
        
        <motion.path
          d="M 25% 50%, L 40% 50%, L 55% 50%, L 70% 50%"
          stroke="url(#pathGradient)"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.8, 0] }}
          transition={{ duration: 3, ease: 'easeInOut' }}
        />
      </svg>

      {/* Particle journey */}
      <motion.div
        className="absolute"
        initial={{ left: '25%', top: '50%' }}
        animate={{
          left: ['25%', '40%', '55%', '70%'],
          top: ['50%', '50%', '50%', '50%'],
        }}
        transition={{ duration: 3, ease: 'easeInOut' }}
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        {/* Stage 1: Strategy (Green) */}
        <motion.div
          className="absolute"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ 
            scale: [1, 1.5, 0],
            opacity: [1, 1, 0]
          }}
          transition={{ duration: 1, times: [0, 0.3, 1] }}
        >
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, rgba(34,197,94,0.8) 0%, rgba(34,197,94,0.3) 100%)',
              boxShadow: '0 0 30px rgba(34,197,94,0.8)',
            }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        {/* Stage 2: Feedback (Pink) */}
        <motion.div
          className="absolute"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1, 1.5, 0],
            opacity: [0, 1, 1, 0]
          }}
          transition={{ duration: 1, delay: 1, times: [0, 0.3, 0.7, 1] }}
        >
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, rgba(236,72,153,0.8) 0%, rgba(236,72,153,0.3) 100%)',
              boxShadow: '0 0 30px rgba(236,72,153,0.8)',
            }}
          >
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        {/* Stage 3: Hindsight (Purple) */}
        <motion.div
          className="absolute"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1, 1.5, 0],
            opacity: [0, 1, 1, 0]
          }}
          transition={{ duration: 1, delay: 2, times: [0, 0.3, 0.7, 1] }}
        >
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, rgba(168,85,247,0.8) 0%, rgba(168,85,247,0.3) 100%)',
              boxShadow: '0 0 30px rgba(168,85,247,0.8)',
            }}
          >
            <Brain className="w-8 h-8 text-white" />
          </div>
        </motion.div>

        {/* Trail effect */}
        <motion.div
          className="absolute w-2 h-40"
          style={{
            background: 'linear-gradient(to bottom, rgba(34,197,94,0.6), rgba(236,72,153,0.4), rgba(168,85,247,0.2), transparent)',
            transform: 'translateX(-50%)',
          }}
          initial={{ scaleY: 0, opacity: 0.8 }}
          animate={{ scaleY: 1, opacity: 0 }}
          transition={{ duration: 3 }}
        />
      </motion.div>

      {/* Labels */}
      <motion.div
        className="absolute left-[25%] top-[55%] text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 3, times: [0, 0.1, 0.9, 1] }}
      >
        <p className="text-learning text-sm font-bold">Strategy</p>
      </motion.div>

      <motion.div
        className="absolute left-[40%] top-[55%] text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 3, delay: 1, times: [0, 0.1, 0.9, 1] }}
      >
        <p className="text-[rgb(236,72,153)] text-sm font-bold">Feedback</p>
      </motion.div>

      <motion.div
        className="absolute left-[55%] top-[55%] text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 3, delay: 2, times: [0, 0.1, 0.9, 1] }}
      >
        <p className="text-intelligence text-sm font-bold">Hindsight</p>
      </motion.div>

      <motion.div
        className="absolute left-[70%] top-[55%] text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 3, delay: 2.5, times: [0, 0.1, 0.9, 1] }}
      >
        <p className="text-intelligence text-sm font-bold">Learning Timeline</p>
      </motion.div>
    </motion.div>
  );
}
