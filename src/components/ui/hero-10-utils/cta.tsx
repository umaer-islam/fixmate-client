'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CtaProps {
  ctaEnabled?: boolean;
  text: string;
  link?: string;
  variant?: 'default' | 'primary' | 'graphite' | 'sage' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'xs' | 'lg' | 'icon';
  className?: string;
}

export function Cta({ cta }: { cta: CtaProps }) {
  if (!cta?.ctaEnabled) return null;

  const content = (
    <Button
      variant={cta.variant || 'default'}
      size={cta.size || 'default'}
      className={cn('font-bold shadow-xs', cta.className)}
    >
      <span>{cta.text}</span>
      {(cta.variant === 'default' || cta.variant === 'primary') && (
        <ArrowRight className="h-4 w-4 ml-1.5" />
      )}
    </Button>
  );

  if (cta.link) {
    return (
      <Link href={cta.link} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}
