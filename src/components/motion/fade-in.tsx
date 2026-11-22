'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { motionDurations, motionEasings } from '@/lib/motion/tokens';

export interface FadeInProps extends HTMLMotionProps<'div'> {
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  distance?: number;
  children: React.ReactNode;
}

export function FadeIn({
  direction = 'up',
  delay = 0,
  duration = motionDurations.normal,
  distance = 18,
  children,
  className,
  ...props
}: FadeInProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, x: 0 };
      case 'down':
        return { y: -distance, x: 0 };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...getInitialPosition() }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration,
        delay,
        ease: motionEasings.workshop,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
