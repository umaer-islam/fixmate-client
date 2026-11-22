'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { motionDurations, motionEasings } from '@/lib/motion/tokens';

export interface StaggerListProps extends HTMLMotionProps<'div'> {
  staggerDelay?: number;
  initialDelay?: number;
  children: React.ReactNode;
}

export function StaggerList({
  staggerDelay = 0.08,
  initialDelay = 0.04,
  children,
  className,
  ...props
}: StaggerListProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: initialDelay,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  ...props
}: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: motionDurations.normal,
            ease: motionEasings.workshop,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
