'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/components/dashboard/stat-card';
import {
  Users,
  Wrench,
  Calendar,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Layers,
  AlertCircle,
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalCustomers: number;
  totalTechnicians: number;
  totalServices: number;
  pendingServices: number;
  totalBookings: number;
  activeBookings: number;
  totalRevenue: number;
  settledPaymentsCount: number;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const res = await api.get<AdminStats>('/admin/stats');
        if (isMounted && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardShell
      allowedRoles={['admin']}
      title="Platform Operations Console"
      description="Executive metrics across user registries, catalog moderation, bookings throughput, and Stripe financial settlement."
      action={
        <Link
          href="/dashboard/admin/services"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-repair-orange hover:bg-repair-orange-dark text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
        >
          <Layers className="w-4 h-4" />
          <span>Review Services Queue</span>
        </Link>
      }
    >
      {/* Metrics 4-Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Platform Users"
          value={stats?.totalUsers || 0}
          subtitle={`${stats?.totalTechnicians || 0} Techs • ${stats?.totalCustomers || 0} Customers`}
          icon={Users}
          iconVariant="blue"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Services"
          value={stats?.totalServices || 0}
          subtitle={`${stats?.pendingServices || 0} Awaiting Moderation`}
          icon={Wrench}
          iconVariant="amber"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Bookings"
          value={stats?.totalBookings || 0}
          subtitle={`${stats?.activeBookings || 0} Active / Underway`}
          icon={Calendar}
          iconVariant="orange"
          isLoading={isLoading}
        />
        <StatCard
          title="Stripe Gross Volume"
          value={`$${(stats?.totalRevenue || 0).toFixed(2)}`}
          subtitle={`${stats?.settledPaymentsCount || 0} Succeeded Invoices`}
          icon={DollarSign}
          iconVariant="emerald"
          valueClassName="text-emerald-700"
          isLoading={isLoading}
        />
      </div>

      {/* Navigation Quick Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          href="/dashboard/admin/services"
          className="bg-white rounded-2xl border border-graphite/10 p-6 shadow-xs hover:border-repair-orange transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-graphite text-base group-hover:text-repair-orange transition-colors">
            Service Moderation
          </h3>
          <p className="text-xs text-graphite-light mt-1 leading-relaxed">
            Review submitted technician services. Approve compliant repair offerings or return them with notes.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-repair-orange">
            <span>Moderate Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/dashboard/admin/users"
          className="bg-white rounded-2xl border border-graphite/10 p-6 shadow-xs hover:border-repair-orange transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-graphite text-base group-hover:text-repair-orange transition-colors">
            User Directory & Roles
          </h3>
          <p className="text-xs text-graphite-light mt-1 leading-relaxed">
            Inspect all registered accounts. Upgrade verified members to technician status or designate admin privileges.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-repair-orange">
            <span>Manage Users</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        <Link
          href="/dashboard/admin/payments"
          className="bg-white rounded-2xl border border-graphite/10 p-6 shadow-xs hover:border-repair-orange transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-graphite text-base group-hover:text-repair-orange transition-colors">
            Financial Audit Logs
          </h3>
          <p className="text-xs text-graphite-light mt-1 leading-relaxed">
            Inspect Stripe payment intents, completed checkout sessions, customer billing records, and transactions.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-repair-orange">
            <span>View Payments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>
      </div>
    </DashboardShell>
  );
}
