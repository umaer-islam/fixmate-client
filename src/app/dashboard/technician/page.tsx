'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { useAuth } from '@/providers/auth-provider';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/components/dashboard/stat-card';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function TechnicianOverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    totalServices: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadOverview = async () => {
      try {
        const [bookingsRes, servicesRes] = await Promise.allSettled([
          api.get<any[]>('/technician/bookings'),
          api.get<any[]>('/technician/services'),
        ]);

        const bookings: any[] = bookingsRes.status === 'fulfilled' && Array.isArray(bookingsRes.value.data) ? bookingsRes.value.data : [];
        const services: any[] = servicesRes.status === 'fulfilled' && Array.isArray(servicesRes.value.data) ? servicesRes.value.data : [];

        if (isMounted) {
          setStats({
            pending: bookings.filter((b) => b.status === 'requested').length,
            inProgress: bookings.filter((b) => ['accepted', 'in-progress'].includes(b.status)).length,
            completed: bookings.filter((b) => b.status === 'completed').length,
            totalServices: services.length,
          });
        }
      } catch (err) {
        console.error('Failed to load technician overview:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOverview();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardShell
      allowedRoles={['technician', 'admin']}
      title="Technician Command Center"
      description={`Welcome back, ${user?.name || 'Technician'}. Manage incoming repair tickets and catalogue offerings.`}
      action={
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/technician/bookings"
            className="px-4 py-2 bg-repair-orange hover:bg-repair-orange-dark text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            Open Job Queue
          </Link>
          <Link
            href="/dashboard/technician/services/new"
            className="px-4 py-2 bg-graphite hover:bg-graphite/90 text-white rounded-lg text-xs font-bold transition-colors"
          >
            + Create Service
          </Link>
        </div>
      }
    >
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Pending Requests"
          value={stats.pending}
          subtitle="Awaiting your response"
          icon={Clock}
          iconVariant="amber"
          valueClassName="text-amber-600"
          isLoading={isLoading}
        />
        <StatCard
          title="Jobs In Progress"
          value={stats.inProgress}
          subtitle="Underway / Accepted"
          icon={Wrench}
          iconVariant="orange"
          valueClassName="text-[#F26A3D]"
          isLoading={isLoading}
        />
        <StatCard
          title="Completed Repairs"
          value={stats.completed}
          subtitle="Successfully resolved"
          icon={CheckCircle2}
          iconVariant="emerald"
          valueClassName="text-emerald-600"
          isLoading={isLoading}
        />
        <StatCard
          title="Listed Services"
          value={stats.totalServices}
          subtitle="Active catalog offerings"
          icon={Layers}
          iconVariant="graphite"
          isLoading={isLoading}
        />
      </div>

      {/* Quick Action Banner */}
      <div className="bg-white rounded-2xl border border-graphite/10 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-extrabold text-graphite text-base">Service Lifecycle Workflow</h3>
          <p className="text-xs text-graphite-light max-w-xl">
            Respond quickly to customer requests to maintain high technician rating. Transition jobs from <strong>Accepted</strong> to <strong>In Progress</strong> once work begins, and specify the authoritative final price upon marking <strong>Completed</strong>.
          </p>
        </div>
        <Link
          href="/dashboard/technician/bookings"
          className="px-5 py-2.5 bg-graphite text-white rounded-xl text-xs font-bold hover:bg-graphite/90 transition-colors flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>View Job Queue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </DashboardShell>
  );
}
