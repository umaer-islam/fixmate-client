'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Wrench,
  UploadCloud,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Camera,
} from 'lucide-react';

const CATEGORIES = [
  'Smartphone',
  'Laptop & PC',
  'AC',
  'Refrigerator',
  'TV',
  'Washing Machine',
  'Electrical',
];

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params?.id as string;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [serviceMode, setServiceMode] = useState<string>('Home Visit');
  const [serviceArea, setServiceArea] = useState('');
  const [turnaroundTime, setTurnaroundTime] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceId) return;

    let isMounted = true;
    const fetchService = async () => {
      try {
        setIsLoading(true);
        const res = await api.get<any>(`/services/${serviceId}`);
        if (isMounted && res.data) {
          const s = res.data;
          setTitle(s.title || '');
          setCategory(s.category || CATEGORIES[0]);
          setDescription(s.description || '');
          setImage(s.image || '');
          setBasePrice(s.basePrice ? s.basePrice.toString() : '');
          setEstimatedDuration(s.estimatedDuration || '');
          setServiceMode(s.serviceMode || 'onsite');
          setServiceArea(s.serviceArea || '');
          setTurnaroundTime(s.turnaroundTime || '');
        }
      } catch (err: any) {
        if (isMounted) setError(err?.message || 'Failed to load service.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchService();
    return () => {
      isMounted = false;
    };
  }, [serviceId]);

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WebP).');
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
            setImage(res.data.url);
            toast.success('Service image uploaded successfully!');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const price = parseFloat(basePrice);
    if (isNaN(price) || price < 0) {
      setError('Please provide a valid non-negative base price.');
      return;
    }

    if (!image.trim()) {
      setError('Please upload or specify a valid service banner image URL.');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.patch(`/technician/services/${serviceId}`, {
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        image: image.trim(),
        basePrice: price,
        estimatedDuration: estimatedDuration.trim(),
        serviceMode,
        serviceArea: serviceArea.trim() || undefined,
        turnaroundTime: turnaroundTime.trim() || undefined,
      });

      toast.success('Service updated successfully! Changes submitted for review.');
      router.push('/dashboard/technician/services');
    } catch (err: any) {
      setError(err?.message || 'Failed to update service.');
      toast.error(err?.message || 'Failed to update service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardShell allowedRoles={['technician', 'admin']} title="Edit Service">
        <Skeleton className="h-96 w-full rounded-2xl" />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      allowedRoles={['technician', 'admin']}
      title="Edit Repair Service"
      description={`Update specifications, base fee, or turnaround time for ${title || 'this service'}.`}
      action={
        <Link
          href="/dashboard/technician/services"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-graphite/70 hover:text-graphite bg-white border border-graphite/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-graphite/10 p-6 sm:p-8 shadow-xs space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="font-extrabold text-graphite text-sm">Service Details</h3>

          <div>
            <label className="block text-xs font-bold text-graphite uppercase tracking-wider mb-1">
              Service Title <span className="text-repair-orange">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 border border-graphite/20 rounded-xl text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-graphite uppercase tracking-wider mb-1">
                Category <span className="text-repair-orange">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-graphite/20 rounded-xl text-sm text-graphite bg-white focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-graphite uppercase tracking-wider mb-1">
                Service Mode <span className="text-repair-orange">*</span>
              </label>
              <select
                value={serviceMode}
                onChange={(e) => setServiceMode(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-graphite/20 rounded-xl text-sm text-graphite bg-white focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
              >
                <option value="Home Visit">Home Visit</option>
                <option value="Shop Drop-off">Shop Drop-off</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-graphite uppercase tracking-wider mb-1">
              Description & Scope <span className="text-repair-orange">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 border border-graphite/20 rounded-xl text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
            />
          </div>
        </div>

        {/* Banner Image */}
        <div className="space-y-3 pt-4 border-t border-graphite/10">
          <h3 className="font-extrabold text-graphite text-sm">Banner Image</h3>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="w-32 h-24 rounded-xl bg-ivory border border-graphite/10 overflow-hidden flex items-center justify-center flex-shrink-0">
              {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-8 h-8 text-graphite/30" />
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <label
                  htmlFor="service-image-file"
                  className="px-4 py-2 bg-ivory hover:bg-white text-graphite border border-graphite/20 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-2"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-repair-orange" />
                  ) : (
                    <UploadCloud className="w-4 h-4 text-repair-orange" />
                  )}
                  <span>Upload Image File</span>
                </label>
                <input
                  id="service-image-file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageFile}
                  disabled={isUploading}
                />
                <span className="text-xs text-graphite-light">or update URL below</span>
              </div>

              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
                className="w-full px-3.5 py-2 border border-graphite/20 rounded-xl text-xs text-graphite focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Duration */}
        <div className="space-y-4 pt-4 border-t border-graphite/10">
          <h3 className="font-extrabold text-graphite text-sm">Pricing & Service SLA</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-graphite uppercase tracking-wider mb-1">
                Base Price ($ USD) <span className="text-repair-orange">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-graphite/50 font-bold text-sm">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  required
                  className="w-full pl-8 pr-3.5 py-2.5 border border-graphite/20 rounded-xl text-sm font-bold text-graphite focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-graphite uppercase tracking-wider mb-1">
                Estimated Duration <span className="text-repair-orange">*</span>
              </label>
              <input
                type="text"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-graphite/20 rounded-xl text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-graphite uppercase tracking-wider mb-1">
                Service Area / Radius
              </label>
              <input
                type="text"
                value={serviceArea}
                onChange={(e) => setServiceArea(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-graphite/20 rounded-xl text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-graphite uppercase tracking-wider mb-1">
                Turnaround Time
              </label>
              <input
                type="text"
                value={turnaroundTime}
                onChange={(e) => setTurnaroundTime(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-graphite/20 rounded-xl text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-graphite/10 flex items-center justify-end gap-3">
          <Link
            href="/dashboard/technician/services"
            className="px-4 py-2.5 text-xs font-bold text-graphite/70 hover:text-graphite transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-repair-orange hover:bg-repair-orange-dark text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </DashboardShell>
  );
}
