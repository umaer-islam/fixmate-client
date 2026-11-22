'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { api } from '@/lib/api-client';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { MotionButton } from '@/components/motion/motion-button';
import { Badge } from '@/components/ui/badge';
import { BrandSelect } from '@/components/ui/dropdown';
import { toast } from 'sonner';
import {
  Wrench,
  UploadCloud,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Camera,
  Eye,
  Clock,
  Sparkles,
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

const SERVICE_MODES = [
  { value: 'onsite', label: 'Home / On-site Visit' },
  { value: 'remote', label: 'Shop Drop-off / Remote' },
  { value: 'both', label: 'Both (On-site & Drop-off)' },
];

export default function NewServicePage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [serviceMode, setServiceMode] = useState<string>('onsite');
  const [serviceArea, setServiceArea] = useState('');
  const [turnaroundTime, setTurnaroundTime] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      await api.post('/technician/services', {
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

      toast.success('Service created successfully! Pending admin approval.');
      router.push('/dashboard/technician/services');
    } catch (err: any) {
      setError(err?.message || 'Failed to create service.');
      toast.error(err?.message || 'Failed to create service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardShell
      allowedRoles={['technician', 'admin']}
      title="Create New Repair Service"
      description="List a new technical repair offering. Submissions are reviewed by FixMate admins to ensure quality standards."
      action={
        <Link
          href="/dashboard/technician/services"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-muted-foreground hover:text-foreground bg-card border border-border rounded-xl transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Container (2 cols on lg) */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-card rounded-3xl border border-border/80 p-6 sm:p-8 shadow-xs space-y-6"
        >
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-[#202522] text-sm tracking-tight">Service Details</h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                Service Title <span className="text-[#F26A3D]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. iPhone Screen & Battery Replacement, Commercial Refrigerator Diagnostics"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30 focus:border-[#F26A3D]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BrandSelect
                label="Category *"
                value={category}
                onChange={setCategory}
                options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
                placeholder="Select category"
              />

              <BrandSelect
                label="Service Mode *"
                value={serviceMode}
                onChange={setServiceMode}
                options={SERVICE_MODES}
                placeholder="Select mode"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                Description & Scope <span className="text-[#F26A3D]">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Detailed breakdown of diagnostics, genuine parts used, warranties, and scope of work..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30 focus:border-[#F26A3D]"
              />
            </div>
          </div>

          {/* Image Upload Banner */}
          <div className="space-y-3 pt-4 border-t border-border/70">
            <h3 className="font-extrabold text-[#202522] text-sm tracking-tight">Banner Image</h3>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="w-32 h-24 rounded-2xl bg-muted border border-border overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="service-image-file"
                    className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-2"
                  >
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#F26A3D]" />
                    ) : (
                      <UploadCloud className="w-4 h-4 text-[#F26A3D]" />
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
                  <span className="text-xs text-muted-foreground">or paste image URL below</span>
                </div>

                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 border border-border rounded-xl text-xs text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30 focus:border-[#F26A3D]"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Duration */}
          <div className="space-y-4 pt-4 border-t border-border/70">
            <h3 className="font-extrabold text-[#202522] text-sm tracking-tight">Pricing & Service SLA</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                  Base Price ($ USD) <span className="text-[#F26A3D]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-muted-foreground font-bold text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="49.00"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    required
                    className="w-full pl-8 pr-3.5 py-2.5 border border-border rounded-xl text-sm font-bold text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30 focus:border-[#F26A3D]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                  Estimated Duration <span className="text-[#F26A3D]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1-2 hours, Same Day"
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30 focus:border-[#F26A3D]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                  Service Area / Coverage Radius
                </label>
                <input
                  type="text"
                  placeholder="e.g. Downtown & Within 15 miles"
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30 focus:border-[#F26A3D]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                  Turnaround SLA
                </label>
                <input
                  type="text"
                  placeholder="e.g. 24-48 hours, Next Business Day"
                  value={turnaroundTime}
                  onChange={(e) => setTurnaroundTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30 focus:border-[#F26A3D]"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-border/70 flex items-center justify-end gap-3">
            <Link
              href="/dashboard/technician/services"
              className="px-4 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </Link>
            <MotionButton
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish Service for Review</span>
            </MotionButton>
          </div>
        </form>

        {/* Live Card Preview Column (1 col on lg) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <Eye className="w-3.5 h-3.5 text-[#F26A3D]" />
            <span>Customer Catalog Preview</span>
          </div>

          <div className="sticky top-24 bg-card rounded-3xl border border-border/80 overflow-hidden shadow-xs">
            <div className="relative aspect-16/9 bg-muted overflow-hidden">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt="Service preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2 p-4 text-center">
                  <Wrench className="w-8 h-8 text-muted-foreground/60" />
                  <span className="text-xs">Upload an image to see live preview</span>
                </div>
              )}
              <div className="absolute top-3 left-3">
                <Badge variant="orange" className="text-[10px] uppercase font-bold tracking-wider">
                  {category}
                </Badge>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <div className="space-y-1">
                <h4 className="font-extrabold text-[#202522] text-base line-clamp-1">
                  {title || 'Service Title Preview'}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {description || 'Provide a detailed scope of work to help customers understand what this repair includes.'}
                </p>
              </div>

              <div className="pt-3 border-t border-border/70 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Starting From
                  </span>
                  <span className="text-xl font-black text-[#202522] font-mono">
                    ${basePrice ? parseFloat(basePrice).toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" />
                    {estimatedDuration || '1-2 hrs'}
                  </span>
                  <span className="text-[10px] font-bold text-[#F26A3D] uppercase tracking-wider block mt-0.5">
                    {serviceMode}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
