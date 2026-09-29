'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export type MemoryPulseState = 'idle' | 'recalling' | 'analyzing' | 'learning' | 'learned';

interface MemoryPulseIndicatorProps {
  state: MemoryPulseState;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

interface Particle {
  id: number;
  angle: number;
  distance: number;
  delay: number;
}

export default function MemoryPulseIndicator({ 
  state, 
  size = 'md',
  showLabel = true,
  className = ''
}: MemoryPulseIndicatorProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [connections, setConnections] = useState<number[]>([]);

  // Size configurations
  const sizeConfig = {
    sm: { core: 40, icon: 20, particle: 4, orbit: 60 },
    md: { core: 56, icon: 28, particle: 6, orbit: 80 },
    lg: { core: 72, icon: 36, particle: 8, orbit: 100 }
  };

  const config = sizeConfig[size];

  // Generate particles for recalling state
  useEffect(() => {
    if (state === 'recalling') {
      const newParticles: Particle[] = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        angle: (i * 360) / 8,
        distance: config.orbit,
        delay: i * 0.15
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [state, config.orbit]);

  // Generate connections for analyzing state
  useEffect(() => {
    if (state === 'analyzing') {
      setConnections([0, 1, 2, 3, 4, 5]);
    } else {
      setConnections([]);
    }
  }, [state]);

  // State labels
  const stateLabels = {
    idle: 'Ready',
    recalling: 'Recalling memories...',
    analyzing: 'Analyzing patterns...',
    learning: 'Forming memory...',
    learned: 'Memory stored!'
  };

  // State colors
  const stateColors = {
    idle: 'var(--accent-memory)',
    recalling: 'var(--accent-recall)',
    analyzing: 'var(--accent-intelligence)',
    learning: 'var(--accent-learning)',
    learned: 'var(--accent-growth)'
  };

  const currentColor = stateColors[state];

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Main visualization */}
      <div 
        className="relative flex items-center justify-center"
        style={{ width: config.orbit * 2, height: config.orbit * 2 }}
      >
        {/* Orbital ring - visible during recalling */}
        <AnimatePresence>
          {state === 'recalling' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.2, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 rounded-full border-2"
              style={{ 
                borderColor: `rgb(${currentColor})`,
                borderStyle: 'dashed'
              }}
            />
          )}
        </AnimatePresence>

        {/* Connection lines - visible during analyzing */}
        <AnimatePresence>
          {state === 'analyzing' && connections.map((index) => {
            const angle = (index * 60) * (Math.PI / 180);
            const length = config.orbit * 0.7;
            
            return (
              <motion.div
                key={`connection-${index}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.6, 0],
                  scale: 1
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.5,
                  delay: index * 0.1,
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
                className="absolute"
                style={{
                  width: 2,
                  height: length,
                  background: `linear-gradient(to bottom, rgba(${currentColor}, 0.8), rgba(${currentColor}, 0))`,
                  transformOrigin: 'top center',
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${angle}rad)`
                }}
              />
            );
          })}
        </AnimatePresence>

        {/* Particles - visible during recalling and learning */}
        <AnimatePresence>
          {state === 'recalling' && particles.map((particle) => {
            const startAngle = particle.angle * (Math.PI / 180);
            const startX = Math.cos(startAngle) * particle.distance;
            const startY = Math.sin(startAngle) * particle.distance;

            return (
              <motion.div
                key={particle.id}
                initial={{ 
                  x: startX, 
                  y: startY,
                  opacity: 0,
                  scale: 0
                }}
                animate={{ 
                  x: 0, 
                  y: 0,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  delay: particle.delay,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: 'easeInOut'
                }}
                className="absolute rounded-full"
                style={{
                  width: config.particle,
                  height: config.particle,
                  background: `rgb(${currentColor})`,
                  boxShadow: `0 0 ${config.particle * 2}px rgba(${currentColor}, 0.6)`
                }}
              />
            );
          })}

          {/* Learning particle - single particle moving into core */}
          {state === 'learning' && (
            <motion.div
              initial={{ 
                x: 0,
                y: -config.orbit,
                opacity: 0,
                scale: 0
              }}
              animate={{ 
                x: 0, 
                y: 0,
                opacity: [0, 1, 0.8, 0],
                scale: [0, 1.2, 1, 0]
              }}
              transition={{
                duration: 1.5,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="absolute rounded-full"
              style={{
                width: config.particle * 1.5,
                height: config.particle * 1.5,
                background: `rgb(${currentColor})`,
                boxShadow: `0 0 ${config.particle * 3}px rgba(${currentColor}, 0.8)`
              }}
            />
          )}
        </AnimatePresence>

        {/* Memory core */}
        <motion.div
          animate={
            state === 'idle' ? {
              scale: [1, 1.05, 1],
              opacity: [0.7, 0.9, 0.7]
            } : state === 'learned' ? {
              scale: [1, 1.3, 1],
            } : {
              scale: 1
            }
          }
          transition={
            state === 'idle' ? {
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            } : state === 'learned' ? {
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1]
            } : {}
          }
          className="relative flex items-center justify-center rounded-full"
          style={{
            width: config.core,
            height: config.core,
            background: `radial-gradient(circle, rgba(${currentColor}, 0.15) 0%, rgba(${currentColor}, 0.05) 70%, transparent 100%)`,
            border: `2px solid rgba(${currentColor}, ${state === 'idle' ? 0.3 : 0.6})`,
            boxShadow: state === 'learned' 
              ? `0 0 ${config.core}px rgba(${currentColor}, 0.4), inset 0 0 ${config.core / 2}px rgba(${currentColor}, 0.2)`
              : `0 0 ${config.core / 2}px rgba(${currentColor}, 0.3), inset 0 0 ${config.core / 4}px rgba(${currentColor}, 0.1)`
          }}
        >
          {/* Icon */}
          <motion.div
            animate={{
              opacity: state === 'idle' ? [0.5, 0.8, 0.5] : 1,
              scale: state === 'learned' ? [1, 1.2, 1] : 1
            }}
            transition={
              state === 'idle' ? {
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              } : state === 'learned' ? {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1]
              } : {}
            }
            style={{ color: `rgb(${currentColor})` }}
          >
            {state === 'learning' || state === 'learned' ? (
              <Sparkles className={`${size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-7 h-7' : 'w-9 h-9'}`} />
            ) : state === 'analyzing' ? (
              <Zap className={`${size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-7 h-7' : 'w-9 h-9'}`} />
            ) : (
              <Brain className={`${size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-7 h-7' : 'w-9 h-9'}`} />
            )}
          </motion.div>
        </motion.div>

        {/* Learned pulse rings */}
        <AnimatePresence>
          {state === 'learned' && (
            <>
              <motion.div
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute rounded-full border-2"
                style={{
                  width: config.core,
                  height: config.core,
                  borderColor: `rgb(${currentColor})`
                }}
              />
              <motion.div
                initial={{ scale: 1, opacity: 0.4 }}
                animate={{ scale: 3, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
                className="absolute rounded-full border-2"
                style={{
                  width: config.core,
                  height: config.core,
                  borderColor: `rgb(${currentColor})`
                }}
              />
            </>
          )}
        </AnimatePresence>
      </div>

      {/* State label */}
      {showLabel && (
        <motion.div
          key={state}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className="mt-4 text-center"
        >
          <p 
            className={`font-medium ${
              size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
            }`}
            style={{ color: `rgb(${currentColor})` }}
          >
            {stateLabels[state]}
          </p>
        </motion.div>
      )}
    </div>
  );
}
