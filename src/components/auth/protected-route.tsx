'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, UserRole } from '@/providers/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, role, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast.error('Authentication required', {
          description: 'Please sign in to access this page.',
        });
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      if (allowedRoles && role && !allowedRoles.includes(role)) {
        toast.error('Unauthorized access', {
          description: `Access restricted to ${allowedRoles.join(', ')} accounts.`,
        });
        if (role === 'admin') router.push('/dashboard/admin');
        else if (role === 'technician') router.push('/dashboard/technician');
        else router.push('/dashboard/customer');
      }
    }
  }, [isLoading, isAuthenticated, role, allowedRoles, router, pathname]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl p-8 space-y-6 animate-pulse">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
