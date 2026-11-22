'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PaymentBadge } from '@/components/dashboard/payment-badge';
import { DollarSign, CreditCard, ShieldCheck, Search, ArrowRight, ExternalLink } from 'lucide-react';

interface AdminPaymentRecord {
  _id: string;
  bookingId: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  amount: number;
  currency: string;
  status: string;
  stripePaymentIntentId?: string;
  stripeSessionId?: string;
  createdAt: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<AdminPaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchPayments = async () => {
      try {
        const res = await api.get<AdminPaymentRecord[]>('/admin/payments');
        if (isMounted) {
          setPayments(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load admin payments:', err);
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

  const totalVolume = payments
    .filter((p) => p.status === 'succeeded' || p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const filtered = payments.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p._id.toLowerCase().includes(q) ||
        p.bookingId.toLowerCase().includes(q) ||
        (p.stripePaymentIntentId && p.stripePaymentIntentId.toLowerCase().includes(q)) ||
        (p.customerEmail && p.customerEmail.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <DashboardShell
      allowedRoles={['admin']}
      title="Financial Transactions & Stripe Settlement"
      description="Authoritative ledger of customer payments processed via Stripe Checkout and verified via webhooks."
    >
      {/* Volume Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-graphite/10 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-graphite-light uppercase tracking-wider block">
              Gross Succeeded Volume
            </span>
            <span className="text-3xl font-extrabold text-emerald-700 mt-1 block">
              {isLoading ? <Skeleton className="h-8 w-24" /> : `$${totalVolume.toFixed(2)} USD`}
            </span>
            <span className="text-xs text-graphite-light mt-1 block">Direct Stripe payments</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-graphite/10 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-graphite-light uppercase tracking-wider block">
              Settled Transactions
            </span>
            <span className="text-3xl font-extrabold text-graphite mt-1 block">
              {isLoading ? <Skeleton className="h-8 w-12" /> : payments.length}
            </span>
            <span className="text-xs text-graphite-light mt-1 block">Webhook verified records</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-repair-orange/10 flex items-center justify-center text-repair-orange">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-graphite/10 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-graphite/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="font-bold text-graphite text-base">Payment Logs</h2>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-graphite/40 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, stripe intent, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-graphite/10 rounded-xl text-xs text-graphite focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <CreditCard className="w-12 h-12 text-graphite-light mx-auto" />
            <h3 className="font-bold text-graphite text-base">No Payment Records Found</h3>
            <p className="text-xs text-graphite-light">No records match the current criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-graphite/10">
            {filtered.map((p) => (
              <div
                key={p._id}
                className="p-5 hover:bg-ivory/50 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-graphite">
                      Invoice #{p._id.slice(-6).toUpperCase()}
                    </span>
                    <PaymentBadge status={p.status} />
                  </div>
                  <div className="text-xs text-graphite-light flex items-center gap-3 flex-wrap">
                    <span>Date: {new Date(p.createdAt).toLocaleString()}</span>
                    <span>•</span>
                    <span className="text-[11px] truncate max-w-xs">
                      {p.stripePaymentIntentId || p.stripeSessionId || 'Stripe Session'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="font-black text-graphite text-base block">
                      ${p.amount.toFixed(2)} {p.currency.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-graphite-light">Booking: #{p.bookingId.slice(-6).toUpperCase()}</span>
                  </div>

                  <Link
                    href={`/dashboard/customer/bookings/${p.bookingId}`}
                    className="p-2 rounded-lg text-graphite/50 hover:text-graphite hover:bg-white transition-colors"
                    title="Inspect Linked Booking"
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
