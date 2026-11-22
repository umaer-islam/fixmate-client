'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { api } from '@/lib/api-client';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  User,
  Phone,
  MapPin,
  Mail,
  Camera,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export default function SharedProfilePage() {
  const { user, role, refreshProfile } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [specialties, setSpecialties] = useState<string>('');
  const [isAvailable, setIsAvailable] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      try {
        const res = await api.get<any>('/users/profile');
        if (isMounted && res.data) {
          const p = res.data;
          setName(p.name || '');
          setPhone(p.phone || '');
          setArea(p.area || '');
          setAvatarUrl(p.avatarUrl || p.image || '');
          setBio(p.bio || '');
          setSpecialties(Array.isArray(p.specialties) ? p.specialties.join(', ') : '');
          setIsAvailable(p.isAvailable !== false);
        }
      } catch (err) {
        console.error('Failed to load profile details:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image file size must be less than 5MB.');
      return;
    }

    try {
      setIsUploading(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1];
          const res = await api.post<{ url: string }>('/upload/image', {
            image: base64Data,
          });

          if (res.data?.url) {
            setAvatarUrl(res.data.url);
            toast.success('Avatar uploaded successfully!');
          }
        } catch (uploadErr: any) {
          toast.error(uploadErr?.message || 'Failed to upload image.');
        } finally {
          setIsUploading(false);
        }
      };
    } catch (err: any) {
      toast.error('Error reading image file.');
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const payload: any = {
        name: name.trim(),
        phone: phone.trim(),
        area: area.trim(),
        avatarUrl: avatarUrl.trim() || undefined,
        bio: bio.trim() || undefined,
      };

      if (role === 'technician') {
        payload.isAvailable = isAvailable;
        if (specialties.trim()) {
          payload.specialties = specialties
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }

      await api.patch('/users/profile', payload);
      await refreshProfile();
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardShell
      allowedRoles={['customer', 'technician', 'admin']}
      title="Profile & Contact Information"
      description="Manage your account identity, contact channels, and technician credentials across FixMate."
    >
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-graphite/10 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-graphite/10">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-ivory border-2 border-graphite/10 flex items-center justify-center overflow-hidden shadow-xs">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name || 'Avatar'} className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-graphite/40" />
              )}
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-repair-orange text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-repair-orange-dark transition-colors"
              title="Upload new photo"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarFile}
              disabled={isUploading}
            />
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h3 className="font-extrabold text-graphite text-base">{user?.name || 'FixMate Member'}</h3>
            <p className="text-xs text-graphite-light">{user?.email}</p>
            <div className="pt-1 flex items-center gap-2 justify-center sm:justify-start">
              <Badge
                variant={role === 'admin' ? 'danger' : role === 'technician' ? 'warning' : 'primary'}
                className="uppercase text-[10px] font-bold"
              >
                {role}
              </Badge>
              <span className="text-xs text-graphite/40">•</span>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Account
              </span>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-graphite uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 border border-graphite/20 rounded-xl text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-graphite uppercase tracking-wider mb-1">
              Email Address (Read-only)
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-3.5 py-2.5 border border-graphite/10 rounded-xl text-sm bg-ivory text-graphite/50 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-graphite uppercase tracking-wider mb-1">
              Contact Phone
            </label>
            <input
              type="tel"
              placeholder="+1 555-0199 or 01712345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-graphite/20 rounded-xl text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-graphite uppercase tracking-wider mb-1">
              Primary City / Area
            </label>
            <input
              type="text"
              placeholder="e.g. North Seattle, Dhaka Metro, Austin Downtown"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-graphite/20 rounded-xl text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
            />
          </div>
        </div>

        {/* Bio / Experience (All roles can have a bio) */}
        <div>
          <label className="block text-xs font-semibold text-graphite uppercase tracking-wider mb-1">
            Bio / Notes
          </label>
          <textarea
            rows={3}
            placeholder="About you or your service preferences..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-graphite/20 rounded-xl text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
          />
        </div>

        {/* Technician specific fields */}
        {role === 'technician' && (
          <div className="space-y-5 pt-4 border-t border-graphite/10">
            <h4 className="font-bold text-graphite text-sm">Technician Credentials & Work Scope</h4>

            <div>
              <label className="block text-xs font-semibold text-graphite uppercase tracking-wider mb-1">
                Specialties (Comma separated)
              </label>
              <input
                type="text"
                placeholder="Smartphones, Micro-soldering, HVAC, Refrigeration, Laptops"
                value={specialties}
                onChange={(e) => setSpecialties(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-graphite/20 rounded-xl text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-ivory rounded-xl border border-graphite/10">
              <input
                type="checkbox"
                id="availability-toggle-shared"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 text-repair-orange rounded focus:ring-repair-orange"
              />
              <label htmlFor="availability-toggle-shared" className="text-sm font-semibold text-graphite cursor-pointer">
                Actively available to receive new service booking assignments
              </label>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="pt-4 border-t border-graphite/10 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-repair-orange hover:bg-repair-orange-dark text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </DashboardShell>
  );
}
