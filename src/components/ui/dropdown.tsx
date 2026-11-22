'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface BrandSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  size?: 'sm' | 'default' | 'lg';
  icon?: React.ReactNode;
  'aria-label'?: string;
}

const sizeClasses = {
  sm: 'h-8 px-3 text-xs rounded-xl',
  default: 'h-10 px-3.5 text-xs sm:text-sm rounded-xl',
  lg: 'h-12 px-4 text-sm sm:text-base rounded-2xl',
};

export function BrandSelect({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  label,
  error,
  disabled = false,
  className,
  triggerClassName,
  menuClassName,
  size = 'default',
  icon,
  'aria-label': ariaLabel,
}: BrandSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (optValue: string, isDisabled?: boolean) => {
    if (isDisabled || disabled) return;
    onChange(optValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative w-full space-y-1.5', className)}>
      {label && (
        <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={ariaLabel || label || placeholder}
        aria-expanded={isOpen}
        className={cn(
          'w-full flex items-center justify-between gap-2 bg-card border border-border text-foreground transition-all select-none shadow-xs text-left cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30 focus:border-[#F26A3D]',
          'disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/40',
          sizeClasses[size],
          error && 'border-destructive focus:ring-destructive/20',
          triggerClassName
        )}
      >
        <span className="flex items-center gap-2 truncate">
          {icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span className={cn('truncate', !selectedOption && 'text-muted-foreground font-normal')}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>

        <ChevronDown
          className={cn(
            'w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180 text-foreground'
          )}
        />
      </button>

      {/* Popover Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'absolute left-0 right-0 z-50 min-w-[180px] bg-card border border-border/80 rounded-2xl p-1.5 shadow-xl max-h-60 overflow-y-auto',
              'backdrop-blur-md focus:outline-none',
              menuClassName
            )}
          >
            {options.length === 0 ? (
              <div className="px-3 py-2 text-xs text-muted-foreground text-center">
                No options available
              </div>
            ) : (
              options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => handleSelect(opt.value, opt.disabled)}
                    className={cn(
                      'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors text-left select-none cursor-pointer',
                      isSelected
                        ? 'bg-[#F26A3D]/10 text-[#F26A3D] font-bold'
                        : 'text-foreground hover:bg-muted/80',
                      opt.disabled && 'opacity-40 cursor-not-allowed'
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                      <div>
                        <div className="truncate">{opt.label}</div>
                        {opt.description && (
                          <div className="text-[11px] font-normal text-muted-foreground truncate">
                            {opt.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#F26A3D] shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="text-[11px] text-destructive font-medium">{error}</p>}
    </div>
  );
}
