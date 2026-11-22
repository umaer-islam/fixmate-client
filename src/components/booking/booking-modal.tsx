'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BrandDatePicker } from '@/components/ui/date-picker';
import { MotionButton } from '@/components/motion/motion-button';
import { Calendar, MapPin, Phone, AlertCircle, Loader2, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

interface ServiceSummary {
  _id: string;
  title: string;
  category: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
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
      toast.error('Please log in to book this service.');
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
        <DialogTitle>Request Service Appointment</DialogTitle>
        <DialogDescription>
          Schedule your repair appointment for <span className="font-semibold text-foreground">{service.title}</span>
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="p-3.5 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Service summary pill */}
        <div className="bg-[#DCE8DE]/30 border border-[#DCE8DE] rounded-2xl p-4 text-xs flex items-center justify-between">
          <div>
            <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider block">
              Estimated Rate
            </span>
            <span className="font-mono font-black text-[#202522] text-xl">${service.basePrice.toFixed(2)}</span>
          </div>
          <div className="text-right">
            <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider block">
              Duration
            </span>
            <span className="font-medium text-foreground flex items-center gap-1 justify-end">
              <Clock className="w-3 h-3" />
              {service.estimatedDuration}
            </span>
          </div>
          <div className="text-right">
            <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider block">
              Mode
            </span>
            <span className="capitalize px-2 py-0.5 rounded-lg text-xs font-bold bg-[#F26A3D]/10 text-[#F26A3D]">
              {service.serviceMode}
            </span>
          </div>
        </div>

        {/* Preferred Date with Customized Brand DatePicker */}
        <BrandDatePicker
          label="Preferred Appointment Date"
          value={preferredDate}
          onChange={setPreferredDate}
          minDate={todayStr}
          required
          placeholder="Select an appointment date"
        />

        {/* Customer Phone */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
            Phone Number <span className="text-[#F26A3D]">*</span>
          </label>
          <input
            type="tel"
            placeholder="e.g. +1 555-0199 or 01712345678"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30 focus:border-[#F26A3D]"
          />
        </div>

        {/* Service Address */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
            Service Address / Location <span className="text-[#F26A3D]">*</span>
          </label>
          <input
            type="text"
            placeholder="Street address, building, apartment, city"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30 focus:border-[#F26A3D]"
          />
        </div>

        {/* Problem Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
            Problem Description <span className="text-[#F26A3D]">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Describe the issue, device model, or symptoms (e.g. iPhone 13 screen cracked, touch unresponsive)"
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30 focus:border-[#F26A3D]"
          />
        </div>

        <div className="pt-3 flex items-center justify-end gap-3 border-t border-border/70">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <MotionButton
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Request</span>
          </MotionButton>
        </div>
      </form>
    </Dialog>
  );
}
