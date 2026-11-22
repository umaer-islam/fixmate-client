'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, ArrowLeft, Calendar, HelpCircle, Loader2 } from 'lucide-react';

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking_id');

  return (
    <div className="min-h-[80vh] bg-ivory flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-graphite/10 p-8 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
          <XCircle className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-black text-graphite">Checkout Incomplete</h1>
          <p className="text-xs text-graphite-light">
            You exited the Stripe Checkout session. No charges were made to your card.
          </p>
        </div>

        <div className="p-4 bg-ivory rounded-2xl border border-graphite/10 text-xs text-graphite-light text-left space-y-2">
          <p className="font-semibold text-graphite flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-repair-orange" />
            <span>Booking Remains Active</span>
          </p>
          <p>
            Your repair job status remains recorded as completed and ready for payment. You can return anytime to finalize your payment securely.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          {bookingId ? (
            <Link
              href={`/dashboard/customer/bookings/${bookingId}`}
              className="w-full py-3 bg-repair-orange hover:bg-repair-orange-dark text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Return to Booking Details</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/dashboard/customer/bookings"
              className="w-full py-3 bg-repair-orange hover:bg-repair-orange-dark text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>View My Bookings</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          )}

          <Link
            href="/dashboard/customer"
            className="w-full py-2.5 text-graphite/70 hover:text-graphite text-xs font-semibold"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] bg-ivory flex items-center justify-center px-4 py-12">
          <Loader2 className="w-8 h-8 text-repair-orange animate-spin" />
        </div>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}
