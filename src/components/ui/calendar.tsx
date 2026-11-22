'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BrandCalendarProps {
  selectedDate?: Date | null;
  onSelectDate: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function BrandCalendar({
  selectedDate,
  onSelectDate,
  minDate,
  maxDate,
  className,
}: BrandCalendarProps) {
  // Use selected date or today as view month
  const initialDate = selectedDate || new Date();
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Calendar math
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const today = new Date();
  const isToday = (day: number) =>
    today.getDate() === day &&
    today.getMonth() === currentMonth &&
    today.getFullYear() === currentYear;

  const isSelected = (day: number) =>
    selectedDate &&
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === currentMonth &&
    selectedDate.getFullYear() === currentYear;

  const isDisabled = (day: number) => {
    const checkDate = new Date(currentYear, currentMonth, day);
    if (minDate) {
      const minDateMidnight = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
      if (checkDate < minDateMidnight) return true;
    }
    if (maxDate) {
      const maxDateMidnight = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 23, 59, 59);
      if (checkDate > maxDateMidnight) return true;
    }
    return false;
  };

  const days: React.ReactNode[] = [];

  // Empty cells for days before the 1st
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
  }

  // Days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const disabled = isDisabled(day);
    const selected = isSelected(day);
    const todayFlag = isToday(day);

    days.push(
      <button
        key={`day-${day}`}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            onSelectDate(new Date(currentYear, currentMonth, day));
          }
        }}
        className={cn(
          'h-8 w-8 rounded-xl text-xs font-semibold flex items-center justify-center transition-all cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/40',
          selected && 'bg-[#F26A3D] text-white font-bold shadow-xs hover:bg-[#F26A3D]',
          !selected && todayFlag && 'border border-[#202522]/30 font-bold text-foreground bg-muted/30',
          !selected && !todayFlag && !disabled && 'text-foreground hover:bg-muted/80',
          disabled && 'text-muted-foreground/40 cursor-not-allowed hover:bg-transparent'
        )}
      >
        {day}
      </button>
    );
  }

  return (
    <div className={cn('p-3 bg-card rounded-2xl border border-border select-none shadow-sm w-[280px]', className)}>
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-border/70">
        <h4 className="text-xs font-bold text-foreground tracking-tight">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </h4>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Previous month"
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next month"
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day of Week Headers */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {DAY_NAMES.map((name) => (
          <div key={name} className="h-6 w-8 text-[10px] font-bold uppercase text-muted-foreground flex items-center justify-center">
            {name}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 place-items-center">
        {days}
      </div>
    </div>
  );
}
