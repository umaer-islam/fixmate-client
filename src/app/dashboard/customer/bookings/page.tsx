'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PaymentBadge } from '@/components/dashboard/payment-badge';
import { CancelBookingModal } from '@/components/booking/cancel-modal';
import { toast } from 'sonner';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  XCircle,
  Wrench,
  Loader2,
  ChevronRight,
  ExternalLink,
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
  customerPhone: string;
  address: string;
  problemDescription: string;
  preferredDate: string;
  createdAt: string;
  technicianName?: string;
}

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [cancellingBooking, setCancellingBooking] = useState<{ id: string; title: string } | null>(null);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const res = await api.get<Booking[]>('/bookings/my');
      setBookings(res.data || []);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleConfirmCancel = async (_reason?: string) => {
    if (!cancellingBooking) return;
    try {
      setProcessingId(cancellingBooking.id);
      await api.patch(`/bookings/${cancellingBooking.id}/cancel`);
      toast.success('Booking cancelled successfully.');
      await fetchBookings();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to cancel booking.');
    } finally {
      setProcessingId(null);
      setCancellingBooking(null);
    }
  };

  const handlePayNow = async (bookingId: string) => {
    try {
      setProcessingId(bookingId);
      const res = await api.post<{ sessionUrl: string; sessionId: string }>(
        '/payments/create-checkout-session',
        { bookingId }
      );

      if (res.data?.sessionUrl) {
        toast.info('Redirecting to Stripe Checkout...');
        window.location.href = res.data.sessionUrl;
      } else {
        toast.error('Unable to initialize payment session.');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to initiate payment.');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['requested', 'accepted', 'in-progress'].includes(b.status);
    if (activeTab === 'completed') return b.status === 'completed';
    if (activeTab === 'cancelled') return ['cancelled', 'rejected'].includes(b.status);
    return true;
  });

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
      title="My Service Bookings"
      description="Track live status transitions, review estimates, cancel pending requests, or settle repair invoices."
    >
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-graphite/10 pb-4">
        {[
          { key: 'all', label: `All Requests (${bookings.length})` },
          {
            key: 'active',
            label: `Active (${bookings.filter((b) => ['requested', 'accepted', 'in-progress'].includes(b.status)).length})`,
          },
          {
            key: 'completed',
            label: `Completed (${bookings.filter((b) => b.status === 'completed').length})`,
          },
          {
            key: 'cancelled',
            label: `Cancelled (${bookings.filter((b) => ['cancelled', 'rejected'].includes(b.status)).length})`,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.key
                ? 'bg-graphite text-white shadow-xs'
                : 'bg-white text-graphite/70 hover:bg-white/80 border border-graphite/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-graphite/10 p-12 text-center space-y-4">
          <Calendar className="w-12 h-12 text-graphite-light mx-auto" />
          <h3 className="font-bold text-graphite text-lg">No Bookings in this Category</h3>
          <p className="text-sm text-graphite-light max-w-sm mx-auto">
            You don&apos;t have any repair bookings matching this filter.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-repair-orange text-white rounded-xl text-xs font-bold hover:bg-repair-orange-dark transition-colors"
          >
            <Wrench className="w-4 h-4" />
            <span>Explore Repair Services</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-2xl border border-graphite/10 p-6 shadow-xs hover:border-graphite/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Left Column: Service Details */}
              <div className="flex items-start gap-4 flex-1">
                <div className="w-16 h-16 rounded-xl bg-ivory border border-graphite/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {b.serviceImage ? (
                    <img src={b.serviceImage} alt={b.serviceTitle} className="w-full h-full object-cover" />
                  ) : (
                    <Wrench className="w-6 h-6 text-graphite/40" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs uppercase font-bold text-repair-orange">{b.serviceCategory}</span>
                    <span>•</span>
                    <span className="text-xs text-graphite-light">
                      Scheduled: {new Date(b.preferredDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-graphite text-base hover:text-repair-orange transition-colors">
                    <Link href={`/dashboard/customer/bookings/${b._id}`}>{b.serviceTitle}</Link>
                  </h3>
                  <p className="text-xs text-graphite-light line-clamp-1">
                    Problem: {b.problemDescription}
                  </p>
                  <p className="text-xs text-graphite/60">
                    Location: {b.address}
                  </p>
                </div>
              </div>

              {/* Middle: Status & Payment */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-4 sm:pt-0 border-graphite/10">
                <div className="flex items-center gap-2">
                  {getStatusBadge(b.status)}
                  <PaymentBadge status={b.paymentStatus} />
                </div>
                <div className="sm:text-right">
                  <span className="text-xs text-graphite-light block">Amount</span>
                  <span className="text-lg font-black text-graphite">
                    ${((b.finalAmount ?? b.basePrice) || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 flex-wrap justify-end border-t md:border-t-0 pt-4 md:pt-0 border-graphite/10">
                {/* Pay Now Button (if completed and unpaid) */}
                {b.status === 'completed' && b.paymentStatus === 'unpaid' && (
                  <button
                    onClick={() => handlePayNow(b._id)}
                    disabled={processingId === b._id}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    {processingId === b._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CreditCard className="w-3.5 h-3.5" />
                    )}
                    <span>Pay with Stripe</span>
                  </button>
                )}

                {/* Cancel Button (if requested) */}
                {b.status === 'requested' && (
                  <button
                    onClick={() => setCancellingBooking({ id: b._id, title: b.serviceTitle })}
                    disabled={processingId === b._id}
                    className="px-3.5 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    Cancel Request
                  </button>
                )}

                <Link
                  href={`/dashboard/customer/bookings/${b._id}`}
                  className="px-4 py-2 bg-graphite hover:bg-graphite/90 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <span>Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Booking Confirmation Modal */}
      <CancelBookingModal
        isOpen={Boolean(cancellingBooking)}
        onClose={() => setCancellingBooking(null)}
        bookingTitle={cancellingBooking?.title}
        bookingId={cancellingBooking?.id}
        onConfirm={handleConfirmCancel}
      />
    </DashboardShell>
  );
}
