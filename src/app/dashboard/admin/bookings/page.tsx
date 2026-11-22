'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Wrench,
  User,
  ArrowRight,
} from 'lucide-react';

interface AdminBooking {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceCategory: string;
  customerId: string;
  customerName?: string;
  customerPhone: string;
  technicianId: string;
  technicianName?: string;
  address: string;
  problemDescription: string;
  status: 'requested' | 'accepted' | 'rejected' | 'in-progress' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid';
  basePrice: number;
  finalAmount?: number;
  preferredDate: string;
  createdAt: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchBookings = async () => {
      try {
        const res = await api.get<AdminBooking[]>('/admin/bookings');
        if (isMounted) {
          setBookings(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load admin bookings:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchBookings();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = bookings.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.serviceTitle.toLowerCase().includes(q) ||
        b.customerPhone.includes(q) ||
        (b.customerName && b.customerName.toLowerCase().includes(q)) ||
        (b.technicianName && b.technicianName.toLowerCase().includes(q)) ||
        b._id.toLowerCase().includes(q)
      );
    }
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
      allowedRoles={['admin']}
      title="Global Service Bookings"
      description="Supervise repair orders across all technicians and customers. Inspect lifecycle stages and payment reconciliation."
    >
      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-graphite/10 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          {['all', 'requested', 'accepted', 'in-progress', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                statusFilter === st
                  ? 'bg-graphite text-white shadow-xs'
                  : 'bg-ivory text-graphite/70 hover:bg-white hover:text-graphite'
              }`}
            >
              {st} ({bookings.filter((b) => (st === 'all' ? true : b.status === st)).length})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-graphite/40 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search booking, user, or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-graphite/10 rounded-xl text-xs text-graphite focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
          />
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-2xl border border-graphite/10 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Calendar className="w-12 h-12 text-graphite-light mx-auto" />
            <h3 className="font-bold text-graphite text-base">No Bookings Found</h3>
            <p className="text-xs text-graphite-light">No records match your filter criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-graphite/10">
            {filtered.map((b) => (
              <div
                key={b._id}
                className="p-5 hover:bg-ivory/50 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-graphite">
                      #{b._id.slice(-6).toUpperCase()}
                    </span>
                    <span>•</span>
                    <span className="text-xs text-repair-orange font-bold uppercase">{b.serviceCategory}</span>
                    <span>•</span>
                    {getStatusBadge(b.status)}
                    <Badge
                      variant={b.paymentStatus === 'paid' ? 'success' : 'warning'}
                      className="text-[10px] uppercase font-bold"
                    >
                      {b.paymentStatus}
                    </Badge>
                  </div>

                  <h3 className="font-extrabold text-graphite text-sm">{b.serviceTitle}</h3>

                  <div className="flex items-center gap-4 text-xs text-graphite-light flex-wrap pt-0.5">
                    <span>
                      Customer: <strong>{b.customerName || b.customerPhone}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Technician: <strong>{b.technicianName || 'Assigned Pro'}</strong>
                    </span>
                    <span>•</span>
                    <span>Preferred Date: {new Date(b.preferredDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end lg:self-center">
                  <div className="text-right">
                    <span className="text-xs text-graphite-light block">Invoice Amount</span>
                    <span className="text-base font-black text-graphite">
                      ${((b.finalAmount ?? b.basePrice) || 0).toFixed(2)}
                    </span>
                  </div>

                  <Link
                    href={`/dashboard/customer/bookings/${b._id}`}
                    className="p-2 rounded-lg text-graphite/50 hover:text-graphite hover:bg-white transition-colors"
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
