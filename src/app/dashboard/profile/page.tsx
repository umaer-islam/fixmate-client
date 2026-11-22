'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '@/providers/auth-provider';
import { api } from '@/lib/api-client';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Badge } from '@/components/ui/badge';
import { MotionButton } from '@/components/motion/motion-button';
import { buttonTapSpring } from '@/lib/motion/tokens';
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
  Sparkles,
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

          const uploadedUrl = res.data?.url || (res as any)?.url || (res as any)?.display_url;
          if (uploadedUrl) {
            setAvatarUrl(uploadedUrl);
            toast.success('Avatar uploaded successfully!');
          } else {
            toast.error('Failed to parse uploaded image.');
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
      <form onSubmit={handleSave} className="bg-card rounded-3xl border border-border/80 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border/70">
          <div className="relative group">
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="w-24 h-24 rounded-full bg-muted border-2 border-border flex items-center justify-center overflow-hidden shadow-xs"
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt={name || 'Avatar'} className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-muted-foreground" />
              )}
            </motion.div>
            <motion.label
              whileHover={{ scale: 1.1 }}
              whileTap={buttonTapSpring}
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#F26A3D] text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-[#F26A3D]/90 transition-colors"
              title="Upload new photo"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            </motion.label>
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
            <h3 className="font-extrabold text-foreground text-base">{user?.name || 'FixMate Member'}</h3>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            <div className="pt-1 flex items-center gap-2 justify-center sm:justify-start">
              <Badge
                variant={role === 'admin' ? 'default' : role === 'technician' ? 'orange' : 'sage'}
                className="uppercase text-[10px] font-bold"
              >
                {role}
              </Badge>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Account
              </span>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 border border-input rounded-xl text-xs sm:text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
              Email Address (Read-only)
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-3.5 py-2.5 border border-border rounded-xl text-xs sm:text-sm bg-muted/60 text-muted-foreground cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
              Contact Phone
            </label>
            <input
              type="tel"
              placeholder="+1 555-0199 or 01712345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-input rounded-xl text-xs sm:text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
              Primary City / Service Area
            </label>
            <input
              type="text"
              placeholder="e.g. North Seattle, Dhaka Metro, Austin Downtown"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-input rounded-xl text-xs sm:text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30"
            />
          </div>
        </div>

        {/* Bio / Experience */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
            Bio / Service Experience
          </label>
          <textarea
            rows={3}
            placeholder="Tell customers or technicians about your technical specialties or repair preferences..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-input rounded-xl text-xs sm:text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30"
          />
        </div>

        {/* Technician specific fields */}
        {role === 'technician' && (
          <div className="space-y-5 pt-4 border-t border-border">
            <h4 className="font-bold text-foreground text-sm font-heading">Technician Credentials & Work Scope</h4>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                Specialties (Comma separated)
              </label>
              <input
                type="text"
                placeholder="Smartphones, Micro-soldering, HVAC, Refrigeration, Laptops"
                value={specialties}
                onChange={(e) => setSpecialties(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-input rounded-xl text-xs sm:text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30"
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/40 rounded-2xl border border-border/80">
              <input
                type="checkbox"
                id="availability-toggle-shared"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 text-[#F26A3D] rounded-md focus:ring-[#F26A3D] cursor-pointer"
              />
              <label htmlFor="availability-toggle-shared" className="text-xs font-bold text-foreground cursor-pointer select-none">
                Actively available to receive new service booking assignments
              </label>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="pt-4 border-t border-border flex justify-end">
          <MotionButton
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Profile</span>
          </MotionButton>
        </div>
      </form>
    </DashboardShell>
  );
}
