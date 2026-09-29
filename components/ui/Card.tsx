import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'ref' | 'children'> {
  variant?: 'primary' | 'secondary' | 'elevated';
  hover?: boolean;
  glow?: 'intelligence' | 'ai' | 'learning' | 'opportunity' | 'none';
  children?: React.ReactNode;
}

export default function Card({ 
  variant = 'primary', 
  hover = false, 
  glow = 'none',
  className = '', 
  children,
  ...props 
}: CardProps) {
  const variants = {
    primary: 'surface-primary',
    secondary: 'surface-secondary',
    elevated: 'surface-elevated',
  };
  
  const glows = {
    intelligence: 'glow-intelligence',
    ai: 'glow-ai',
    learning: 'glow-learning',
    opportunity: 'shadow-[0_0_20px_rgba(251,146,60,0.3)]',
    none: '',
  };
  
  const hoverClass = hover ? 'hover:bg-[rgb(var(--bg-elevated))]/70 cursor-pointer' : '';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={hover ? { y: -2 } : undefined}
      className={`rounded-xl p-6 ${variants[variant]} ${glows[glow]} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
