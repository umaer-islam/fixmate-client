import React from 'react';
import Link from 'next/link';
import { LucideIcon, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = Wrench,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 p-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
        <Icon className="h-7 w-7 text-muted-foreground/70" />
      </div>
      <h3 className="text-base font-bold text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button size="sm" className="bg-[#F26A3D] hover:bg-[#F26A3D]/90 text-white font-semibold text-xs rounded-xl shadow-xs">
            {actionLabel}
          </Button>
        </Link>
      )}
      {actionLabel && !actionHref && onAction && (
        <Button
          size="sm"
          onClick={onAction}
          className="bg-[#F26A3D] hover:bg-[#F26A3D]/90 text-white font-semibold text-xs rounded-xl shadow-xs"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
