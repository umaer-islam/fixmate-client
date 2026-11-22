'use client';

import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type PaymentBadgeStatus = 'paid' | 'unpaid' | 'succeeded' | 'failed' | 'pending' | 'refunded' | string;

export interface PaymentBadgeProps {
  status: PaymentBadgeStatus;
  className?: string;
}

export function PaymentBadge({ status, className = '' }: PaymentBadgeProps) {
  const normalized = (status || '').toLowerCase();

  switch (normalized) {
    case 'paid':
    case 'succeeded':
      return (
        <Badge
          variant="success"
          className={`inline-flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider ${className}`}
        >
          <CheckCircle2 className="h-3 w-3" />
          <span>Paid</span>
        </Badge>
      );

    case 'unpaid':
      return (
        <Badge
          variant="warning"
          className={`inline-flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider ${className}`}
        >
          <Clock className="h-3 w-3" />
          <span>Unpaid</span>
        </Badge>
      );

    case 'pending':
      return (
        <Badge
          variant="info"
          className={`inline-flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider ${className}`}
        >
          <RefreshCw className="h-3 w-3 animate-spin" />
          <span>Processing</span>
        </Badge>
      );

    case 'failed':
      return (
        <Badge
          variant="danger"
          className={`inline-flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider ${className}`}
        >
          <XCircle className="h-3 w-3" />
          <span>Failed</span>
        </Badge>
      );

    case 'refunded':
      return (
        <Badge
          variant="default"
          className={`inline-flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider ${className}`}
        >
          <AlertCircle className="h-3 w-3" />
          <span>Refunded</span>
        </Badge>
      );

    default:
      return (
        <Badge variant="default" className={`capitalize text-[10px] ${className}`}>
          {status}
        </Badge>
      );
  }
}
