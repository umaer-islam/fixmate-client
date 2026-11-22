'use client';

import React from 'react';
import { Clock, ShieldCheck, Wrench, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export type BookingStatus = 'requested' | 'accepted' | 'in-progress' | 'completed' | 'cancelled' | 'rejected';

export interface BookingTimelineProps {
  status: BookingStatus;
  paymentStatus?: 'paid' | 'unpaid';
  className?: string;
}

const STEPS = [
  { key: 'requested', label: 'Requested', icon: Clock, desc: 'Awaiting tech review' },
  { key: 'accepted', label: 'Accepted', icon: ShieldCheck, desc: 'Technician confirmed' },
  { key: 'in-progress', label: 'In Progress', icon: Wrench, desc: 'Repair underway' },
  { key: 'completed', label: 'Completed', icon: CheckCircle2, desc: 'Inspected & tested' },
];

export function BookingTimeline({ status, paymentStatus, className = '' }: BookingTimelineProps) {
  // If cancelled or rejected
  if (status === 'cancelled' || status === 'rejected') {
    const isCancelled = status === 'cancelled';
    return (
      <div className={`rounded-xl p-3.5 flex items-center gap-3 border ${
        isCancelled
          ? 'bg-muted/40 border-border text-muted-foreground'
          : 'bg-red-500/10 border-red-500/20 text-red-600'
      } ${className}`}>
        {isCancelled ? (
          <XCircle className="h-5 w-5 shrink-0 text-muted-foreground" />
        ) : (
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />
        )}
        <div className="text-xs">
          <p className="font-bold">
            {isCancelled ? 'Booking Cancelled by Customer' : 'Booking Declined by Technician'}
          </p>
          <p className="text-[11px] opacity-80 mt-0.5">
            {isCancelled
              ? 'This repair request was withdrawn. You may book another service at any time.'
              : 'The technician is unavailable for this timeslot. Please select another certified tech.'}
          </p>
        </div>
      </div>
    );
  }

  const stepOrder: Record<string, number> = {
    requested: 1,
    accepted: 2,
    'in-progress': 3,
    completed: 4,
  };

  const currentStep = stepOrder[status] || 1;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="grid grid-cols-4 gap-2 relative">
        {STEPS.map((s, index) => {
          const stepNumber = index + 1;
          const isDone = currentStep > stepNumber || (currentStep === stepNumber && status === 'completed');
          const isCurrent = currentStep === stepNumber && status !== 'completed';
          const Icon = s.icon;

          return (
            <div key={s.key} className="flex flex-col items-center text-center relative">
              {/* Connector line behind icons */}
              {index < STEPS.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-0.5 -z-0 transition-colors ${
                    currentStep > stepNumber ? 'bg-emerald-500' : 'bg-muted'
                  }`}
                />
              )}

              {/* Icon circle */}
              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all shadow-xs ${
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-[#F26A3D] text-white ring-4 ring-[#F26A3D]/20 animate-pulse'
                    : 'bg-muted text-muted-foreground border border-border'
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>

              {/* Text labels */}
              <span
                className={`mt-2 text-xs font-bold transition-colors ${
                  isCurrent
                    ? 'text-[#F26A3D]'
                    : isDone
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {s.label}
              </span>
              <span className="hidden sm:block text-[10px] text-muted-foreground mt-0.5">
                {s.desc}
              </span>
            </div>
          );
        })}
      </div>

      {status === 'completed' && paymentStatus && (
        <div className={`text-center text-[11px] font-semibold py-1 px-3 rounded-lg ${
          paymentStatus === 'paid'
            ? 'bg-emerald-500/10 text-emerald-700'
            : 'bg-amber-500/10 text-amber-700'
        }`}>
          {paymentStatus === 'paid'
            ? '✓ Payment settled via Stripe — 90-Day Repair Warranty Active'
            : '⚠ Repair completed — Awaiting Stripe payment from customer'}
        </div>
      )}
    </div>
  );
}
