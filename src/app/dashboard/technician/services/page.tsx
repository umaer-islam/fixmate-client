'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
  ToggleLeft,
  ToggleRight,
  Loader2,
} from 'lucide-react';

interface ServiceItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: 'onsite' | 'remote' | 'both';
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
        <Link
          href="/dashboard/technician/services/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-repair-orange hover:bg-repair-orange-dark text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Service</span>
        </Link>
      }
    >
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-2xl border border-graphite/10 p-12 text-center space-y-4">
          <Wrench className="w-12 h-12 text-graphite-light mx-auto" />
          <h3 className="font-bold text-graphite text-base">No Services Published Yet</h3>
          <p className="text-xs text-graphite-light max-w-sm mx-auto">
            You have not listed any repair services. Publish your skills to receive jobs from customers across your area.
          </p>
          <Link
            href="/dashboard/technician/services/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-repair-orange text-white rounded-xl text-xs font-bold hover:bg-repair-orange-dark transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create First Service</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((s) => (
            <div
              key={s._id}
              className="bg-white rounded-2xl border border-graphite/10 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              {/* Service Info */}
              <div className="flex items-start gap-4 flex-1">
                <div className="w-20 h-20 rounded-xl bg-ivory border border-graphite/10 overflow-hidden flex-shrink-0">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-repair-orange">
                      {s.category}
                    </span>
                    <span>•</span>
                    <span className="text-xs text-graphite-light capitalize">{s.serviceMode} mode</span>
                    <span>•</span>
                    {getApprovalBadge(s.approvalStatus)}
                  </div>

                  <h3 className="font-extrabold text-graphite text-base">{s.title}</h3>

                  <p className="text-xs text-graphite-light line-clamp-1">{s.description}</p>

                  {s.moderationNotes && s.approvalStatus === 'rejected' && (
                    <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                      <strong>Moderation Note:</strong> {s.moderationNotes}
                    </p>
                  )}
                </div>
              </div>

              {/* Price & Duration */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-graphite/10">
                <div className="sm:text-right">
                  <span className="text-xs text-graphite-light block">Base Rate</span>
                  <span className="text-xl font-black text-graphite">${s.basePrice.toFixed(2)}</span>
                </div>
                <span className="text-xs text-graphite-light mt-0.5">{s.estimatedDuration}</span>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 self-end sm:self-center border-t md:border-t-0 pt-3 md:pt-0 border-graphite/10">
                {/* Availability Toggle */}
                <button
                  onClick={() => handleToggleAvailability(s._id, s.isAvailable)}
                  disabled={togglingId === s._id}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    s.isAvailable
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-ivory text-graphite/60 border border-graphite/20 hover:bg-white'
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
                  className="p-2 text-graphite/70 hover:text-graphite bg-ivory hover:bg-white border border-graphite/10 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </Link>

                {/* Public View (if approved) */}
                {s.approvalStatus === 'approved' && (
                  <Link
                    href={`/services/${s._id}`}
                    target="_blank"
                    className="p-2 text-graphite/70 hover:text-graphite bg-ivory hover:bg-white border border-graphite/10 rounded-lg transition-colors"
                    title="View Public Page"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
