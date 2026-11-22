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
  Wrench,
  CheckCircle2,
  XCircle,
  Eye,
  AlertCircle,
  Clock,
  Search,
  Loader2,
  Filter,
} from 'lucide-react';

interface AdminServiceItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: 'onsite' | 'remote' | 'both';
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

  return (
    <DashboardShell
      allowedRoles={['admin']}
      title="Service Catalog Moderation"
      description="Review new repair listings submitted by technicians. Approve quality offerings or provide moderation feedback."
    >
      {/* Top Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-graphite/10 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          {[
            { key: 'pending', label: `Pending (${services.filter((s) => s.approvalStatus === 'pending').length})` },
            { key: 'approved', label: `Approved (${services.filter((s) => s.approvalStatus === 'approved').length})` },
            { key: 'rejected', label: `Rejected (${services.filter((s) => s.approvalStatus === 'rejected').length})` },
            { key: 'all', label: `All (${services.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === tab.key
                  ? 'bg-graphite text-white shadow-xs'
                  : 'bg-ivory text-graphite/70 hover:bg-white hover:text-graphite'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-graphite/40 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by title, tech, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-graphite/10 rounded-xl text-xs text-graphite focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
          />
        </div>
      </div>

      {/* Services List */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-graphite/10 p-12 text-center space-y-3">
          <Wrench className="w-12 h-12 text-graphite-light mx-auto" />
          <h3 className="font-bold text-graphite text-base">No Services Found</h3>
          <p className="text-xs text-graphite-light max-w-sm mx-auto">
            There are no repair offerings matching your current filter criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredServices.map((s) => (
            <div
              key={s._id}
              className="bg-white rounded-2xl border border-graphite/10 p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5"
            >
              {/* Left Column: Thumbnail & Details */}
              <div className="flex items-start gap-4 flex-1">
                <div className="w-20 h-20 rounded-xl bg-ivory border border-graphite/10 overflow-hidden flex-shrink-0">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-bold text-repair-orange">{s.category}</span>
                    <span>•</span>
                    <span className="text-xs text-graphite-light capitalize">{s.serviceMode} mode</span>
                    <span>•</span>
                    {getApprovalBadge(s.approvalStatus)}
                  </div>

                  <h3 className="font-extrabold text-graphite text-base">{s.title}</h3>

                  <p className="text-xs text-graphite-light line-clamp-2">{s.description}</p>

                  <div className="flex items-center gap-3 pt-1 text-xs text-graphite-light">
                    <span>
                      Technician: <strong className="text-graphite">{s.technicianName || 'Verified Tech'}</strong>
                    </span>
                    <span>•</span>
                    <span>Submitted: {new Date(s.createdAt).toLocaleDateString()}</span>
                  </div>

                  {s.moderationNotes && (
                    <p className="text-xs text-graphite bg-ivory p-2 rounded-lg border border-graphite/10 mt-1">
                      <strong>Notes:</strong> {s.moderationNotes}
                    </p>
                  )}
                </div>
              </div>

              {/* Price & SLA */}
              <div className="flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 pt-3 lg:pt-0 border-graphite/10">
                <div className="lg:text-right">
                  <span className="text-xs text-graphite-light block">Base Price</span>
                  <span className="text-xl font-black text-graphite">${s.basePrice.toFixed(2)}</span>
                </div>
                <span className="text-xs text-graphite-light">{s.estimatedDuration}</span>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 self-end lg:self-center border-t lg:border-t-0 pt-3 lg:pt-0 border-graphite/10 flex-wrap">
                {s.approvalStatus !== 'approved' && (
                  <button
                    onClick={() => handleApprove(s._id)}
                    disabled={processingId === s._id}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}

                {s.approvalStatus !== 'rejected' && (
                  <button
                    onClick={() => {
                      setRejectingService(s);
                      setModerationNotes(s.moderationNotes || '');
                    }}
                    disabled={processingId === s._id}
                    className="px-3.5 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                )}

                <Link
                  href={`/services/${s._id}`}
                  target="_blank"
                  className="p-2 text-graphite/70 hover:text-graphite bg-ivory hover:bg-white border border-graphite/10 rounded-xl transition-colors"
                  title="Preview Service"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejection Feedback Dialog */}
      {rejectingService && (
        <Dialog isOpen={Boolean(rejectingService)} onClose={() => setRejectingService(null)}>
          <DialogHeader>
            <DialogTitle>Reject Service Offering</DialogTitle>
            <DialogDescription>
              State reasons for rejecting <span className="font-semibold text-graphite">{rejectingService.title}</span> so the technician can address quality or policy guidelines.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmReject} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-graphite uppercase tracking-wider mb-1">
                Moderation Notes / Feedback
              </label>
              <textarea
                rows={4}
                placeholder="e.g. Please provide clearer description of hardware warranty, or replace low-resolution thumbnail..."
                value={moderationNotes}
                onChange={(e) => setModerationNotes(e.target.value)}
                maxLength={500}
                className="w-full px-3.5 py-2.5 border border-graphite/20 rounded-xl text-xs text-graphite focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
              />
              <span className="text-[10px] text-graphite-light block text-right">Max 500 characters</span>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-graphite/10">
              <button
                type="button"
                onClick={() => setRejectingService(null)}
                className="px-4 py-2 text-xs font-bold text-graphite/70 hover:text-graphite"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingReject}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                {isSubmittingReject ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Rejecting...</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Confirm Rejection</span>
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
