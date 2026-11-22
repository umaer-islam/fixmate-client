'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { CheckCircle2, XCircle, Clock, ArrowRight, Loader2, Calendar, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PaymentStatusResponse {
  bookingId: string;
  paymentStatus: 'paid' | 'unpaid';
  amount?: number;
  paidAt?: string;
  stripePaymentIntentId?: string;
}

export default function BookingPaymentCallbackPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const bookingId = params?.id as string;
  const paymentParam = searchParams?.get('payment');
  const sessionId = searchParams?.get('session_id');

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) return;

    let pollCount = 0;
    const maxPolls = 6;
    let timerId: any = null;

    const checkStatus = async () => {
      try {
        const res = await api.get<PaymentStatusResponse>(
          `/payments/booking/${bookingId}`
        );
        if (res.data) {
          setPaymentStatus(res.data);
          if (res.data.paymentStatus === 'paid' || pollCount >= maxPolls) {
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to query payment status:', err);
      }

      pollCount++;
      if (pollCount < maxPolls) {
        timerId = setTimeout(checkStatus, 2000);
      } else {
        setIsLoading(false);
      }
    };

    checkStatus();

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [bookingId]);

  const isSuccess = paymentParam === 'success' || paymentStatus?.paymentStatus === 'paid';
  const isCancelled = paymentParam === 'cancelled' && paymentStatus?.paymentStatus !== 'paid';

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-graphite/10 p-8 shadow-sm text-center space-y-6">
        {isLoading ? (
          <div className="space-y-4 py-8">
            <Loader2 className="w-12 h-12 text-repair-orange animate-spin mx-auto" />
            <h2 className="text-xl font-extrabold text-graphite">Verifying Payment...</h2>
            <p className="text-xs text-graphite-light max-w-xs mx-auto">
              Connecting with Stripe to confirm the transaction status. This will take just a moment.
            </p>
          </div>
        ) : isSuccess ? (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-graphite">Payment Succeeded!</h2>
            <p className="text-xs text-graphite-light">
              Your repair invoice has been securely settled with Stripe. Your technician and warranty are fully logged.
            </p>

            <div className="p-4 bg-ivory rounded-2xl border border-graphite/10 text-left space-y-2 text-xs">
              <div className="flex justify-between text-graphite-light">
                <span>Booking ID:</span>
                <span className="font-bold text-graphite">{bookingId.slice(-6).toUpperCase()}</span>
              </div>
              {paymentStatus?.amount && (
                <div className="flex justify-between text-graphite-light">
                  <span>Amount Paid:</span>
                  <span className="font-bold text-emerald-700">${paymentStatus.amount.toFixed(2)} USD</span>
                </div>
              )}
              {paymentStatus?.paidAt && (
                <div className="flex justify-between text-graphite-light">
                  <span>Settled Date:</span>
                  <span className="font-medium text-graphite">
                    {new Date(paymentStatus.paidAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-graphite-light">
                <span>Status:</span>
                <Badge variant="success" className="text-[10px] uppercase font-bold">
                  Paid
                </Badge>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href={`/dashboard/customer/bookings/${bookingId}`}
                className="w-full py-3 bg-graphite hover:bg-graphite/90 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <span>View Booking Details</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard/customer"
                className="w-full py-2.5 text-graphite/70 hover:text-graphite text-xs font-semibold"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        ) : isCancelled ? (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-graphite">Checkout Cancelled</h2>
            <p className="text-xs text-graphite-light">
              You cancelled the Stripe Checkout session. Your booking remains active and unpaid. You can settle it anytime from your dashboard.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <Link
                href={`/dashboard/customer/bookings/${bookingId}`}
                className="w-full py-3 bg-repair-orange hover:bg-repair-orange-dark text-white rounded-xl text-xs font-bold transition-colors"
              >
                Return to Booking
              </Link>
              <Link
                href="/dashboard/customer"
                className="w-full py-2.5 text-graphite/70 hover:text-graphite text-xs font-semibold"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
              <Clock className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-graphite">Payment Pending Confirmation</h2>
            <p className="text-xs text-graphite-light">
              We haven&apos;t received final webhook confirmation from Stripe yet. Check back in a minute or review your booking status.
            </p>
            <div className="pt-2">
              <Link
                href={`/dashboard/customer/bookings/${bookingId}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-graphite text-white rounded-xl text-xs font-bold"
              >
                <span>View Booking</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
