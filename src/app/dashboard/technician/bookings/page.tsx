'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  PlayCircle,
  Phone,
  MapPin,
  Wrench,
  Loader2,
  DollarSign,
} from 'lucide-react';

interface TechnicianBooking {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceCategory: string;
  serviceImage?: string;
  customerId: string;
  customerName?: string;
  customerPhone: string;
  address: string;
  problemDescription: string;
  status: 'requested' | 'accepted' | 'rejected' | 'in-progress' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid';
  basePrice: number;
  finalAmount?: number;
  preferredDate: string;
  createdAt: string;
}

export default function TechnicianBookingsPage() {
  const [bookings, setBookings] = useState<TechnicianBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'history'>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Completion modal state
  const [completingBooking, setCompletingBooking] = useState<TechnicianBooking | null>(null);
  const [finalAmountInput, setFinalAmountInput] = useState<string>('');
  const [isSubmittingCompletion, setIsSubmittingCompletion] = useState(false);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const res = await api.get<TechnicianBooking[]>('/technician/bookings');
      setBookings(res.data || []);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch technician job queue.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusTransition = async (
    bookingId: string,
    status: 'accepted' | 'rejected' | 'in-progress'
  ) => {
    try {
      setProcessingId(bookingId);
      await api.patch(`/technician/bookings/${bookingId}/status`, { status });
      toast.success(`Booking status updated to ${status}.`);
      await fetchBookings();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update booking status.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleOpenCompletionModal = (booking: TechnicianBooking) => {
    setCompletingBooking(booking);
    setFinalAmountInput(booking.basePrice.toString());
  };

  const handleConfirmCompletion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingBooking) return;

    const amount = parseFloat(finalAmountInput);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid positive final amount.');
      return;
    }

    try {
      setIsSubmittingCompletion(true);
      await api.patch(`/technician/bookings/${completingBooking._id}/status`, {
        status: 'completed',
        finalAmount: amount,
      });
      toast.success('Repair marked as Completed. Customer invoice generated!');
      setCompletingBooking(null);
      await fetchBookings();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to complete booking.');
    } finally {
      setIsSubmittingCompletion(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'pending') return b.status === 'requested';
    if (activeTab === 'active') return ['accepted', 'in-progress'].includes(b.status);
    if (activeTab === 'history') return ['completed', 'cancelled', 'rejected'].includes(b.status);
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
      allowedRoles={['technician', 'admin']}
      title="Assigned Job Queue"
      description="Review incoming customer repair requests, advance lifecycle stages, and finalize billing."
    >
      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-graphite/10 pb-4">
        {[
          {
            key: 'pending',
            label: `Pending Requests (${bookings.filter((b) => b.status === 'requested').length})`,
          },
          {
            key: 'active',
            label: `In Progress (${bookings.filter((b) => ['accepted', 'in-progress'].includes(b.status)).length})`,
          },
          {
            key: 'history',
            label: `History (${bookings.filter((b) => ['completed', 'cancelled', 'rejected'].includes(b.status)).length})`,
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

      {/* List */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-graphite/10 p-12 text-center space-y-3">
          <Calendar className="w-12 h-12 text-graphite-light mx-auto" />
          <h3 className="font-bold text-graphite text-base">No Jobs in this View</h3>
          <p className="text-xs text-graphite-light max-w-sm mx-auto">
            {activeTab === 'pending'
              ? 'No pending customer requests at this time. We will alert you when a customer requests your service.'
              : 'There are no active or historical bookings matching this category.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-2xl border border-graphite/10 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Left Column: Job Overview */}
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="primary" className="text-[10px] uppercase font-bold">
                    {b.serviceCategory}
                  </Badge>
                  {getStatusBadge(b.status)}
                  <span className="text-xs text-graphite-light font-medium">
                    Scheduled: <strong>{new Date(b.preferredDate).toLocaleDateString()}</strong>
                  </span>
                  <span className="text-xs text-graphite/40">•</span>
                  <span className="text-xs font-mono text-graphite-light">#{b._id.slice(-6).toUpperCase()}</span>
                </div>

                <h3 className="text-base font-extrabold text-graphite">{b.serviceTitle}</h3>

                <div className="p-3 bg-ivory rounded-xl border border-graphite/10 text-xs text-graphite-light space-y-1">
                  <p>
                    <strong className="text-graphite">Problem:</strong> {b.problemDescription}
                  </p>
                </div>

                {/* Customer Contact Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-graphite">
                    <Phone className="w-3.5 h-3.5 text-repair-orange flex-shrink-0" />
                    <span>{b.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-graphite">
                    <MapPin className="w-3.5 h-3.5 text-repair-orange flex-shrink-0" />
                    <span className="truncate">{b.address}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Pricing & Action Controls */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between lg:justify-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-graphite/10">
                <div className="lg:text-right">
                  <span className="text-[11px] font-semibold text-graphite-light uppercase block">
                    {b.finalAmount !== undefined ? 'Final Amount' : 'Estimated Base Price'}
                  </span>
                  <span className="text-xl font-black text-graphite">
                    ${((b.finalAmount ?? b.basePrice) || 0).toFixed(2)}
                  </span>
                  {b.status === 'completed' && (
                    <Badge
                      variant={b.paymentStatus === 'paid' ? 'success' : 'warning'}
                      className="text-[10px] uppercase font-bold mt-1 block"
                    >
                      {b.paymentStatus}
                    </Badge>
                  )}
                </div>

                {/* Action Transition Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  {b.status === 'requested' && (
                    <>
                      <button
                        onClick={() => handleStatusTransition(b._id, 'accepted')}
                        disabled={processingId === b._id}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept Job</span>
                      </button>
                      <button
                        onClick={() => handleStatusTransition(b._id, 'rejected')}
                        disabled={processingId === b._id}
                        className="px-3.5 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </>
                  )}

                  {b.status === 'accepted' && (
                    <button
                      onClick={() => handleStatusTransition(b._id, 'in-progress')}
                      disabled={processingId === b._id}
                      className="px-4 py-2 bg-repair-orange hover:bg-repair-orange-dark text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Start Work</span>
                    </button>
                  )}

                  {b.status === 'in-progress' && (
                    <button
                      onClick={() => handleOpenCompletionModal(b)}
                      disabled={processingId === b._id}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Complete Work</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completion Modal */}
      {completingBooking && (
        <Dialog isOpen={Boolean(completingBooking)} onClose={() => setCompletingBooking(null)}>
          <DialogHeader>
            <DialogTitle>Finalize Repair & Invoice</DialogTitle>
            <DialogDescription>
              Confirm repair completion for <span className="font-semibold text-graphite">{completingBooking.serviceTitle}</span>. Enter the authoritative final payable amount.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmCompletion} className="p-6 space-y-4">
            <div className="bg-ivory p-4 rounded-xl border border-graphite/10 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-graphite-light">Customer:</span>
                <span className="font-bold text-graphite">{completingBooking.customerName || completingBooking.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-graphite-light">Base Price Quote:</span>
                <span className="font-bold text-graphite">${completingBooking.basePrice.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-graphite uppercase tracking-wider mb-1">
                Authoritative Final Amount ($ USD) <span className="text-repair-orange">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-graphite/50 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={finalAmountInput}
                  onChange={(e) => setFinalAmountInput(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 border border-graphite/20 rounded-xl text-sm font-bold text-graphite focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
                />
              </div>
              <p className="text-[11px] text-graphite-light mt-1">
                This exact amount will be charged via Stripe Checkout when the customer pays.
              </p>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-graphite/10">
              <button
                type="button"
                onClick={() => setCompletingBooking(null)}
                className="px-4 py-2 text-xs font-bold text-graphite/70 hover:text-graphite"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingCompletion}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                {isSubmittingCompletion ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Finalizing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm & Mark Completed</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </Dialog>
      )}
    </DashboardShell>
  );
}
