'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar, MapPin, Phone, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

interface ServiceSummary {
  _id: string;
  title: string;
  category: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: 'onsite' | 'remote' | 'both';
  technicianName?: string;
}

interface BookingModalProps {
  service: ServiceSummary;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (bookingId: string) => void;
}

export function BookingModal({ service, isOpen, onClose, onSuccess }: BookingModalProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Get tomorrow as default minimum date formatted as YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  const [preferredDate, setPreferredDate] = useState('');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.area || '');
  const [problemDescription, setProblemDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      toast.error('Please log in as a customer to book this service.');
      router.push(`/login?redirect=/services/${service._id}`);
      return;
    }

    if (!preferredDate) {
      setError('Please select a preferred service date.');
      return;
    }

    if (customerPhone.trim().length < 7) {
      setError('Please provide a valid contact phone number (min 7 digits).');
      return;
    }

    if (address.trim().length < 5) {
      setError('Please provide a valid service address (min 5 characters).');
      return;
    }

    if (problemDescription.trim().length < 5) {
      setError('Please describe the problem or repair requirements in detail.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post<{ _id: string }>('/bookings', {
        serviceId: service._id,
        preferredDate: new Date(preferredDate).toISOString(),
        customerPhone: customerPhone.trim(),
        address: address.trim(),
        problemDescription: problemDescription.trim(),
      });

      const newBookingId = res.data?._id;
      toast.success('Repair request submitted successfully!');
      onClose();

      if (onSuccess && newBookingId) {
        onSuccess(newBookingId);
      } else if (newBookingId) {
        router.push(`/dashboard/customer/bookings/${newBookingId}`);
      } else {
        router.push('/dashboard/customer/bookings');
      }
    } catch (err: any) {
      const msg = err?.message || 'Failed to submit booking request.';
      if (err?.statusCode === 409) {
        setError('You already have an active booking for this service. Track your existing request in your dashboard.');
      } else {
        setError(msg);
      }
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>Request Service</DialogTitle>
        <DialogDescription>
          Schedule your repair appointment for <span className="font-semibold text-graphite">{service.title}</span>
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Service summary pill */}
        <div className="bg-sage/20 border border-sage/40 rounded-lg p-3 text-sm flex items-center justify-between">
          <div>
            <span className="text-graphite-light text-xs uppercase tracking-wider block">Estimated Fee</span>
            <span className="font-bold text-graphite text-lg">${service.basePrice.toFixed(2)}</span>
          </div>
          <div className="text-right">
            <span className="text-graphite-light text-xs uppercase tracking-wider block">Estimated Time</span>
            <span className="font-medium text-graphite">{service.estimatedDuration}</span>
          </div>
          <div className="text-right">
            <span className="text-graphite-light text-xs uppercase tracking-wider block">Mode</span>
            <span className="capitalize px-2 py-0.5 rounded text-xs font-semibold bg-repair-orange/10 text-repair-orange">
              {service.serviceMode}
            </span>
          </div>
        </div>

        {/* Preferred Date */}
        <div>
          <label className="block text-xs font-semibold text-graphite uppercase tracking-wider mb-1">
            Preferred Date <span className="text-repair-orange">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              min={todayStr}
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-graphite/20 rounded-lg text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
            />
          </div>
        </div>

        {/* Customer Phone */}
        <div>
          <label className="block text-xs font-semibold text-graphite uppercase tracking-wider mb-1">
            Phone Number <span className="text-repair-orange">*</span>
          </label>
          <input
            type="tel"
            placeholder="e.g. +1 555-0199 or 01712345678"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
            className="w-full px-3 py-2 border border-graphite/20 rounded-lg text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
          />
        </div>

        {/* Service Address */}
        <div>
          <label className="block text-xs font-semibold text-graphite uppercase tracking-wider mb-1">
            Service Address / Location <span className="text-repair-orange">*</span>
          </label>
          <input
            type="text"
            placeholder="Street address, building, apartment, city"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full px-3 py-2 border border-graphite/20 rounded-lg text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
          />
        </div>

        {/* Problem Description */}
        <div>
          <label className="block text-xs font-semibold text-graphite uppercase tracking-wider mb-1">
            Problem Description <span className="text-repair-orange">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Describe the issue, device model, or symptoms (e.g. iPhone 13 screen cracked, touch unresponsive)"
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            required
            className="w-full px-3 py-2 border border-graphite/20 rounded-lg text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-3 border-t border-graphite/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-graphite/70 hover:text-graphite transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-repair-orange hover:bg-repair-orange-dark text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scheduling...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Request</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
