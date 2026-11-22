'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { api } from '@/lib/api-client';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { StatCard } from '@/components/dashboard/stat-card';
import { SpotlightCard } from '@/components/motion/spotlight-card';
import { MotionButton } from '@/components/motion/motion-button';
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
  FileText,
  Sparkles,
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
        <Link href="/dashboard/admin/services">
          <MotionButton variant="primary" size="sm">
            <Layers className="w-4 h-4" />
            <span>Review Services Queue</span>
          </MotionButton>
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

      {/* Navigation Quick Panels with Spotlight Sheen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link href="/dashboard/admin/services" className="block">
          <SpotlightCard className="h-full p-6 space-y-3 group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-2 group-hover:scale-105 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-[#202522] text-base group-hover:text-[#F26A3D] transition-colors tracking-tight">
              Service Moderation
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Review submitted technician services. Approve compliant repair offerings or return them with actionable feedback.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-[#F26A3D]">
              <span>Moderate Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </SpotlightCard>
        </Link>

        <Link href="/dashboard/admin/users" className="block">
          <SpotlightCard className="h-full p-6 space-y-3 group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-2 group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-[#202522] text-base group-hover:text-[#F26A3D] transition-colors tracking-tight">
              User Directory & Roles
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Inspect all registered accounts. Upgrade verified members to technician status or designate admin privileges.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-[#F26A3D]">
              <span>Manage Users</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </SpotlightCard>
        </Link>

        <Link href="/dashboard/admin/payments" className="block">
          <SpotlightCard className="h-full p-6 space-y-3 group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-2 group-hover:scale-105 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-[#202522] text-base group-hover:text-[#F26A3D] transition-colors tracking-tight">
              Financial Audit Logs
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Inspect Stripe payment intents, completed checkout sessions, customer billing records, and audit receipts.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-[#F26A3D]">
              <span>View Payments</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </SpotlightCard>
        </Link>
      </div>
    </DashboardShell>
  );
}
