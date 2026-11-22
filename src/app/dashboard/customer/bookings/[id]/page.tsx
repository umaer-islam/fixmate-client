'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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

  const steps = [
    { key: 'requested', label: 'Requested' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
  ];

  const getCurrentStepIndex = () => {
    if (!booking) return 0;
    if (booking.status === 'cancelled' || booking.status === 'rejected') return -1;
    return steps.findIndex((s) => s.key === booking.status);
  };

  const currentStep = getCurrentStepIndex();

  if (isLoading) {
    return (
      <DashboardShell allowedRoles={['customer', 'technician', 'admin']} title="Booking Details">
        <div className="space-y-6">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </DashboardShell>
    );
  }

  if (error || !booking) {
    return (
      <DashboardShell allowedRoles={['customer', 'technician', 'admin']} title="Booking Not Found">
        <div className="bg-white rounded-2xl border border-graphite/10 p-8 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-repair-orange mx-auto" />
          <h2 className="text-lg font-bold text-graphite">Unable to load booking</h2>
          <p className="text-sm text-graphite-light">{error || 'Booking does not exist.'}</p>
          <Link
            href="/dashboard/customer/bookings"
            className="inline-flex items-center gap-2 px-4 py-2 bg-graphite text-white rounded-xl text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Bookings</span>
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
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-graphite/70 hover:text-graphite bg-white border border-graphite/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Bookings</span>
        </Link>
      }
    >
      {/* Lifecycle Progress Stepper */}
      <div className="bg-white rounded-2xl border border-graphite/10 p-6 shadow-xs">
        <h2 className="text-xs font-bold text-graphite-light uppercase tracking-wider mb-6">
          Repair Lifecycle Status
        </h2>

        {booking.status === 'cancelled' || booking.status === 'rejected' ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <XCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm capitalize">This booking was {booking.status}</p>
              <p className="text-xs text-red-600">
                {booking.status === 'cancelled'
                  ? 'You cancelled this request.'
                  : 'The technician was unable to accept this request at this time.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="grid grid-cols-4 gap-2 text-center">
              {steps.map((step, idx) => {
                const isPassed = currentStep >= idx;
                const isCurrent = currentStep === idx;
                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-all ${
                        isCurrent
                          ? 'bg-repair-orange text-white ring-4 ring-repair-orange/20'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-ivory border border-graphite/20 text-graphite/40'
                      }`}
                    >
                      {isPassed && !isCurrent ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        isCurrent ? 'text-repair-orange' : isPassed ? 'text-graphite' : 'text-graphite/40'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          {/* Service Snapshot Card */}
          <div className="bg-white rounded-2xl border border-graphite/10 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-graphite text-base flex items-center gap-2">
              <Wrench className="w-4 h-4 text-repair-orange" />
              <span>Service Snapshot</span>
            </h3>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-ivory border border-graphite/10">
              <div className="w-20 h-20 rounded-xl bg-white border border-graphite/10 overflow-hidden flex-shrink-0">
                {booking.serviceImage ? (
                  <img src={booking.serviceImage} alt={booking.serviceTitle} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-graphite/40">
                    <Wrench className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <Badge variant="primary" className="text-[10px] uppercase font-bold">
                  {booking.serviceCategory}
                </Badge>
                <h4 className="font-extrabold text-graphite text-base">{booking.serviceTitle}</h4>
                <p className="text-xs text-graphite-light">
                  Scheduled Date: <strong className="text-graphite">{new Date(booking.preferredDate).toLocaleDateString()}</strong>
                </p>
              </div>
            </div>

            {/* Problem Description */}
            <div>
              <h4 className="text-xs font-bold text-graphite uppercase tracking-wider mb-1">
                Reported Problem
              </h4>
              <p className="text-sm text-graphite-light bg-ivory p-3.5 rounded-xl border border-graphite/10 whitespace-pre-line">
                {booking.problemDescription}
              </p>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-ivory border border-graphite/10">
                <Phone className="w-4 h-4 text-repair-orange flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-graphite-light uppercase block">Contact Phone</span>
                  <span className="text-xs font-bold text-graphite">{booking.customerPhone}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-ivory border border-graphite/10">
                <MapPin className="w-4 h-4 text-repair-orange flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-bold text-graphite-light uppercase block">Service Location</span>
                  <span className="text-xs font-bold text-graphite truncate max-w-xs">{booking.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial & Actions (1 col) */}
        <div className="space-y-6">
          {/* Invoice Summary */}
          <div className="bg-white rounded-2xl border border-graphite/10 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-graphite text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-repair-orange" />
              <span>Payment Details</span>
            </h3>

            <div className="space-y-2 text-sm border-b border-graphite/10 pb-4">
              <div className="flex justify-between text-graphite-light text-xs">
                <span>Base Service Quote</span>
                <span>${booking.basePrice.toFixed(2)}</span>
              </div>
              {booking.finalAmount !== undefined && (
                <div className="flex justify-between text-graphite font-semibold text-xs">
                  <span>Authoritative Final Amount</span>
                  <span>${booking.finalAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-graphite font-bold text-sm pt-2">
                <span>Total Payable</span>
                <span className="text-repair-orange text-lg">
                  ${((booking.finalAmount ?? booking.basePrice) || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-graphite-light font-medium">Payment Status</span>
              <Badge
                variant={booking.paymentStatus === 'paid' ? 'success' : 'warning'}
                className="capitalize font-bold text-xs"
              >
                {booking.paymentStatus}
              </Badge>
            </div>

            {/* Pay Button */}
            {booking.status === 'completed' && booking.paymentStatus === 'unpaid' && (
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CreditCard className="w-4 h-4" />
                )}
                <span>Pay Now with Stripe</span>
              </button>
            )}

            {/* Cancel Button */}
            {booking.status === 'requested' && (
              <button
                onClick={handleCancel}
                disabled={isProcessing}
                className="w-full py-2.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Cancel Request'}
              </button>
            )}

            {booking.paymentStatus === 'paid' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Invoice settled via Stripe. Thank you!</span>
              </div>
            )}
          </div>

          {/* Guarantee Note */}
          <div className="p-4 rounded-2xl bg-white border border-graphite/10 text-xs text-graphite-light space-y-2">
            <div className="flex items-center gap-2 font-bold text-graphite">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>FixMate Service Guarantee</span>
            </div>
            <p>
              All repairs are backed by our 90-day parts and workmanship guarantee. If issues persist after work completion, contact support directly.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
