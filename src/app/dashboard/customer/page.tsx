'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '@/lib/api-client';
import { useAuth } from '@/providers/auth-provider';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/components/dashboard/stat-card';
import { MotionButton } from '@/components/motion/motion-button';
import {
  Calendar,
  Clock,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  AlertCircle,
  Wrench,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface Booking {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceCategory: string;
  serviceImage?: string;
  status: 'requested' | 'accepted' | 'rejected' | 'in-progress' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid';
  basePrice: number;
  finalAmount?: number;
  preferredDate: string;
  createdAt: string;
}

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchBookings = async () => {
      try {
        const res = await api.get<Booking[]>('/bookings/my');
        if (isMounted) {
          setBookings(res.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchBookings();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeBookings = bookings.filter((b) =>
    ['requested', 'accepted', 'in-progress'].includes(b.status)
  );
  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const totalSpent = completedBookings
    .filter((b) => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + (b.finalAmount || b.basePrice || 0), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'requested':
        return <Badge variant="warning">Requested</Badge>;
      case 'accepted':
        return <Badge variant="info">Accepted</Badge>;
      case 'in-progress':
        return <Badge variant="primary">In Progress</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="default">Cancelled</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <DashboardShell
      allowedRoles={['customer', 'technician', 'admin']}
      title={`Welcome back, ${user?.name || 'Customer'}`}
      description="Manage your ongoing device repairs, track technician schedules, and review receipts."
      action={
        <Link href="/services">
          <MotionButton variant="primary" size="sm">
            <Wrench className="w-4 h-4" />
            <span>Book New Repair</span>
          </MotionButton>
        </Link>
      }
    >
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Active Repairs"
          value={activeBookings.length}
          subtitle="In queue or underway"
          icon={Clock}
          iconVariant="amber"
          isLoading={isLoading}
        />
        <StatCard
          title="Completed Jobs"
          value={completedBookings.length}
          subtitle="Successfully resolved"
          icon={CheckCircle2}
          iconVariant="emerald"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Spent"
          value={`$${totalSpent.toFixed(2)}`}
          subtitle="Paid via Stripe"
          icon={DollarSign}
          iconVariant="orange"
          isLoading={isLoading}
        />
      </div>

      {/* Recent Repairs Table / Card */}
      <div className="bg-card rounded-3xl border border-border/80 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-border/70 flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-[#202522] text-base tracking-tight">Recent Repair Requests</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Your latest service orders and live statuses</p>
          </div>
          <Link
            href="/dashboard/customer/bookings"
            className="text-xs font-bold text-[#F26A3D] hover:text-[#F26A3D]/80 flex items-center gap-1 transition-colors group"
          >
            <span>View All ({bookings.length})</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-muted/70 flex items-center justify-center mx-auto text-muted-foreground">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">No Repair Requests Yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 leading-relaxed">
                You haven&apos;t booked any repair services yet. Find a certified technician to fix your device today.
              </p>
            </div>
            <Link href="/services" className="inline-block pt-1">
              <MotionButton variant="primary" size="sm">
                <Wrench className="w-4 h-4" />
                <span>Browse Catalog</span>
              </MotionButton>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border/70">
            {bookings.slice(0, 5).map((booking) => (
              <motion.div
                key={booking._id}
                whileHover={{ backgroundColor: 'rgba(245, 243, 238, 0.4)' }}
                className="p-5 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                    {booking.serviceImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={booking.serviceImage}
                        alt={booking.serviceTitle}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Wrench className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="font-extrabold text-[#202522] text-sm tracking-tight hover:text-[#F26A3D] transition-colors">
                      <Link href={`/dashboard/customer/bookings/${booking._id}`}>
                        {booking.serviceTitle}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium">{booking.serviceCategory}</span>
                      <span className="text-border">•</span>
                      <span>
                        Preferred: {new Date(booking.preferredDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                  <div className="text-right">
                    <span className="font-black text-[#202522] text-base block">
                      ${((booking.finalAmount ?? booking.basePrice) || 0).toFixed(2)}
                    </span>
                    <span className="text-[11px] text-muted-foreground capitalize font-medium">
                      {booking.paymentStatus}
                    </span>
                  </div>

                  <div>{getStatusBadge(booking.status)}</div>

                  <Link
                    href={`/dashboard/customer/bookings/${booking._id}`}
                    className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
