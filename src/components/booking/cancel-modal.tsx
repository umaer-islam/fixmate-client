'use client';

import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BrandSelect } from '@/components/ui/dropdown';

const CANCELLATION_REASONS = [
  { value: 'Change of plans / No longer needed', label: 'Change of plans / No longer needed' },
  { value: 'Issue resolved independently', label: 'Issue resolved independently' },
  { value: 'Scheduling conflict with preferred date', label: 'Scheduling conflict with preferred date' },
  { value: 'Booked by mistake', label: 'Booked by mistake' },
  { value: 'Other reason', label: 'Other reason' },
];

export interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingTitle?: string;
  bookingId?: string;
  onConfirm: (reason?: string) => Promise<void>;
}

export function CancelBookingModal({
  isOpen,
  onClose,
  bookingTitle,
  onConfirm,
}: CancelBookingModalProps) {
  const [reason, setReason] = useState('Change of plans / No longer needed');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm(reason);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <DialogTitle className="text-lg font-bold text-[#202522]">
              Cancel Repair Booking
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Are you sure you want to cancel this service request?
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-4 py-2">
        {bookingTitle && (
          <div className="rounded-xl bg-muted/50 p-3 border border-border/60">
            <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block">
              Target Service
            </span>
            <p className="text-xs font-bold text-foreground mt-0.5">{bookingTitle}</p>
          </div>
        )}

        <BrandSelect
          label="Reason for cancellation"
          value={reason}
          onChange={setReason}
          options={CANCELLATION_REASONS}
        />

        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-[11px] text-amber-800 space-y-1">
          <p className="font-bold">Zero-Penalty Guarantee:</p>
          <p className="opacity-90 leading-relaxed">
            Because FixMate operates with zero upfront fees, no charge has occurred. Once cancelled, this booking cannot be reopened, but you can book a new repair at any time.
          </p>
        </div>
      </div>

      <DialogFooter className="mt-4 gap-2 sm:gap-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isSubmitting}
          className="text-xs rounded-xl"
        >
          Keep Booking
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Cancelling...
            </>
          ) : (
            'Confirm Cancellation'
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
