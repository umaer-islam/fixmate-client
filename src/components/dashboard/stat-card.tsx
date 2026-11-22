'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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
  valueClassName = 'text-graphite',
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-graphite/10 shadow-xs flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-xs font-bold text-graphite-light uppercase tracking-wider block">
          {title}
        </span>
        <div className={`text-3xl font-extrabold ${valueClassName} tracking-tight`}>
          {isLoading ? <Skeleton className="h-8 w-16 my-0.5" /> : value}
        </div>
        {subtitle && (
          <div className="text-xs text-graphite-light block">
            {subtitle}
          </div>
        )}
      </div>

      {Icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${variantStyles[iconVariant]}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
