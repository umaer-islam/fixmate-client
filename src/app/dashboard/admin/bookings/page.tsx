'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
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
  DollarSign,
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

  const statusFilters = ['all', 'requested', 'accepted', 'in-progress', 'completed', 'cancelled'];

  return (
    <DashboardShell
      allowedRoles={['admin']}
      title="Global Service Bookings"
      description="Supervise repair orders across all technicians and customers. Inspect lifecycle stages and payment reconciliation."
    >
      {/* Filters Bar */}
      <div className="bg-card rounded-3xl border border-border/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          {statusFilters.map((st) => {
            const count = bookings.filter((b) => (st === 'all' ? true : b.status === st)).length;
            const isActive = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`relative px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white'
                    : 'text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="admin-bookings-filter-pill"
                    className="absolute inset-0 bg-[#202522] rounded-xl shadow-xs"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{st}</span>
                <span
                  className={`relative z-10 text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-background/80 text-muted-foreground'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search booking, user, or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-border rounded-xl text-xs text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30 focus:border-[#F26A3D]"
          />
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-card rounded-3xl border border-border/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-muted/70 flex items-center justify-center mx-auto text-muted-foreground">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-foreground text-base">No Bookings Found</h3>
            <p className="text-xs text-muted-foreground">No records match your filter criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/70">
            <AnimatePresence mode="popLayout">
              {filtered.map((b) => (
                <motion.div
                  key={b._id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-5 hover:bg-muted/30 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-foreground">
                        #{b._id.slice(-6).toUpperCase()}
                      </span>
                      <span className="text-border">•</span>
                      <span className="text-xs text-[#F26A3D] font-bold uppercase tracking-wider">
                        {b.serviceCategory}
                      </span>
                      <span className="text-border">•</span>
                      {getStatusBadge(b.status)}
                      <Badge
                        variant={b.paymentStatus === 'paid' ? 'success' : 'warning'}
                        className="text-[10px] uppercase font-bold"
                      >
                        {b.paymentStatus}
                      </Badge>
                    </div>

                    <h3 className="font-extrabold text-[#202522] text-sm tracking-tight">{b.serviceTitle}</h3>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap pt-0.5">
                      <span>
                        Customer: <strong className="text-foreground">{b.customerName || b.customerPhone}</strong>
                      </span>
                      <span className="text-border">•</span>
                      <span>
                        Technician: <strong className="text-foreground">{b.technicianName || 'Assigned Pro'}</strong>
                      </span>
                      <span className="text-border">•</span>
                      <span>Preferred Date: {new Date(b.preferredDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end lg:self-center shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                        Invoice Amount
                      </span>
                      <span className="text-lg font-black text-[#202522] font-mono">
                        ${((b.finalAmount ?? b.basePrice) || 0).toFixed(2)}
                      </span>
                    </div>

                    <Link
                      href={`/dashboard/customer/bookings/${b._id}`}
                      className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Inspect Details"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
