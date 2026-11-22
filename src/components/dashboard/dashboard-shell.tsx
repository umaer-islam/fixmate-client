'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { useAuth } from '@/providers/auth-provider';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { motionSprings, buttonTapSpring } from '@/lib/motion/tokens';
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
  ChevronRight,
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
    { label: 'Booked Repairs', href: '/dashboard/customer/bookings', icon: Calendar },
    { label: 'Profile & Details', href: '/dashboard/profile', icon: User },
  ];

  const adminNav = [
    { label: 'System Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Moderate Services', href: '/dashboard/admin/services', icon: Layers },
    { label: 'User Directory', href: '/dashboard/admin/users', icon: Users },
    { label: 'All Bookings', href: '/dashboard/admin/bookings', icon: Calendar },
    { label: 'Booked Repairs', href: '/dashboard/customer/bookings', icon: Calendar },
    { label: 'Transactions', href: '/dashboard/admin/transactions', icon: DollarSign },
    { label: 'Admin Profile', href: '/dashboard/profile', icon: User },
  ];

  const navItems = role === 'admin' ? adminNav : role === 'technician' ? technicianNav : customerNav;

  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <div className="min-h-screen flex flex-col bg-[#F5F3EE]">
        <Navbar />

        <div className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Navigation */}
              <aside className="lg:col-span-1">
                <div className="sticky top-20 bg-card rounded-3xl border border-border/80 p-5 shadow-xs space-y-6">
                  {/* User snippet card */}
                  <div className="flex items-center gap-3.5 pb-5 border-b border-border/70">
                    <div className="w-12 h-12 rounded-2xl bg-[#202522] text-[#F26A3D] flex items-center justify-center font-bold text-lg shadow-xs overflow-hidden shrink-0">
                      {user?.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.avatarUrl} alt={user.name || 'User'} className="h-full w-full object-cover" />
                      ) : (
                        <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-foreground text-sm truncate">{user?.name || 'FixMate User'}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                      <div className="mt-1">
                        <Badge
                          variant={role === 'admin' ? 'default' : role === 'technician' ? 'orange' : 'sage'}
                          className="text-[10px] uppercase font-bold py-0.5 px-2"
                        >
                          {role || 'Customer'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links with animated active pill */}
                  <nav className="space-y-1">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="relative flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-colors select-none"
                        >
                          {isActive && (
                            <motion.div
                              layoutId="dashboard-sidebar-active"
                              transition={motionSprings.snappy}
                              className="absolute inset-0 bg-[#202522] rounded-2xl shadow-xs"
                            />
                          )}
                          <Icon
                            className={`relative z-10 w-4 h-4 ${
                              isActive ? 'text-[#F26A3D]' : 'text-muted-foreground'
                            }`}
                          />
                          <span
                            className={`relative z-10 ${
                              isActive ? 'text-[#F5F3EE]' : 'text-foreground/75 hover:text-foreground'
                            }`}
                          >
                            {item.label}
                          </span>
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Workspace switcher */}
                  <div className="pt-4 border-t border-border/70 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Quick Portal Switch
                    </span>
                    <div className="flex flex-col gap-1 text-xs">
                      <Link
                        href="/dashboard/customer"
                        className="px-2.5 py-1.5 rounded-xl text-muted-foreground hover:bg-muted/70 hover:text-foreground flex items-center justify-between transition-colors font-medium text-[11px]"
                      >
                        <span>Customer Portal</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                      </Link>
                      {role === 'technician' && (
                        <Link
                          href="/dashboard/technician/requests"
                          className="px-2.5 py-1.5 rounded-xl text-muted-foreground hover:bg-muted/70 hover:text-foreground flex items-center justify-between transition-colors font-medium text-[11px]"
                        >
                          <span>Technician Queue</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                        </Link>
                      )}
                      {role === 'admin' && (
                        <Link
                          href="/dashboard/admin"
                          className="px-2.5 py-1.5 rounded-xl text-muted-foreground hover:bg-muted/70 hover:text-foreground flex items-center justify-between transition-colors font-medium text-[11px]"
                        >
                          <span>Admin Console</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </aside>

              {/* Main Workspace Area */}
              <main className="lg:col-span-3 space-y-6">
                {/* Header Banner */}
                <div className="bg-card rounded-3xl border border-border/80 p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <h1 className="text-2xl font-black text-[#202522] tracking-tight font-heading">
                      {title}
                    </h1>
                    {description && (
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {description}
                      </p>
                    )}
                  </div>
                  {action && <div className="shrink-0">{action}</div>}
                </div>

                {/* Main View Content */}
                <div className="space-y-6">{children}</div>
              </main>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
