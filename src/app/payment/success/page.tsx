'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { CheckCircle2, AlertCircle, ArrowRight, Loader2, Calendar, FileText, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VerifiedPaymentData {
  paymentId?: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: string;
  stripePaymentIntentId?: string;
  stripeSessionId: string;
  paidAt: string;
  serviceTitle: string;
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<VerifiedPaymentData | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('Missing Stripe Checkout session ID.');
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const verify = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await api.post<VerifiedPaymentData>('/payments/verify-session', {
          sessionId,
        });

        if (isMounted) {
          if (res.data) {
            setPaymentData(res.data);
          } else {
            setError('Payment verification returned empty record.');
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Failed to verify Stripe payment session.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] bg-ivory flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl border border-graphite/10 p-8 shadow-sm text-center space-y-4">
          <Loader2 className="w-12 h-12 text-repair-orange animate-spin mx-auto" />
          <h2 className="text-xl font-extrabold text-graphite">Verifying Stripe Payment...</h2>
          <p className="text-xs text-graphite-light max-w-xs mx-auto">
            Contacting Stripe and recording authoritative transaction settlement into FixMate.
          </p>
        </div>
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className="min-h-[80vh] bg-ivory flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl border border-graphite/10 p-8 shadow-sm text-center space-y-5">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-extrabold text-graphite">Verification Error</h2>
          <p className="text-xs text-graphite-light">{error || 'Unable to confirm payment status.'}</p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/dashboard/customer/bookings"
              className="w-full py-3 bg-graphite hover:bg-graphite/90 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Check My Bookings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-ivory flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-graphite/10 p-8 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-black text-graphite">Payment Confirmed!</h1>
          <p className="text-xs text-graphite-light">
            Your transaction has been securely settled and verified with Stripe.
          </p>
        </div>

        {/* Transaction Summary Card */}
        <div className="p-4 bg-ivory rounded-2xl border border-graphite/10 text-left space-y-2.5 text-xs">
          <div className="flex justify-between items-center text-graphite-light border-b border-graphite/10 pb-2">
            <span>Service</span>
            <span className="font-bold text-graphite truncate max-w-[200px]">{paymentData.serviceTitle}</span>
          </div>

          <div className="flex justify-between items-center text-graphite-light">
            <span>Booking ID</span>
            <span className="font-mono font-bold text-graphite">
              #{paymentData.bookingId.slice(-6).toUpperCase()}
            </span>
          </div>

          <div className="flex justify-between items-center text-graphite-light">
            <span>Amount Paid</span>
            <span className="font-black text-emerald-700 text-sm">
              ${paymentData.amount.toFixed(2)} {paymentData.currency.toUpperCase()}
            </span>
          </div>

          <div className="flex justify-between items-center text-graphite-light">
            <span>Stripe Reference</span>
            <span className="font-mono text-[11px] text-graphite truncate max-w-[180px]">
              {paymentData.stripePaymentIntentId || paymentData.stripeSessionId}
            </span>
          </div>

          <div className="flex justify-between items-center text-graphite-light">
            <span>Status</span>
            <Badge variant="success" className="text-[10px] uppercase font-bold">
              {paymentData.status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-graphite-light">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>FixMate 90-Day Warranty Activated</span>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <Link
            href={`/dashboard/customer/bookings/${paymentData.bookingId}`}
            className="w-full py-3 bg-repair-orange hover:bg-repair-orange-dark text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
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
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] bg-ivory flex items-center justify-center px-4 py-12">
          <Loader2 className="w-8 h-8 text-repair-orange animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
