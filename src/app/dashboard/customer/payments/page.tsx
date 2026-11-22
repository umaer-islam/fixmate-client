'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditCard, DollarSign, Calendar, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';

interface Payment {
  _id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: string;
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  createdAt: string;
  serviceTitle?: string;
}

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchPayments = async () => {
      try {
        const res = await api.get<Payment[]>('/payments/my');
        if (isMounted) {
          setPayments(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load payments:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPayments();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalPaid = payments
    .filter((p) => p.status === 'succeeded' || p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <DashboardShell
      allowedRoles={['customer', 'technician', 'admin']}
      title="Payment History"
      description="Review all transactions processed securely through Stripe Checkout."
    >
      {/* Metrics Card */}
      <div className="bg-white rounded-2xl border border-graphite/10 p-6 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-graphite-light uppercase tracking-wider block">
            Total Succeeded Payments
          </span>
          <span className="text-3xl font-extrabold text-graphite mt-1 block">
            {isLoading ? <Skeleton className="h-8 w-24" /> : `$${totalPaid.toFixed(2)}`}
          </span>
          <span className="text-xs text-graphite-light mt-1 block">
            Across {payments.length} settled repair service{payments.length === 1 ? '' : 's'}
          </span>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
          <DollarSign className="w-8 h-8" />
        </div>
      </div>

      {/* Payment Records Table */}
      <div className="bg-white rounded-2xl border border-graphite/10 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-graphite/10 flex items-center justify-between">
          <h2 className="font-bold text-graphite text-base">Completed Invoices</h2>
          <div className="flex items-center gap-1.5 text-xs text-graphite-light">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Stripe Protected</span>
          </div>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <CreditCard className="w-12 h-12 text-graphite-light mx-auto" />
            <h3 className="font-bold text-graphite text-base">No Payment History Yet</h3>
            <p className="text-xs text-graphite-light max-w-sm mx-auto">
              Once you complete and settle a repair service via Stripe, official receipts and transaction references will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-graphite/10">
            {payments.map((p) => (
              <div
                key={p._id}
                className="p-5 hover:bg-ivory/50 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-graphite text-sm">
                      Invoice #{p._id.slice(-6).toUpperCase()}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-graphite-light mt-0.5">
                      <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="text-[11px] truncate max-w-xs">
                        {p.stripePaymentIntentId || p.stripeSessionId || 'Stripe Checkout'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="font-black text-graphite text-base block">
                      ${p.amount.toFixed(2)} {p.currency.toUpperCase()}
                    </span>
                    <Badge variant="success" className="text-[10px] uppercase font-bold">
                      {p.status}
                    </Badge>
                  </div>

                  {p.bookingId && (
                    <Link
                      href={`/dashboard/customer/bookings/${p.bookingId}`}
                      className="p-2 rounded-lg text-graphite/50 hover:text-graphite hover:bg-white transition-colors"
                      title="View Related Booking"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
