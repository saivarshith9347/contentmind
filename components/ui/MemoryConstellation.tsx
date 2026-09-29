'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Brain, Users, FileText, TrendingUp, MessageSquare, Tag, Layout } from 'lucide-react';

interface Node {
  id: string;
  label: string;
  icon: any;
  x: number;
  y: number;
  count: number;
  recent: string;
  color: string;
}

const nodes: Node[] = [
  { id: 'brand', label: 'Brand', icon: Brain, x: 50, y: 30, count: 45, recent: 'ContentMind positioning', color: 'rgb(168, 85, 247)' },
  { id: 'audience', label: 'Audience', icon: Users, x: 30, y: 60, count: 89, recent: 'Developer preferences', color: 'rgb(59, 130, 246)' },
  { id: 'content', label: 'Content', icon: FileText, x: 70, y: 60, count: 112, recent: 'Tutorial performance', color: 'rgb(34, 197, 94)' },
  { id: 'performance', label: 'Performance', icon: TrendingUp, x: 20, y: 80, count: 67, recent: '10.6% engagement peak', color: 'rgb(251, 146, 60)' },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare, x: 50, y: 85, count: 22, recent: 'Practical tutorials preferred', color: 'rgb(168, 85, 247)' },
  { id: 'topics', label: 'Topics', icon: Tag, x: 80, y: 80, count: 156, recent: 'DevOps gap detected', color: 'rgb(59, 130, 246)' },
  { id: 'formats', label: 'Formats', icon: Layout, x: 50, y: 50, count: 34, recent: 'Tutorial format wins', color: 'rgb(34, 197, 94)' },
];

const connections = [
  { from: 'brand', to: 'audience' },
  { from: 'brand', to: 'content' },
  { from: 'audience', to: 'feedback' },
  { from: 'audience', to: 'performance' },
  { from: 'content', to: 'formats' },
  { from: 'content', to: 'topics' },
  { from: 'performance', to: 'feedback' },
  { from: 'topics', to: 'formats' },
  { from: 'formats', to: 'brand' },
];

export default function MemoryConstellation() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const getNodePosition = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  return (
    <div className="relative w-full h-[400px] surface-primary rounded-2xl overflow-hidden">
      <svg className="absolute inset-0 w-full h-full">
        {/* Connection lines */}
        {connections.map((conn, i) => {
          const from = getNodePosition(conn.from);
          const to = getNodePosition(conn.to);
          const isActive = hoveredNode === conn.from || hoveredNode === conn.to;
          
          return (
            <motion.line
              key={i}
              x1={`${from.x}%`}
              y1={`${from.y}%`}
              x2={`${to.x}%`}
              y2={`${to.y}%`}
              stroke="rgba(168, 85, 247, 0.2)"
              strokeWidth={isActive ? "2" : "1"}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: isActive ? 0.6 : 0.2,
                stroke: isActive ? "rgba(168, 85, 247, 0.6)" : "rgba(148, 163, 184, 0.2)"
              }}
              transition={{ duration: 1, delay: i * 0.1 }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node, index) => {
        const Icon = node.icon;
        const isHovered = hoveredNode === node.id;
        const isSelected = selectedNode === node.id;
        
        return (
          <motion.div
            key={node.id}
            className="absolute cursor-pointer"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              x: [0, Math.sin(index) * 3, 0],
              y: [0, Math.cos(index) * 3, 0],
            }}
            transition={{
              scale: { duration: 0.5, delay: index * 0.1 },
              opacity: { duration: 0.5, delay: index * 0.1 },
              x: { duration: 4 + index, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: 5 + index, repeat: Infinity, ease: 'easeInOut' },
            }}
            whileHover={{ scale: 1.2 }}
            onHoverStart={() => setHoveredNode(node.id)}
            onHoverEnd={() => setHoveredNode(null)}
            onClick={() => setSelectedNode(isSelected ? null : node.id)}
          >
            {/* Node */}
            <div 
              className="relative w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: `radial-gradient(circle, ${node.color}40 0%, ${node.color}20 100%)`,
                border: `2px solid ${node.color}`,
                boxShadow: isHovered ? `0 0 30px ${node.color}60` : `0 0 15px ${node.color}30`,
              }}
            >
              <Icon className="w-6 h-6" style={{ color: node.color }} />
              
              {/* Pulse ring on hover */}
              {isHovered && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: `2px solid ${node.color}` }}
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>

            {/* Tooltip on hover */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-3 left-1/2 -translate-x-1/2 surface-elevated rounded-lg p-3 min-w-[180px] z-10"
              >
                <p className="text-primary font-semibold text-sm mb-1">{node.label}</p>
                <p className="text-intelligence text-xs mb-1">{node.count} memories</p>
                <p className="text-tertiary text-xs">{node.recent}</p>
              </motion.div>
            )}

            {/* Expanded info on click */}
            {isSelected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-full mt-3 left-1/2 -translate-x-1/2 surface-elevated rounded-xl p-4 min-w-[220px] z-20 glow-intelligence"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-5 h-5 text-intelligence" />
                  <p className="text-primary font-bold">{node.label}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-secondary">Memories:</span>
                    <span className="text-intelligence font-semibold">{node.count}</span>
                  </div>
                  <div className="border-t border-[rgb(var(--border-subtle))] pt-2">
                    <p className="text-tertiary text-xs mb-1">Recent learning:</p>
                    <p className="text-secondary text-xs">{node.recent}</p>
                  </div>
                  <button className="w-full mt-2 px-3 py-1.5 bg-gradient-to-r from-[rgb(var(--accent-intelligence-dim))] to-[rgb(var(--accent-intelligence))] text-white text-xs rounded-lg hover:opacity-90 transition-opacity">
                    Explore {node.label}
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
