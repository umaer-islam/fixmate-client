'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '@/lib/api-client';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MotionButton } from '@/components/motion/motion-button';
import { toast } from 'sonner';
import {
  Wrench,
  CheckCircle2,
  XCircle,
  Eye,
  AlertCircle,
  Clock,
  Search,
  Loader2,
  Filter,
  User,
  DollarSign,
} from 'lucide-react';

interface AdminServiceItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: 'onsite' | 'remote' | 'both' | string;
  technicianId: string;
  technicianName?: string;
  isAvailable: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  moderationNotes?: string;
  createdAt: string;
}

export default function AdminServicesModerationPage() {
  const [services, setServices] = useState<AdminServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Rejection dialog state
  const [rejectingService, setRejectingService] = useState<AdminServiceItem | null>(null);
  const [moderationNotes, setModerationNotes] = useState('');
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const res = await api.get<AdminServiceItem[]>('/admin/services');
      setServices(res.data || []);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch admin services list.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleApprove = async (serviceId: string) => {
    try {
      setProcessingId(serviceId);
      await api.patch(`/admin/services/${serviceId}/approval`, {
        approvalStatus: 'approved',
      });
      toast.success('Service approved for public listing.');
      await fetchServices();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to approve service.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingService) return;

    try {
      setIsSubmittingReject(true);
      await api.patch(`/admin/services/${rejectingService._id}/approval`, {
        approvalStatus: 'rejected',
        moderationNotes: moderationNotes.trim() || undefined,
      });
      toast.success('Service marked as rejected with moderation notes.');
      setRejectingService(null);
      setModerationNotes('');
      await fetchServices();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reject service.');
    } finally {
      setIsSubmittingReject(false);
    }
  };

  const filteredServices = services.filter((s) => {
    if (activeFilter !== 'all' && s.approvalStatus !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        (s.technicianName && s.technicianName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending Review</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const filters = [
    { key: 'pending', label: 'Pending Review', count: services.filter((s) => s.approvalStatus === 'pending').length },
    { key: 'approved', label: 'Approved', count: services.filter((s) => s.approvalStatus === 'approved').length },
    { key: 'rejected', label: 'Rejected', count: services.filter((s) => s.approvalStatus === 'rejected').length },
    { key: 'all', label: 'All Listings', count: services.length },
  ];

  return (
    <DashboardShell
      allowedRoles={['admin']}
      title="Service Catalog Moderation"
      description="Review new repair listings submitted by technicians. Approve quality offerings or provide moderation feedback."
    >
      {/* Top Filter & Search Bar */}
      <div className="bg-card rounded-3xl border border-border/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          {filters.map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key as any)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white'
                    : 'text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="admin-moderation-pill"
                    className="absolute inset-0 bg-[#202522] rounded-xl shadow-xs"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
                <span
                  className={`relative z-10 text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-background/80 text-muted-foreground'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by title, tech, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-border rounded-xl text-xs text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30 focus:border-[#F26A3D]"
          />
        </div>
      </div>

      {/* Services List */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-3xl" />
          <Skeleton className="h-40 w-full rounded-3xl" />
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-card rounded-3xl border border-border/80 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-muted/70 flex items-center justify-center mx-auto text-muted-foreground">
            <Wrench className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-foreground text-base">No Services Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            There are no repair offerings matching your current filter criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((s) => (
              <motion.div
                key={s._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                whileHover={{ y: -2, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
                className="bg-card rounded-3xl border border-border/80 p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-colors hover:border-border"
              >
                {/* Left Column: Thumbnail & Details */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-20 h-20 rounded-2xl bg-muted border border-border overflow-hidden shrink-0 shadow-2xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#F26A3D]">
                        {s.category}
                      </span>
                      <span className="text-border">•</span>
                      <span className="text-xs text-muted-foreground capitalize">{s.serviceMode} mode</span>
                      <span className="text-border">•</span>
                      {getApprovalBadge(s.approvalStatus)}
                    </div>

                    <h3 className="font-extrabold text-[#202522] text-base tracking-tight">{s.title}</h3>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {s.description}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        Technician: <strong className="text-foreground">{s.technicianName || 'Verified Tech'}</strong>
                      </span>
                      <span className="text-border">•</span>
                      <span>Submitted: {new Date(s.createdAt).toLocaleDateString()}</span>
                    </div>

                    {s.moderationNotes && (
                      <div className="text-xs text-foreground bg-[#F5F3EE]/80 p-2.5 rounded-xl border border-border/70 mt-1">
                        <strong className="font-semibold">Notes:</strong> {s.moderationNotes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Price & SLA */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-3 lg:pt-0 border-border/70 shrink-0">
                  <div className="lg:text-right">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Base Price
                    </span>
                    <span className="text-2xl font-black text-[#202522] font-mono">
                      ${s.basePrice.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium mt-0.5">
                    <Clock className="w-3 h-3" />
                    {s.estimatedDuration}
                  </span>
                </div>

                {/* Action Controls */}
                <div className="flex items-center gap-2 self-end lg:self-center border-t lg:border-t-0 pt-3 lg:pt-0 border-border/70 flex-wrap shrink-0">
                  {s.approvalStatus !== 'approved' && (
                    <MotionButton
                      variant="primary"
                      size="sm"
                      onClick={() => handleApprove(s._id)}
                      isLoading={processingId === s._id}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </MotionButton>
                  )}

                  {s.approvalStatus !== 'rejected' && (
                    <MotionButton
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setRejectingService(s);
                        setModerationNotes(s.moderationNotes || '');
                      }}
                      className="text-destructive border-destructive/30 hover:bg-destructive/10"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </MotionButton>
                  )}

                  <Link
                    href={`/services/${s._id}`}
                    target="_blank"
                    className="p-2 text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted border border-border rounded-xl transition-colors"
                    title="Preview Public Page"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Rejection Dialog */}
      {rejectingService && (
        <Dialog isOpen={Boolean(rejectingService)} onClose={() => setRejectingService(null)}>
          <DialogHeader>
            <DialogTitle>Reject Service Offering</DialogTitle>
            <DialogDescription>
              Return <span className="font-semibold text-foreground">{rejectingService.title}</span> to the technician. Specify corrective feedback.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmReject} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                Moderation Feedback / Notes
              </label>
              <textarea
                rows={4}
                required
                placeholder="e.g. Please clarify warranty duration, provide higher resolution imagery, or refine service scope."
                value={moderationNotes}
                onChange={(e) => setModerationNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-border rounded-xl text-xs text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30 focus:border-[#F26A3D]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-border/70">
              <button
                type="button"
                onClick={() => setRejectingService(null)}
                className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <MotionButton
                type="submit"
                variant="outline"
                size="sm"
                isLoading={isSubmittingReject}
                className="text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Confirm Rejection</span>
              </MotionButton>
            </div>
          </form>
        </Dialog>
      )}
    </DashboardShell>
  );
}
