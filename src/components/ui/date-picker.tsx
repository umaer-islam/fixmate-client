'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { BrandCalendar } from './calendar';
import { cn } from '@/lib/utils';

export interface BrandDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  minDate?: string; // YYYY-MM-DD
  maxDate?: string; // YYYY-MM-DD
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export function BrandDatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = 'Select appointment date',
  label,
  required,
  error,
  className,
  disabled = false,
}: BrandDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse YYYY-MM-DD string to local Date object
  const parseDateString = (dateStr?: string): Date | undefined => {
    if (!dateStr) return undefined;
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) return undefined;
    return new Date(year, month - 1, day);
  };

  const selectedDate = parseDateString(value);
  const parsedMinDate = parseDateString(minDate);
  const parsedMaxDate = parseDateString(maxDate);

  // Format date display
  const formatDisplay = (date?: Date): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectDate = (date: Date) => {
    // Format to YYYY-MM-DD with local padding
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    onChange(`${year}-${month}-${day}`);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative w-full space-y-1.5', className)}>
      {label && (
        <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
          {label} {required && <span className="text-[#F26A3D]">*</span>}
        </label>
      )}

      {/* Input Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'w-full h-10 px-3.5 flex items-center justify-between gap-2.5 rounded-xl border border-border bg-card text-xs sm:text-sm text-foreground transition-all shadow-xs cursor-pointer select-none text-left',
          'focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30 focus:border-[#F26A3D]',
          'disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/40',
          error && 'border-destructive focus:ring-destructive/20'
        )}
      >
        <span className="flex items-center gap-2.5 truncate">
          <CalendarIcon className="w-4 h-4 text-[#F26A3D] shrink-0" />
          <span className={cn('truncate', !value && 'text-muted-foreground font-normal')}>
            {value ? formatDisplay(selectedDate) : placeholder}
          </span>
        </span>

        {value && !required && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            title="Clear date"
            className="text-muted-foreground hover:text-foreground p-0.5 rounded-md hover:bg-muted cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </button>

      {/* Popover Calendar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 z-50 backdrop-blur-md"
          >
            <BrandCalendar
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              minDate={parsedMinDate}
              maxDate={parsedMaxDate}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="text-[11px] text-destructive font-medium">{error}</p>}
    </div>
  );
}
