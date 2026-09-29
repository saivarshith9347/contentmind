import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref' | 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'intelligence' | 'ai' | 'learning';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, children, className = '', disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'surface-elevated text-primary hover:bg-[rgb(var(--bg-elevated))]/80',
      secondary: 'surface-secondary text-secondary hover:bg-[rgb(var(--bg-tertiary))]/60',
      ghost: 'hover:bg-[rgb(var(--bg-tertiary))]/30 text-secondary',
      intelligence: 'bg-gradient-to-r from-[rgb(var(--accent-intelligence-dim))] to-[rgb(var(--accent-intelligence))] text-white hover:opacity-90 glow-intelligence',
      ai: 'bg-gradient-to-r from-[rgb(var(--accent-ai-dim))] to-[rgb(var(--accent-ai))] text-white hover:opacity-90 glow-ai',
      learning: 'bg-gradient-to-r from-[rgb(var(--accent-learning-dim))] to-[rgb(var(--accent-learning))] text-white hover:opacity-90 glow-learning',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm rounded-lg',
      md: 'px-4 py-2 text-base rounded-lg',
      lg: 'px-6 py-3 text-lg rounded-xl',
    };
    
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : icon ? (
          icon
        ) : null}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
