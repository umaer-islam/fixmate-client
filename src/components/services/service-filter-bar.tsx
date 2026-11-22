'use client';

import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search Input */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by issue, device model, or technician..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Service Mode Dropdown */}
        <div className="md:col-span-3">
          <select
            value={serviceMode}
            onChange={(e) => onServiceModeChange(e.target.value)}
            aria-label="Filter by Service Mode"
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary"
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
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filters */}
        <div className="md:col-span-1 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            title="Reset Filters"
            className="h-10 px-3 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
        {SERVICE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              category === cat
                ? 'bg-[#202522] text-[#F5F3EE] shadow-xs'
                : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
