'use client';

import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface MemoryParticleProps {
  onComplete: () => void;
}

export default function MemoryParticle({ onComplete }: MemoryParticleProps) {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 1.5 }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        className="relative"
        initial={{ scale: 1, y: 0 }}
        animate={{ 
          scale: [1, 0.5, 0],
          y: [0, -200, -400],
        }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        {/* Particle glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.8) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 2, 3],
            opacity: [0.8, 0.4, 0],
          }}
          transition={{ duration: 1.5 }}
        />
        
        {/* Brain icon */}
        <motion.div
          className="w-16 h-16 rounded-full bg-gradient-to-br from-[rgb(var(--accent-intelligence-dim))] to-[rgb(var(--accent-intelligence))] flex items-center justify-center"
          style={{
            boxShadow: '0 0 30px rgba(168,85,247,0.8)',
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 1.5, ease: 'linear' }}
        >
          <Brain className="w-8 h-8 text-white" />
        </motion.div>

        {/* Trail effect */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-32"
          style={{
            background: 'linear-gradient(to bottom, rgba(168,85,247,0.6), transparent)',
          }}
          animate={{
            y: [0, 100, 200],
            opacity: [1, 0.5, 0],
          }}
          transition={{ duration: 1.5 }}
        />
      </motion.div>
    </motion.div>
  );
}
