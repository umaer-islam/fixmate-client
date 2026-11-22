'use client';

import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedCounter } from '@/components/motion/animated-counter';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: React.ReactNode;
  icon?: LucideIcon;
  iconVariant?: 'orange' | 'amber' | 'emerald' | 'blue' | 'graphite';
  isLoading?: boolean;
  valueClassName?: string;
}

const variantStyles = {
  orange: 'bg-[#F26A3D]/10 text-[#F26A3D]',
  amber: 'bg-amber-500/10 text-amber-600',
  emerald: 'bg-emerald-500/10 text-emerald-600',
  blue: 'bg-blue-500/10 text-blue-600',
  graphite: 'bg-[#202522]/10 text-[#202522]',
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconVariant = 'orange',
  isLoading = false,
  valueClassName = 'text-[#202522]',
}: StatCardProps) {
  // Check if value is a formatted dollar amount, e.g. "$120.00"
  let parsedNumber: number | null = null;
  let prefix = '';
  let decimals = 0;

  if (typeof value === 'number') {
    parsedNumber = value;
  } else if (typeof value === 'string') {
    if (value.startsWith('$')) {
      prefix = '$';
      const clean = value.replace('$', '').trim();
      const num = parseFloat(clean);
      if (!isNaN(num)) {
        parsedNumber = num;
        decimals = clean.includes('.') ? 2 : 0;
      }
    } else {
      const num = parseFloat(value);
      if (!isNaN(num) && String(num) === value.trim()) {
        parsedNumber = num;
      }
    }
  }

  return (
    <motion.div
      whileHover={{ y: -3, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
      className="bg-card rounded-3xl p-5 border border-border/80 shadow-xs flex items-center justify-between"
    >
      <div className="space-y-1">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
          {title}
        </span>
        <div className={`text-3xl font-extrabold ${valueClassName} tracking-tight font-mono`}>
          {isLoading ? (
            <Skeleton className="h-8 w-16 my-0.5 rounded-lg" />
          ) : parsedNumber !== null ? (
            <AnimatedCounter value={parsedNumber} prefix={prefix} decimals={decimals} />
          ) : (
            value
          )}
        </div>
        {subtitle && (
          <div className="text-xs text-muted-foreground block font-medium">
            {subtitle}
          </div>
        )}
      </div>

      {Icon && (
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${variantStyles[iconVariant]}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </motion.div>
  );
}
