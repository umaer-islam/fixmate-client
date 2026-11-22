'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { motionDurations, motionEasings } from '@/lib/motion/tokens';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

export function SplitText({
  text,
  className = '',
  delay = 0.05,
  stagger = 0.04,
}: SplitTextProps) {
  const words = text.split(' ');

  return (
    <span className={cn('inline-block', className)}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.28em]">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: motionDurations.slow,
              ease: motionEasings.workshop,
              delay: delay + wordIndex * stagger,
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
