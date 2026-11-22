'use client';

import React from 'react';

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

/**
 * Native scroll provider: replaces Lenis virtual scroll hijacking which
 * causes stuttering, touch-wheel acceleration jumps, or dialog scroll locks.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  return <>{children}</>;
}
