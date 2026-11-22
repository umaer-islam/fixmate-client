'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api-client';
import { useAuth } from '@/providers/auth-provider';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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

  return (
    <DashboardShell
      allowedRoles={['admin']}
      title="User Directory & Authorization"
      description="Inspect registered customer accounts, verify technician profiles, and manage system roles."
    >
      {/* Top Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-graphite/10 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Role Filters */}
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          {[
            { key: 'all', label: `All Users (${users.length})` },
            { key: 'customer', label: `Customers (${users.filter((u) => u.role === 'customer').length})` },
            { key: 'technician', label: `Technicians (${users.filter((u) => u.role === 'technician').length})` },
            { key: 'admin', label: `Admins (${users.filter((u) => u.role === 'admin').length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setRoleFilter(tab.key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                roleFilter === tab.key
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
            placeholder="Search by name, email, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-graphite/10 rounded-xl text-xs text-graphite focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-graphite/10 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Users className="w-12 h-12 text-graphite-light mx-auto" />
            <h3 className="font-bold text-graphite text-base">No Users Found</h3>
            <p className="text-xs text-graphite-light">No records match your filter or search query.</p>
          </div>
        ) : (
          <div className="divide-y divide-graphite/10">
            {filteredUsers.map((u) => (
              <div
                key={u._id}
                className="p-5 hover:bg-ivory/50 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                {/* User Info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-repair-orange/10 border border-repair-orange/20 flex items-center justify-center font-bold text-repair-orange text-base flex-shrink-0">
                    {u.avatarUrl || u.image ? (
                      <img
                        src={u.avatarUrl || u.image}
                        alt={u.name || u.email}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : u.name ? (
                      u.name.charAt(0).toUpperCase()
                    ) : (
                      'U'
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-graphite text-sm">{u.name || 'Unnamed User'}</h3>
                      <Badge
                        variant={u.role === 'admin' ? 'danger' : u.role === 'technician' ? 'warning' : 'primary'}
                        className="text-[10px] uppercase font-bold"
                      >
                        {u.role}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-graphite-light flex-wrap">
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
                <div className="self-end sm:self-center">
                  <button
                    onClick={() => handleOpenRoleModal(u)}
                    className="px-3 py-1.5 bg-ivory hover:bg-white text-graphite border border-graphite/20 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <UserCog className="w-3.5 h-3.5 text-repair-orange" />
                    <span>Change Role</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Role Modification Modal */}
      {selectedUser && (
        <Dialog isOpen={Boolean(selectedUser)} onClose={() => setSelectedUser(null)}>
          <DialogHeader>
            <DialogTitle>Modify User Access Role</DialogTitle>
            <DialogDescription>
              Assign new platform privileges to <span className="font-bold text-graphite">{selectedUser.name || selectedUser.email}</span>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmRoleChange} className="p-6 space-y-4">
            <div className="p-3 bg-ivory rounded-xl border border-graphite/10 text-xs text-graphite space-y-1">
              <div>
                Email: <strong>{selectedUser.email}</strong>
              </div>
              <div>
                Current Role: <span className="capitalize font-bold text-repair-orange">{selectedUser.role}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-graphite uppercase tracking-wider mb-2">
                New Platform Role
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'customer', title: 'Customer', desc: 'Browse & book services' },
                  { key: 'technician', title: 'Technician', desc: 'Create & service jobs' },
                  { key: 'admin', title: 'Admin', desc: 'Platform supervision' },
                ].map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setTargetRole(r.key as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      targetRole === r.key
                        ? 'border-repair-orange bg-repair-orange/5 ring-2 ring-repair-orange/20'
                        : 'border-graphite/10 hover:border-graphite/30'
                    }`}
                  >
                    <span className="font-bold text-xs text-graphite block">{r.title}</span>
                    <span className="text-[10px] text-graphite-light mt-0.5 block">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-graphite/10">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 text-xs font-bold text-graphite/70 hover:text-graphite"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdatingRole}
                className="px-5 py-2.5 bg-repair-orange hover:bg-repair-orange-dark text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                {isUpdatingRole ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Confirm Role Change</span>
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
