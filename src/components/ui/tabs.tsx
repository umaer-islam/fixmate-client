'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface TabItem {
  key: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface BrandTabsProps {
  tabs: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
  size?: 'sm' | 'default';
}

export function BrandTabs({
  tabs,
  activeKey,
  onChange,
  className,
  size = 'default',
}: BrandTabsProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 p-1 bg-muted/60 border border-border/80 rounded-2xl select-none',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={cn(
              'relative inline-flex items-center gap-2 rounded-xl font-bold transition-colors select-none cursor-pointer',
              size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-xs sm:text-sm',
              isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-brand-tab"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="absolute inset-0 bg-card rounded-xl border border-border shadow-xs"
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={cn(
                    'text-[10px] font-bold px-1.5 py-0.2 rounded-full',
                    isActive
                      ? 'bg-[#F26A3D]/10 text-[#F26A3D]'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
