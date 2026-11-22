'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { useAuth } from '@/providers/auth-provider';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Calendar,
  Clock,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  AlertCircle,
  Wrench,
  ChevronRight,
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
        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-4 py-2 bg-repair-orange hover:bg-repair-orange-dark text-white rounded-lg text-sm font-semibold transition-colors shadow-xs"
        >
          <Wrench className="w-4 h-4" />
          <span>Book New Repair</span>
        </Link>
      }
    >
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-graphite/10 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-graphite-light uppercase tracking-wider block">
              Active Repairs
            </span>
            <span className="text-3xl font-extrabold text-graphite mt-1 block">
              {isLoading ? <Skeleton className="h-8 w-12" /> : activeBookings.length}
            </span>
            <span className="text-xs text-graphite-light mt-1 block">In queue or underway</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-graphite/10 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-graphite-light uppercase tracking-wider block">
              Completed Jobs
            </span>
            <span className="text-3xl font-extrabold text-graphite mt-1 block">
              {isLoading ? <Skeleton className="h-8 w-12" /> : completedBookings.length}
            </span>
            <span className="text-xs text-graphite-light mt-1 block">Successfully resolved</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-graphite/10 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-graphite-light uppercase tracking-wider block">
              Total Spent
            </span>
            <span className="text-3xl font-extrabold text-graphite mt-1 block">
              {isLoading ? <Skeleton className="h-8 w-16" /> : `$${totalSpent.toFixed(2)}`}
            </span>
            <span className="text-xs text-graphite-light mt-1 block">Paid via Stripe</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-repair-orange/10 flex items-center justify-center text-repair-orange">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Repairs Table / Card */}
      <div className="bg-white rounded-2xl border border-graphite/10 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-graphite/10 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-graphite text-base">Recent Repair Requests</h2>
            <p className="text-xs text-graphite-light mt-0.5">Your latest service orders and statuses</p>
          </div>
          <Link
            href="/dashboard/customer/bookings"
            className="text-xs font-bold text-repair-orange hover:text-repair-orange-dark flex items-center gap-1 transition-colors"
          >
            <span>View All ({bookings.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-ivory flex items-center justify-center mx-auto text-graphite-light">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-graphite text-base">No Repair Requests Yet</h3>
              <p className="text-xs text-graphite-light max-w-sm mx-auto mt-1">
                You haven&apos;t booked any repair services yet. Find a certified technician to fix your device today.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-repair-orange hover:bg-repair-orange-dark text-white rounded-xl text-xs font-bold transition-colors"
            >
              <Wrench className="w-4 h-4" />
              <span>Browse Catalog</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-graphite/10">
            {bookings.slice(0, 5).map((booking) => (
              <div
                key={booking._id}
                className="p-5 hover:bg-ivory/50 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-ivory border border-graphite/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {booking.serviceImage ? (
                      <img
                        src={booking.serviceImage}
                        alt={booking.serviceTitle}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Wrench className="w-5 h-5 text-graphite/40" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-graphite text-sm hover:text-repair-orange transition-colors">
                      <Link href={`/dashboard/customer/bookings/${booking._id}`}>
                        {booking.serviceTitle}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-graphite-light">
                      <span>{booking.serviceCategory}</span>
                      <span>•</span>
                      <span>
                        Preferred: {new Date(booking.preferredDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="font-bold text-graphite text-sm block">
                      ${((booking.finalAmount ?? booking.basePrice) || 0).toFixed(2)}
                    </span>
                    <span className="text-[11px] text-graphite-light capitalize">
                      {booking.paymentStatus}
                    </span>
                  </div>

                  <div>{getStatusBadge(booking.status)}</div>

                  <Link
                    href={`/dashboard/customer/bookings/${booking._id}`}
                    className="p-2 rounded-lg text-graphite/50 hover:text-graphite hover:bg-white transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
