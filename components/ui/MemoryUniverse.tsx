'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Brain, Users, FileText, TrendingUp, MessageSquare, Sparkles, Target, Tag } from 'lucide-react';

interface MemoryCluster {
  id: string;
  label: string;
  icon: any;
  count: number;
  x: number;
  y: number;
  color: string;
  memoryNodes: number;
}

interface MemoryUniverseProps {
  totalMemories: number;
  onClusterClick?: (clusterId: string) => void;
  activeCluster?: string | null;
}

const clusters: MemoryCluster[] = [
  { id: 'audience', label: 'Audience', icon: Users, count: 89, x: 30, y: 25, color: 'rgb(59, 130, 246)', memoryNodes: 12 },
  { id: 'content', label: 'Content', icon: FileText, count: 112, x: 70, y: 25, color: 'rgb(34, 197, 94)', memoryNodes: 15 },
  { id: 'performance', label: 'Performance', icon: TrendingUp, count: 67, x: 20, y: 60, color: 'rgb(251, 146, 60)', memoryNodes: 9 },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare, count: 22, x: 50, y: 70, color: 'rgb(168, 85, 247)', memoryNodes: 8 },
  { id: 'brand', label: 'Brand', icon: Sparkles, count: 45, x: 80, y: 60, color: 'rgb(236, 72, 153)', memoryNodes: 7 },
  { id: 'topics', label: 'Topics', icon: Tag, count: 156, x: 50, y: 35, color: 'rgb(14, 165, 233)', memoryNodes: 18 },
  { id: 'strategy', label: 'Strategy', icon: Target, count: 51, x: 50, y: 50, color: 'rgb(139, 92, 246)', memoryNodes: 11 },
];

const connections = [
  { from: 'audience', to: 'strategy' },
  { from: 'content', to: 'strategy' },
  { from: 'performance', to: 'strategy' },
  { from: 'feedback', to: 'strategy' },
  { from: 'brand', to: 'strategy' },
  { from: 'topics', to: 'strategy' },
  { from: 'audience', to: 'content' },
  { from: 'content', to: 'topics' },
  { from: 'performance', to: 'feedback' },
];

export default function MemoryUniverse({ totalMemories, onClusterClick, activeCluster }: MemoryUniverseProps) {
  const [hoveredCluster, setHoveredCluster] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getClusterPosition = (clusterId: string) => {
    const cluster = clusters.find(c => c.id === clusterId);
    return cluster ? { x: cluster.x, y: cluster.y } : { x: 0, y: 0 };
  };

  const isClusterActive = (clusterId: string) => {
    return hoveredCluster === clusterId || activeCluster === clusterId;
  };

  return (
    <div className="relative w-full h-[500px] surface-primary rounded-2xl overflow-hidden">
      {/* SVG Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <radialGradient id="connectionGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(168, 85, 247, 0.6)" />
            <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
          </radialGradient>
        </defs>

        {connections.map((conn, i) => {
          const from = getClusterPosition(conn.from);
          const to = getClusterPosition(conn.to);
          const isActive = isClusterActive(conn.from) || isClusterActive(conn.to);
          
          return (
            <motion.line
              key={i}
              x1={`${from.x}%`}
              y1={`${from.y}%`}
              x2={`${to.x}%`}
              y2={`${to.y}%`}
              stroke={isActive ? "rgba(168, 85, 247, 0.6)" : "rgba(148, 163, 184, 0.15)"}
              strokeWidth={isActive ? "2" : "1"}
              strokeDasharray={isActive ? "0" : "4 4"}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: 1,
              }}
              transition={{ duration: 1, delay: i * 0.1 }}
            />
          );
        })}
      </svg>

      {/* Center Node - ContentMind */}
      <motion.div
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.div
          className="relative w-32 h-32 rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(168,85,247,0.1) 100%)',
            border: '3px solid rgb(168, 85, 247)',
            boxShadow: '0 0 40px rgba(168,85,247,0.5)',
          }}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Brain className="w-16 h-16 text-intelligence" />
          
          {/* Pulse rings */}
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="absolute inset-0 rounded-full border-2 border-intelligence"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ 
                scale: [1, 2, 3],
                opacity: [0.5, 0.2, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: index * 1,
                ease: 'easeOut',
              }}
            />
          ))}
        </motion.div>

        <p className="text-center mt-3 text-intelligence font-bold uppercase text-sm tracking-wider">
          ContentMind
        </p>
        <p className="text-center text-tertiary text-xs">
          {totalMemories} memories
        </p>
      </motion.div>

      {/* Cluster Nodes */}
      {clusters.map((cluster, index) => {
        const Icon = cluster.icon;
        const isActive = isClusterActive(cluster.id);
        
        return (
          <motion.div
            key={cluster.id}
            className="absolute cursor-pointer"
            style={{
              left: `${cluster.x}%`,
              top: `${cluster.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              x: [0, Math.sin(index * 2) * 5, 0],
              y: [0, Math.cos(index * 2) * 5, 0],
            }}
            transition={{
              scale: { duration: 0.5, delay: 0.3 + index * 0.1 },
              opacity: { duration: 0.5, delay: 0.3 + index * 0.1 },
              x: { duration: 5 + index, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: 6 + index, repeat: Infinity, ease: 'easeInOut' },
            }}
            whileHover={{ scale: 1.1 }}
            onHoverStart={() => setHoveredCluster(cluster.id)}
            onHoverEnd={() => setHoveredCluster(null)}
            onClick={() => onClusterClick?.(cluster.id)}
          >
            {/* Main cluster node */}
            <div 
              className="relative w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all duration-300"
              style={{
                background: `radial-gradient(circle, ${cluster.color}40 0%, ${cluster.color}20 100%)`,
                border: `2px solid ${cluster.color}`,
                boxShadow: isActive ? `0 0 30px ${cluster.color}80` : `0 0 15px ${cluster.color}40`,
              }}
            >
              <Icon className="w-7 h-7 mb-1" style={{ color: cluster.color }} />
              <span className="text-[10px] font-bold" style={{ color: cluster.color }}>
                {cluster.count}
              </span>
              
              {/* Pulse on hover */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: `2px solid ${cluster.color}` }}
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>

            {/* Label */}
            <p 
              className="text-center mt-2 font-semibold text-xs whitespace-nowrap"
              style={{ color: isActive ? cluster.color : 'rgb(203, 213, 225)' }}
            >
              {cluster.label}
            </p>

            {/* Memory nodes around cluster */}
            {isActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0"
              >
                {Array.from({ length: cluster.memoryNodes }).map((_, i) => {
                  const angle = (i / cluster.memoryNodes) * 2 * Math.PI;
                  const radius = 50;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  
                  return (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        left: '50%',
                        top: '50%',
                        background: cluster.color,
                        boxShadow: `0 0 8px ${cluster.color}`,
                      }}
                      initial={{ x: 0, y: 0, scale: 0 }}
                      animate={{ 
                        x, 
                        y,
                        scale: 1,
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.05,
                        opacity: {
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.1,
                        },
                      }}
                    />
                  );
                })}
              </motion.div>
            )}

            {/* Tooltip on hover */}
            {isActive && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-4 left-1/2 -translate-x-1/2 surface-elevated rounded-lg p-3 min-w-[160px] z-20 pointer-events-none"
                style={{
                  boxShadow: `0 4px 12px ${cluster.color}40`,
                }}
              >
                <p className="font-semibold text-sm mb-1" style={{ color: cluster.color }}>
                  {cluster.label}
                </p>
                <p className="text-xs text-secondary">
                  {cluster.count} memories stored
                </p>
                <p className="text-xs text-tertiary mt-1">
                  Click to explore
                </p>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
