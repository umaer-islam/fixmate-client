'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '@/lib/api-client';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MotionButton } from '@/components/motion/motion-button';
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
  User,
  ShieldCheck,
  ChevronRight,
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

  const tabs = [
    {
      key: 'pending',
      label: 'Pending Requests',
      count: bookings.filter((b) => b.status === 'requested').length,
    },
    {
      key: 'active',
      label: 'In Progress',
      count: bookings.filter((b) => ['accepted', 'in-progress'].includes(b.status)).length,
    },
    {
      key: 'history',
      label: 'History',
      count: bookings.filter((b) => ['completed', 'cancelled', 'rejected'].includes(b.status)).length,
    },
  ];

  return (
    <DashboardShell
      allowedRoles={['technician', 'admin']}
      title="Assigned Job Queue"
      description="Review incoming customer repair requests, advance lifecycle stages, and finalize billing."
    >
      {/* Status Filter Tabs */}
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
                  layoutId="technician-queue-active-pill"
                  className="absolute inset-0 bg-[#202522] rounded-2xl shadow-xs"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
              <span
                className={`relative z-10 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-44 w-full rounded-3xl" />
          <Skeleton className="h-44 w-full rounded-3xl" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-card rounded-3xl border border-border/80 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-muted/70 flex items-center justify-center mx-auto text-muted-foreground">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-foreground text-base">No Jobs in this View</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            {activeTab === 'pending'
              ? 'No pending customer requests at this time. We will alert you when a customer requests your service.'
              : 'There are no active or historical bookings matching this category.'}
          </p>
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
                className="bg-card rounded-3xl border border-border/80 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-colors hover:border-border"
              >
                {/* Left Column: Job Overview */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <Badge variant="primary" className="text-[10px] uppercase font-bold tracking-wider">
                      {b.serviceCategory}
                    </Badge>
                    {getStatusBadge(b.status)}
                    <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Scheduled: <strong className="text-foreground">{new Date(b.preferredDate).toLocaleDateString()}</strong>
                    </span>
                    <span className="text-xs text-border">•</span>
                    <span className="text-xs font-medium text-muted-foreground">
                      #{b._id.slice(-6).toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-[#202522] tracking-tight">{b.serviceTitle}</h3>

                  <div className="p-3.5 bg-[#F5F3EE]/60 rounded-2xl border border-border/60 text-xs text-foreground/80 space-y-1">
                    <p className="leading-relaxed">
                      <strong className="text-[#202522] font-semibold">Reported Issue:</strong> {b.problemDescription}
                    </p>
                  </div>

                  {/* Customer Contact Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <Phone className="w-3.5 h-3.5 text-[#F26A3D] shrink-0" />
                      <span>{b.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#F26A3D] shrink-0" />
                      <span className="truncate">{b.address}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Pricing & Action Controls */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between lg:justify-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-border/70 shrink-0">
                  <div className="lg:text-right">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      {b.finalAmount !== undefined ? 'Final Settled Fee' : 'Estimated Base Price'}
                    </span>
                    <span className="text-2xl font-black text-[#202522]">
                      ${((b.finalAmount ?? b.basePrice) || 0).toFixed(2)}
                    </span>
                    {b.status === 'completed' && (
                      <div className="mt-1">
                        <Badge
                          variant={b.paymentStatus === 'paid' ? 'success' : 'warning'}
                          className="text-[10px] uppercase font-bold"
                        >
                          {b.paymentStatus === 'paid' ? 'Paid via Stripe' : 'Unpaid (Awaiting Customer)'}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Action Transition Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {b.status === 'requested' && (
                      <>
                        <MotionButton
                          variant="primary"
                          size="sm"
                          onClick={() => handleStatusTransition(b._id, 'accepted')}
                          isLoading={processingId === b._id}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept Job</span>
                        </MotionButton>
                        <MotionButton
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusTransition(b._id, 'rejected')}
                          isLoading={processingId === b._id}
                          className="text-destructive border-destructive/30 hover:bg-destructive/10"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </MotionButton>
                      </>
                    )}

                    {b.status === 'accepted' && (
                      <MotionButton
                        variant="primary"
                        size="sm"
                        onClick={() => handleStatusTransition(b._id, 'in-progress')}
                        isLoading={processingId === b._id}
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Start Work</span>
                      </MotionButton>
                    )}

                    {b.status === 'in-progress' && (
                      <MotionButton
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenCompletionModal(b)}
                        isLoading={processingId === b._id}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Complete Work</span>
                      </MotionButton>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Completion Modal */}
      {completingBooking && (
        <Dialog isOpen={Boolean(completingBooking)} onClose={() => setCompletingBooking(null)}>
          <DialogHeader>
            <DialogTitle>Finalize Repair & Invoice</DialogTitle>
            <DialogDescription>
              Confirm repair completion for <span className="font-semibold text-foreground">{completingBooking.serviceTitle}</span>. Enter the authoritative final payable amount.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmCompletion} className="p-6 space-y-4">
            <div className="bg-[#F5F3EE]/80 p-4 rounded-2xl border border-border/70 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer:</span>
                <span className="font-bold text-foreground">
                  {completingBooking.customerName || completingBooking.customerPhone}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Price Quote:</span>
                <span className="font-bold text-foreground">
                  ${completingBooking.basePrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t border-border/60 pt-1.5">
                <span className="text-muted-foreground">Payment Channel:</span>
                <span className="font-bold text-[#F26A3D] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Stripe Checkout Escrow
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                Authoritative Final Amount ($ USD) <span className="text-[#F26A3D]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-muted-foreground font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={finalAmountInput}
                  onChange={(e) => setFinalAmountInput(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 border border-border rounded-xl text-sm font-bold text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30 focus:border-[#F26A3D]"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                This exact amount will be charged via Stripe Checkout when the customer pays for their completed repair.
              </p>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-border/70">
              <button
                type="button"
                onClick={() => setCompletingBooking(null)}
                className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <MotionButton
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isSubmittingCompletion}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm & Mark Completed</span>
              </MotionButton>
            </div>
          </form>
        </Dialog>
      )}
    </DashboardShell>
  );
}
