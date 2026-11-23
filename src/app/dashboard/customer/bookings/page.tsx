'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '@/lib/api-client';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PaymentBadge } from '@/components/dashboard/payment-badge';
import { CancelBookingModal } from '@/components/booking/cancel-modal';
import { MotionButton } from '@/components/motion/motion-button';
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

  const fetchBookings = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      const res = await api.get<Booking[]>('/bookings/my');
      const data = res.data || [];
      setBookings(data);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('fixmate_cached_customer_bookings', JSON.stringify(data));
      }
    } catch (err: any) {
      if (!silent) toast.error(err?.message || 'Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 1. Instant 0ms hydration from session storage
    let hasCachedData = false;
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem('fixmate_cached_customer_bookings');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBookings(parsed);
            setIsLoading(false);
            hasCachedData = true;
          }
        }
      } catch {
        // ignore JSON parse errors
      }
    }

    // 2. Background revalidation (silent if cached data already shown)
    fetchBookings(hasCachedData);
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
      const res = await api.post<{ url?: string; sessionUrl?: string; sessionId: string }>(
        '/payments/create-checkout-session',
        { bookingId }
      );

      const redirectUrl = res.data?.url || res.data?.sessionUrl || (res as any)?.url;
      if (redirectUrl) {
        toast.info('Redirecting to Stripe Checkout...');
        window.location.href = redirectUrl;
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

  const tabs = [
    { key: 'all', label: 'All Requests', count: bookings.length },
    {
      key: 'active',
      label: 'Active',
      count: bookings.filter((b) => ['requested', 'accepted', 'in-progress'].includes(b.status)).length,
    },
    {
      key: 'completed',
      label: 'Completed',
      count: bookings.filter((b) => b.status === 'completed').length,
    },
    {
      key: 'cancelled',
      label: 'Cancelled',
      count: bookings.filter((b) => ['cancelled', 'rejected'].includes(b.status)).length,
    },
  ];

  return (
    <DashboardShell
      allowedRoles={['customer']}
      title="My Service Bookings"
      description="Track live status transitions, review estimates, cancel pending requests, or settle repair invoices."
    >
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-3 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`relative px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'text-white'
                  : 'text-muted-foreground hover:text-foreground bg-card border border-border/70 hover:bg-muted/50'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="customer-bookings-active-pill"
                  className="absolute inset-0 bg-[#202522] rounded-2xl shadow-xs"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
              <span
                className={`relative z-10 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-3xl" />
          <Skeleton className="h-40 w-full rounded-3xl" />
          <Skeleton className="h-40 w-full rounded-3xl" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-card rounded-3xl border border-border/80 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-muted/70 flex items-center justify-center mx-auto text-muted-foreground">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-foreground text-base">No Bookings in this Category</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            You don&apos;t have any repair bookings matching this filter.
          </p>
          <Link href="/services" className="inline-block pt-1">
            <MotionButton variant="primary" size="sm">
              <Wrench className="w-4 h-4" />
              <span>Explore Repair Services</span>
            </MotionButton>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredBookings.map((b) => (
              <motion.div
                key={b._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                whileHover={{ y: -2, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
                className="bg-card rounded-3xl border border-border/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors hover:border-border"
              >
                {/* Left Column: Service Details */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                    {b.serviceImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={b.serviceImage} alt={b.serviceTitle} className="w-full h-full object-cover" />
                    ) : (
                      <Wrench className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs uppercase font-bold tracking-wider text-[#F26A3D]">
                        {b.serviceCategory}
                      </span>
                      <span className="text-border">•</span>
                      <span className="text-xs text-muted-foreground">
                        Scheduled: <strong className="text-foreground">{new Date(b.preferredDate).toLocaleDateString()}</strong>
                      </span>
                    </div>
                    <h3 className="font-extrabold text-[#202522] text-base tracking-tight hover:text-[#F26A3D] transition-colors">
                      <Link href={`/dashboard/customer/bookings/${b._id}`}>{b.serviceTitle}</Link>
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                      Problem: {b.problemDescription}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      Location: {b.address}
                    </p>
                  </div>
                </div>

                {/* Middle: Status & Payment */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-4 sm:pt-0 border-border/70 shrink-0">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(b.status)}
                    <PaymentBadge status={b.paymentStatus} />
                  </div>
                  <div className="sm:text-right">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Amount
                    </span>
                    <span className="text-xl font-black text-[#202522]">
                      ${((b.finalAmount ?? b.basePrice) || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 flex-wrap justify-end border-t md:border-t-0 pt-4 md:pt-0 border-border/70 shrink-0">
                  {/* Pay Now Button (if completed and unpaid) */}
                  {b.status === 'completed' && b.paymentStatus === 'unpaid' && (
                    <MotionButton
                      variant="primary"
                      size="sm"
                      onClick={() => handlePayNow(b._id)}
                      isLoading={processingId === b._id}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pay Now with Stripe</span>
                    </MotionButton>
                  )}

                  {/* Cancel Button (if requested) */}
                  {b.status === 'requested' && (
                    <MotionButton
                      variant="outline"
                      size="sm"
                      onClick={() => setCancellingBooking({ id: b._id, title: b.serviceTitle })}
                      isLoading={processingId === b._id}
                      className="text-destructive border-destructive/30 hover:bg-destructive/10"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </MotionButton>
                  )}

                  {/* View Details Link */}
                  <Link href={`/dashboard/customer/bookings/${b._id}`}>
                    <MotionButton variant="outline" size="sm">
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </MotionButton>
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancellingBooking && (
        <CancelBookingModal
          isOpen={Boolean(cancellingBooking)}
          onClose={() => setCancellingBooking(null)}
          onConfirm={handleConfirmCancel}
          bookingTitle={cancellingBooking.title}
        />
      )}
    </DashboardShell>
  );
}
