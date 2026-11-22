'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Search, RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motionSprings, buttonTapSpring } from '@/lib/motion/tokens';

export const SERVICE_CATEGORIES = [
  'All',
  'Smartphone',
  'Laptop & PC',
  'AC',
  'Refrigerator',
  'TV',
  'Washing Machine',
  'Electrical',
];

export const SERVICE_MODES = [
  { value: '', label: 'All Modes' },
  { value: 'Home Visit', label: 'Home Visit' },
  { value: 'Shop Drop-off', label: 'Shop Drop-off' },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

interface ServiceFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  serviceMode: string;
  onServiceModeChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  onReset: () => void;
}

export function ServiceFilterBar({
  search,
  onSearchChange,
  serviceMode,
  onServiceModeChange,
  sort,
  onSortChange,
  category,
  onCategoryChange,
  onReset,
}: ServiceFilterBarProps) {
  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search Input with Clear Button */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by issue, device model, or technician..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-9 rounded-xl border-border bg-background focus:ring-[#F26A3D]/30"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground cursor-pointer"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Service Mode Dropdown */}
        <div className="md:col-span-3">
          <select
            value={serviceMode}
            onChange={(e) => onServiceModeChange(e.target.value)}
            aria-label="Filter by Service Mode"
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs sm:text-sm font-medium ring-offset-background focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/40 cursor-pointer"
          >
            {SERVICE_MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="md:col-span-3">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort Services"
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs sm:text-sm font-medium ring-offset-background focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/40 cursor-pointer"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filters Button */}
        <div className="md:col-span-1 flex justify-end">
          <motion.button
            whileHover={{ rotate: -180, scale: 1.05 }}
            whileTap={buttonTapSpring}
            onClick={onReset}
            title="Reset Filters"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Category Filter Pills with Animated Active Background */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
        {SERVICE_CATEGORIES.map((cat) => {
          const isActive = category === cat;
          return (
            <motion.button
              key={cat}
              whileTap={buttonTapSpring}
              onClick={() => onCategoryChange(cat)}
              className="relative px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer select-none"
            >
              {isActive && (
                <motion.div
                  layoutId="category-filter-pill"
                  transition={motionSprings.snappy}
                  className="absolute inset-0 bg-[#202522] rounded-xl shadow-xs"
                />
              )}
              <span
                className={`relative z-10 ${
                  isActive
                    ? 'text-[#F5F3EE]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/70 rounded-xl px-2 py-1'
                }`}
              >
                {cat}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
