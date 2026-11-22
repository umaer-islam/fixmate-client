'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonTapSpring } from '@/lib/motion/tokens';

export interface MotionButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'graphite' | 'outline' | 'ghost' | 'sage';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

const variants = {
  primary:
    'bg-[#F26A3D] text-white hover:bg-[#F26A3D]/90 shadow-xs focus-visible:ring-[#F26A3D]/40',
  graphite:
    'bg-[#202522] text-[#F5F3EE] hover:bg-[#202522]/90 shadow-xs focus-visible:ring-[#202522]/40',
  outline:
    'border border-border bg-card text-foreground hover:bg-muted/70 hover:text-foreground focus-visible:ring-foreground/20',
  ghost:
    'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-foreground/20',
  sage:
    'bg-[#DCE8DE] text-[#202522] hover:bg-[#DCE8DE]/80 shadow-xs focus-visible:ring-[#DCE8DE]/60',
};

const sizes = {
  sm: 'h-9 px-3.5 text-xs rounded-xl font-semibold',
  md: 'h-10 px-5 text-xs sm:text-sm rounded-xl font-bold',
  lg: 'h-12 px-6 text-sm sm:text-base rounded-2xl font-bold',
};

export const MotionButton = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={disabled || isLoading ? undefined : { scale: 1.015 }}
        whileTap={disabled || isLoading ? undefined : buttonTapSpring}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
        {children}
      </motion.button>
    );
  }
);

MotionButton.displayName = 'MotionButton';
