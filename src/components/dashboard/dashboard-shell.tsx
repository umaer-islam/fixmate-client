'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  User,
  Wrench,
  PlusCircle,
  ShieldCheck,
  Users,
  CheckSquare,
  DollarSign,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface DashboardShellProps {
  children: React.ReactNode;
  allowedRoles?: ('customer' | 'technician' | 'admin')[];
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function DashboardShell({
  children,
  allowedRoles,
  title,
  description,
  action,
}: DashboardShellProps) {
  const { user, role } = useAuth();
  const pathname = usePathname();

  const customerNav = [
    { label: 'Overview', href: '/dashboard/customer', icon: LayoutDashboard },
    { label: 'My Bookings', href: '/dashboard/customer/bookings', icon: Calendar },
    { label: 'Payment History', href: '/dashboard/customer/payments', icon: CreditCard },
    { label: 'Profile Settings', href: '/dashboard/profile', icon: User },
  ];

  const technicianNav = [
    { label: 'Job Queue', href: '/dashboard/technician/requests', icon: Calendar },
    { label: 'My Services', href: '/dashboard/technician/my-services', icon: Wrench },
    { label: 'Add New Service', href: '/dashboard/technician/add-service', icon: PlusCircle },
    { label: 'Profile & Details', href: '/dashboard/profile', icon: User },
  ];

  const adminNav = [
    { label: 'System Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Moderate Services', href: '/dashboard/admin/services', icon: Layers },
    { label: 'User Directory', href: '/dashboard/admin/users', icon: Users },
    { label: 'All Bookings', href: '/dashboard/admin/bookings', icon: Calendar },
    { label: 'Transactions', href: '/dashboard/admin/transactions', icon: DollarSign },
    { label: 'Admin Profile', href: '/dashboard/profile', icon: User },
  ];

  const navItems = role === 'admin' ? adminNav : role === 'technician' ? technicianNav : customerNav;

  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <div className="min-h-screen bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-graphite/10 p-5 shadow-sm space-y-6">
                {/* User card snippet */}
                <div className="flex items-center gap-3 pb-5 border-b border-graphite/10">
                  <div className="w-12 h-12 rounded-full bg-repair-orange/10 border border-repair-orange/20 flex items-center justify-center font-bold text-repair-orange text-lg">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-graphite text-sm truncate">{user?.name || 'FixMate User'}</p>
                    <p className="text-xs text-graphite-light truncate">{user?.email}</p>
                    <div className="mt-1">
                      <Badge
                        variant={role === 'admin' ? 'danger' : role === 'technician' ? 'warning' : 'primary'}
                        className="text-[10px] uppercase font-bold py-0.5 px-2"
                      >
                        {role || 'Customer'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Nav Links */}
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-graphite text-white shadow-xs'
                            : 'text-graphite/70 hover:bg-ivory hover:text-graphite'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-repair-orange' : 'text-graphite/50'}`} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                {/* Role Switcher Shortcuts (for testing / admin / pro ease) */}
                <div className="pt-4 border-t border-graphite/10 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-graphite-light block">
                    Switch Workspace
                  </span>
                  <div className="flex flex-col gap-1 text-xs">
                    <Link
                      href="/dashboard/customer"
                      className="px-2.5 py-1.5 rounded-lg text-graphite/70 hover:bg-ivory hover:text-graphite flex items-center justify-between"
                    >
                      <span>Customer Portal</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                    </Link>
                    {role === 'technician' && (
                      <Link
                        href="/dashboard/technician/bookings"
                        className="px-2.5 py-1.5 rounded-lg text-graphite/70 hover:bg-ivory hover:text-graphite flex items-center justify-between"
                      >
                        <span>Technician Portal</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                      </Link>
                    )}
                    {role === 'admin' && (
                      <Link
                        href="/dashboard/admin"
                        className="px-2.5 py-1.5 rounded-lg text-graphite/70 hover:bg-ivory hover:text-graphite flex items-center justify-between"
                      >
                        <span>Admin Console</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="lg:col-span-3 space-y-6">
              {/* Header */}
              <div className="bg-white rounded-2xl border border-graphite/10 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-graphite tracking-tight">{title}</h1>
                  {description && <p className="text-sm text-graphite-light mt-1">{description}</p>}
                </div>
                {action && <div>{action}</div>}
              </div>

              {/* Children */}
              {children}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
