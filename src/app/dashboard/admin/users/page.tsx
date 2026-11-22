'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '@/lib/api-client';
import { useAuth } from '@/providers/auth-provider';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MotionButton } from '@/components/motion/motion-button';
import { toast } from 'sonner';
import {
  Users,
  ShieldCheck,
  Search,
  UserCheck,
  UserCog,
  Loader2,
  Calendar,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface AdminUser {
  _id: string;
  name?: string;
  email: string;
  role: 'customer' | 'technician' | 'admin';
  phone?: string;
  area?: string;
  avatarUrl?: string;
  image?: string;
  createdAt?: string;
}

export default function AdminUsersPage() {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'technician' | 'admin'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Role modification dialog state
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [targetRole, setTargetRole] = useState<'customer' | 'technician' | 'admin'>('customer');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get<AdminUser[]>('/admin/users');
      setUsers(res.data || []);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch user directory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenRoleModal = (u: AdminUser) => {
    setSelectedUser(u);
    setTargetRole(u.role);
  };

  const handleConfirmRoleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (selectedUser._id === currentAdmin?.id && targetRole !== 'admin') {
      if (!confirm('Warning: You are about to remove your own Admin privileges. Proceed?')) {
        return;
      }
    }

    try {
      setIsUpdatingRole(true);
      await api.patch(`/admin/users/${selectedUser._id}/role`, {
        role: targetRole,
      });
      toast.success(`Role updated for ${selectedUser.name || selectedUser.email} to ${targetRole}.`);
      setSelectedUser(null);
      await fetchUsers();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update user role.');
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        (u.name && u.name.toLowerCase().includes(q)) ||
        u.email.toLowerCase().includes(q) ||
        (u.area && u.area.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const roleFilters = [
    { key: 'all', label: 'All Accounts', count: users.length },
    { key: 'customer', label: 'Customers', count: users.filter((u) => u.role === 'customer').length },
    { key: 'technician', label: 'Technicians', count: users.filter((u) => u.role === 'technician').length },
    { key: 'admin', label: 'Admins', count: users.filter((u) => u.role === 'admin').length },
  ];

  return (
    <DashboardShell
      allowedRoles={['admin']}
      title="User Directory & Authorization"
      description="Inspect registered customer accounts, verify technician profiles, and manage system roles."
    >
      {/* Top Filter & Search Bar */}
      <div className="bg-card rounded-3xl border border-border/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Role Filters */}
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          {roleFilters.map((tab) => {
            const isActive = roleFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setRoleFilter(tab.key as any)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white'
                    : 'text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="admin-users-filter-pill"
                    className="absolute inset-0 bg-[#202522] rounded-xl shadow-xs"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
                <span
                  className={`relative z-10 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
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
            placeholder="Search by name, email, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-border rounded-xl text-xs text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30 focus:border-[#F26A3D]"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-3xl border border-border/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-muted/70 flex items-center justify-center mx-auto text-muted-foreground">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-foreground text-base">No Users Found</h3>
            <p className="text-xs text-muted-foreground">No records match your filter or search query.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/70">
            <AnimatePresence mode="popLayout">
              {filteredUsers.map((u) => (
                <motion.div
                  key={u._id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-5 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  {/* User Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#F26A3D]/10 border border-[#F26A3D]/20 flex items-center justify-center font-bold text-[#F26A3D] text-base shrink-0 shadow-2xs">
                      {u.avatarUrl || u.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={u.avatarUrl || u.image}
                          alt={u.name || u.email}
                          className="w-full h-full rounded-2xl object-cover"
                        />
                      ) : u.name ? (
                        u.name.charAt(0).toUpperCase()
                      ) : (
                        'U'
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-[#202522] text-sm tracking-tight">
                          {u.name || 'Unnamed User'}
                        </h3>
                        <Badge
                          variant={u.role === 'admin' ? 'default' : u.role === 'technician' ? 'orange' : 'sage'}
                          className="text-[10px] uppercase font-bold tracking-wider"
                        >
                          {u.role}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{u.email}</span>
                        </span>
                        {u.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{u.phone}</span>
                          </span>
                        )}
                        {u.area && <span>• {u.area}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Right Action */}
                  <div className="self-end sm:self-center shrink-0">
                    <MotionButton
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenRoleModal(u)}
                    >
                      <UserCog className="w-3.5 h-3.5 text-[#F26A3D]" />
                      <span>Change Role</span>
                    </MotionButton>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Role Modification Modal */}
      {selectedUser && (
        <Dialog isOpen={Boolean(selectedUser)} onClose={() => setSelectedUser(null)}>
          <DialogHeader>
            <DialogTitle>Modify User Access Role</DialogTitle>
            <DialogDescription>
              Assign new platform privileges to <span className="font-bold text-foreground">{selectedUser.name || selectedUser.email}</span>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmRoleChange} className="p-6 space-y-4">
            <div className="p-4 bg-[#F5F3EE]/80 rounded-2xl border border-border/70 text-xs space-y-1">
              <div>
                <span className="text-muted-foreground">Target Email:</span>{' '}
                <strong className="text-foreground">{selectedUser.email}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Current Role:</span>{' '}
                <span className="capitalize font-bold text-[#F26A3D]">{selectedUser.role}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                Select Platform Role <span className="text-[#F26A3D]">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'customer', label: 'Customer', desc: 'Can book services' },
                  { key: 'technician', label: 'Technician', desc: 'Can list services & take jobs' },
                  { key: 'admin', label: 'Admin', desc: 'Full platform privileges' },
                ].map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setTargetRole(r.key as any)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      targetRole === r.key
                        ? 'border-[#F26A3D] bg-[#F26A3D]/10 text-foreground font-bold shadow-2xs'
                        : 'border-border bg-card text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <span className="text-xs font-bold block">{r.label}</span>
                    <span className="text-[10px] text-muted-foreground leading-tight block mt-0.5">
                      {r.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-border/70">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <MotionButton
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isUpdatingRole}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Save Role</span>
              </MotionButton>
            </div>
          </form>
        </Dialog>
      )}
    </DashboardShell>
  );
}
