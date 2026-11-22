'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '@/lib/api-client';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MotionButton } from '@/components/motion/motion-button';
import { toast } from 'sonner';
import {
  Wrench,
  PlusCircle,
  Edit,
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface ServiceItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: 'onsite' | 'remote' | 'both' | string;
  isAvailable: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  moderationNotes?: string;
  createdAt: string;
}

export default function TechnicianServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const res = await api.get<ServiceItem[]>('/technician/services');
      setServices(res.data || []);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch services.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleToggleAvailability = async (serviceId: string, currentAvailability: boolean) => {
    try {
      setTogglingId(serviceId);
      const nextVal = !currentAvailability;
      await api.patch(`/technician/services/${serviceId}/availability`, { isAvailable: nextVal });
      toast.success(nextVal ? 'Service marked as Available for booking.' : 'Service temporarily paused.');
      setServices((prev) =>
        prev.map((s) => (s._id === serviceId ? { ...s, isAvailable: nextVal } : s))
      );
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update service availability.');
    } finally {
      setTogglingId(null);
    }
  };

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'pending':
        return <Badge variant="warning">Under Review</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <DashboardShell
      allowedRoles={['technician', 'admin']}
      title="My Service Catalog"
      description="Create, monitor moderation reviews, and manage availability of your repair services."
      action={
        <Link href="/dashboard/technician/services/new">
          <MotionButton variant="primary" size="sm">
            <PlusCircle className="w-4 h-4" />
            <span>Add New Service</span>
          </MotionButton>
        </Link>
      }
    >
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-36 w-full rounded-3xl" />
          <Skeleton className="h-36 w-full rounded-3xl" />
        </div>
      ) : services.length === 0 ? (
        <div className="bg-card rounded-3xl border border-border/80 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-muted/70 flex items-center justify-center mx-auto text-muted-foreground">
            <Wrench className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-foreground text-base">No Services Published Yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            You have not listed any repair services. Publish your skills to receive jobs from customers across your area.
          </p>
          <Link href="/dashboard/technician/services/new" className="inline-block pt-1">
            <MotionButton variant="primary" size="sm">
              <PlusCircle className="w-4 h-4" />
              <span>Create First Service</span>
            </MotionButton>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {services.map((s) => (
              <motion.div
                key={s._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                whileHover={{ y: -2, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
                className="bg-card rounded-3xl border border-border/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 transition-colors hover:border-border"
              >
                {/* Service Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-20 h-20 rounded-2xl bg-muted border border-border overflow-hidden shrink-0 shadow-2xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#F26A3D]">
                        {s.category}
                      </span>
                      <span className="text-border">•</span>
                      <span className="text-xs text-muted-foreground capitalize">{s.serviceMode} mode</span>
                      <span className="text-border">•</span>
                      {getApprovalBadge(s.approvalStatus)}
                    </div>

                    <h3 className="font-extrabold text-[#202522] text-base tracking-tight">{s.title}</h3>

                    <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                      {s.description}
                    </p>

                    {s.moderationNotes && s.approvalStatus === 'rejected' && (
                      <div className="text-xs text-destructive bg-destructive/10 p-2.5 rounded-xl border border-destructive/20 mt-1">
                        <strong className="font-semibold">Moderation Feedback:</strong> {s.moderationNotes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Price & Duration */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-border/70 shrink-0">
                  <div className="sm:text-right">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Base Rate
                    </span>
                    <span className="text-2xl font-black text-[#202522]">
                      ${s.basePrice.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-0.5 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {s.estimatedDuration}
                  </span>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2.5 self-end sm:self-center border-t md:border-t-0 pt-3 md:pt-0 border-border/70 shrink-0">
                  {/* Availability Toggle */}
                  <button
                    onClick={() => handleToggleAvailability(s._id, s.isAvailable)}
                    disabled={togglingId === s._id}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      s.isAvailable
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100/80'
                        : 'bg-muted text-muted-foreground border border-border hover:bg-muted/80'
                    }`}
                    title="Toggle booking availability"
                  >
                    {togglingId === s._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : s.isAvailable ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5" />
                    )}
                    <span>{s.isAvailable ? 'Available' : 'Paused'}</span>
                  </button>

                  {/* Edit Link */}
                  <Link
                    href={`/dashboard/technician/services/${s._id}/edit`}
                    className="p-2 text-muted-foreground hover:text-foreground bg-card hover:bg-muted border border-border rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </Link>

                  {/* Public View (if approved) */}
                  {s.approvalStatus === 'approved' && (
                    <Link
                      href={`/services/${s._id}`}
                      target="_blank"
                      className="p-2 text-muted-foreground hover:text-[#F26A3D] bg-card hover:bg-muted border border-border rounded-xl transition-colors"
                      title="View Live Public Page"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </DashboardShell>
  );
}
