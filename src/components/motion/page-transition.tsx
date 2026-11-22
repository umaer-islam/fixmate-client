'use client';

import React from 'react';
import { motion } from 'motion/react';
import { motionDurations, motionEasings } from '@/lib/motion/tokens';

export interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: motionDurations.normal,
        ease: motionEasings.workshop,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
