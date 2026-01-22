import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glow';
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const baseStyles = 'relative rounded-2xl backdrop-blur-xl border transition-all duration-300';

    const variants = {
      default: 'bg-white/[0.02] border-white/[0.08] hover:border-white/[0.12]',
      glow: 'bg-primary/[0.02] border-primary/20 shadow-[0_0_40px_rgba(0,255,0,0.1)] hover:shadow-[0_0_60px_rgba(0,255,0,0.15)] hover:border-primary/30',
    };

    return (
      <div ref={ref} className={cn(baseStyles, variants[variant], className)} {...props}>
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
