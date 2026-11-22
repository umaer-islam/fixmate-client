'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { api } from '@/lib/api-client';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BookingTimeline } from '@/components/dashboard/booking-timeline';
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
  MapPin,
  Phone,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  FileText,
  DollarSign,
  User,
} from 'lucide-react';

interface BookingDetail {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceCategory: string;
  serviceImage?: string;
  technicianId: string;
  technicianName?: string;
  customerId: string;
  customerPhone: string;
  address: string;
  problemDescription: string;
  status: 'requested' | 'accepted' | 'rejected' | 'in-progress' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid';
  basePrice: number;
  finalAmount?: number;
  preferredDate: string;
  createdAt: string;
  updatedAt?: string;
}

export default function CustomerBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.id as string;

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchBooking = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get<BookingDetail>(`/bookings/${bookingId}`);
      if (res.data) {
        setBooking(res.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load booking details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking request?')) return;

    try {
      setIsProcessing(true);
      await api.patch(`/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled.');
      await fetchBooking();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to cancel booking.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePay = async () => {
    try {
      setIsProcessing(true);
      const res = await api.post<{ sessionUrl: string; sessionId: string }>(
        '/payments/create-checkout-session',
        { bookingId }
      );

      if (res.data?.sessionUrl) {
        toast.info('Redirecting to Stripe Checkout...');
        window.location.href = res.data.sessionUrl;
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to start payment checkout.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardShell allowedRoles={['customer', 'technician', 'admin']} title="Booking Details">
        <div className="space-y-6">
          <Skeleton className="h-32 w-full rounded-3xl" />
          <Skeleton className="h-72 w-full rounded-3xl" />
        </div>
      </DashboardShell>
    );
  }

  if (error || !booking) {
    return (
      <DashboardShell allowedRoles={['customer', 'technician', 'admin']} title="Booking Not Found">
        <div className="bg-card rounded-3xl border border-border/80 p-8 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-[#F26A3D] mx-auto" />
          <h2 className="text-lg font-bold text-foreground">Unable to load booking</h2>
          <p className="text-sm text-muted-foreground">{error || 'Booking does not exist.'}</p>
          <Link href="/dashboard/customer/bookings">
            <MotionButton variant="graphite" size="sm">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to My Bookings</span>
            </MotionButton>
          </Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      allowedRoles={['customer', 'technician', 'admin']}
      title={`Booking #${booking._id.slice(-6).toUpperCase()}`}
      description={`Tracking repairs for ${booking.serviceTitle}`}
      action={
        <Link
          href="/dashboard/customer/bookings"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-muted-foreground hover:text-foreground bg-card border border-border rounded-xl transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Bookings</span>
        </Link>
      }
    >
      {/* Lifecycle Progress Stepper */}
      <div className="bg-card rounded-3xl border border-border/80 p-6 shadow-xs">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
          Repair Lifecycle Status
        </h2>
        <BookingTimeline
          status={booking.status}
          paymentStatus={booking.paymentStatus}
        />
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          {/* Service Snapshot Card */}
          <div className="bg-card rounded-3xl border border-border/80 p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-[#202522] text-base tracking-tight flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#F26A3D]" />
              <span>Service Snapshot</span>
            </h3>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F5F3EE]/80 border border-border/70">
              <div className="w-20 h-20 rounded-2xl bg-card border border-border overflow-hidden shrink-0 shadow-2xs">
                {booking.serviceImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={booking.serviceImage} alt={booking.serviceTitle} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Wrench className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <Badge variant="primary" className="text-[10px] uppercase font-bold tracking-wider">
                  {booking.serviceCategory}
                </Badge>
                <h4 className="font-extrabold text-[#202522] text-base tracking-tight">{booking.serviceTitle}</h4>
                <p className="text-xs text-muted-foreground">
                  Scheduled Date: <strong className="text-foreground">{new Date(booking.preferredDate).toLocaleDateString()}</strong>
                </p>
              </div>
            </div>

            {/* Problem Description */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Reported Problem
              </h4>
              <p className="text-sm text-muted-foreground bg-[#F5F3EE]/60 p-4 rounded-2xl border border-border/60 whitespace-pre-line leading-relaxed">
                {booking.problemDescription}
              </p>
            </div>

            {/* Customer Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F5F3EE]/60 border border-border/60">
                <Phone className="w-4 h-4 text-[#F26A3D] shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Contact Phone
                  </span>
                  <span className="text-xs font-bold text-foreground">{booking.customerPhone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F5F3EE]/60 border border-border/60">
                <MapPin className="w-4 h-4 text-[#F26A3D] shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Service Location
                  </span>
                  <span className="text-xs font-bold text-foreground truncate max-w-xs">{booking.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial & Actions (1 col) */}
        <div className="space-y-6">
          <div className="bg-card rounded-3xl border border-border/80 p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-[#202522] text-base tracking-tight flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#F26A3D]" />
              <span>Billing & Settlement</span>
            </h3>

            <div className="p-4 bg-[#F5F3EE]/80 rounded-2xl border border-border/70 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Base Quote:</span>
                <span className="font-bold text-foreground">${booking.basePrice.toFixed(2)}</span>
              </div>
              {booking.finalAmount !== undefined && (
                <div className="flex justify-between items-center border-t border-border/60 pt-2 font-bold text-sm text-[#202522]">
                  <span>Final Total:</span>
                  <span className="text-base font-black">${booking.finalAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center border-t border-border/60 pt-2">
                <span className="text-muted-foreground">Payment Status:</span>
                <Badge
                  variant={booking.paymentStatus === 'paid' ? 'success' : 'warning'}
                  className="text-[10px] uppercase font-bold"
                >
                  {booking.paymentStatus}
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              {booking.status === 'completed' && booking.paymentStatus === 'unpaid' && (
                <MotionButton
                  variant="primary"
                  size="md"
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={handlePay}
                  isLoading={isProcessing}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay Now via Stripe</span>
                </MotionButton>
              )}

              {booking.status === 'requested' && (
                <MotionButton
                  variant="outline"
                  size="sm"
                  className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={handleCancel}
                  isLoading={isProcessing}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancel Booking</span>
                </MotionButton>
              )}
            </div>

            <div className="rounded-2xl bg-[#DCE8DE]/40 border border-[#DCE8DE] p-3 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[11px] text-[#202522]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>FixMate Repair Warranty</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                90-day comprehensive parts and workmanship guarantee on all completed services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
