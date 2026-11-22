'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { useAuth } from '@/providers/auth-provider';
import { BookingModal } from '@/components/booking/booking-modal';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Wrench,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle,
  ArrowLeft,
  Calendar,
  AlertCircle,
  Star,
  Sparkles,
  Info,
} from 'lucide-react';

interface ServiceDetail {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea?: string;
  turnaroundTime?: string;
  isAvailable: boolean;
  approvalStatus: string;
  technicianId: string;
  technicianName?: string;
  createdAt: string;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, role, isAuthenticated } = useAuth();

  const serviceId = params?.id as string;
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    if (!serviceId) return;

    let isMounted = true;
    const fetchService = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await api.get<ServiceDetail>(`/services/${serviceId}`);
        if (isMounted && res.data) {
          setService(res.data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Failed to load service details.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchService();
    return () => {
      isMounted = false;
    };
  }, [serviceId]);

  const handleBookClick = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/services/${serviceId}`);
      return;
    }
    setIsBookingOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96 w-full rounded-2xl" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div>
              <Skeleton className="h-80 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-[70vh] bg-ivory flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-sm border border-graphite/10">
          <AlertCircle className="w-12 h-12 text-repair-orange mx-auto mb-4" />
          <h2 className="text-xl font-bold text-graphite mb-2">Service Not Available</h2>
          <p className="text-graphite-light text-sm mb-6">
            {error || 'The requested repair service could not be found or is no longer listed.'}
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-graphite text-white rounded-lg text-sm font-semibold hover:bg-graphite/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse All Services</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-graphite-light mb-6">
          <Link href="/" className="hover:text-graphite transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/services" className="hover:text-graphite transition-colors">
            Services
          </Link>
          <span>/</span>
          <span className="text-graphite font-medium truncate max-w-xs">{service.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image Card */}
            <div className="relative rounded-2xl overflow-hidden bg-white border border-graphite/10 shadow-sm aspect-video md:aspect-[16/9]">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <Badge variant="primary" className="text-xs uppercase tracking-wider font-semibold">
                  {service.category}
                </Badge>
                <Badge
                  variant={service.serviceMode.toLowerCase().includes('visit') || service.serviceMode === 'onsite' ? 'info' : 'warning'}
                  className="capitalize font-semibold text-xs"
                >
                  {service.serviceMode}
                </Badge>
              </div>

              {!service.isAvailable && (
                <div className="absolute inset-0 bg-graphite/60 backdrop-blur-xs flex items-center justify-center">
                  <span className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold tracking-wide uppercase text-sm">
                    Currently Unavailable
                  </span>
                </div>
              )}
            </div>

            {/* Title & Metadata */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-graphite/10 shadow-sm space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-repair-orange uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>FixMate Certified Service</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-graphite tracking-tight">
                  {service.title}
                </h1>
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-ivory border border-graphite/10">
                <div>
                  <span className="text-xs font-medium text-graphite-light block mb-1">Standard Duration</span>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-graphite">
                    <Clock className="w-4 h-4 text-repair-orange" />
                    <span>{service.estimatedDuration}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-medium text-graphite-light block mb-1">Service Coverage</span>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-graphite">
                    <MapPin className="w-4 h-4 text-repair-orange" />
                    <span>{service.serviceArea || 'Metro & Suburbs'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-medium text-graphite-light block mb-1">Turnaround Time</span>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-graphite">
                    <Calendar className="w-4 h-4 text-repair-orange" />
                    <span>{service.turnaroundTime || 'Same Day / 24h'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-medium text-graphite-light block mb-1">Warranty Guarantee</span>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-graphite">
                    <ShieldCheck className="w-4 h-4 text-repair-orange" />
                    <span>90-Day Guarantee</span>
                  </div>
                </div>
              </div>

              {/* Service Description */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-graphite">Service Overview</h2>
                <div className="text-graphite-light text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {service.description}
                </div>
              </div>

              {/* Service Standards Breakdown */}
              <div className="space-y-4 pt-4 border-t border-graphite/10">
                <h2 className="text-lg font-bold text-graphite">What&apos;s Included With Every Repair</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Full diagnostic hardware & component analysis',
                    'Genuine OEM or top-grade replacement parts',
                    'Pre-delivery functional calibration test',
                    '90-day comprehensive repair warranty',
                    'Transparent quote with zero hidden surcharges',
                    'Secure post-service digital payment via Stripe',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-graphite">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Technician Credentials Info Card */}
            <div className="bg-white rounded-2xl p-6 border border-graphite/10 shadow-sm flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-repair-orange/10 border border-repair-orange/20 flex items-center justify-center text-repair-orange font-bold text-lg">
                  {service.technicianName ? service.technicianName.charAt(0).toUpperCase() : 'T'}
                </div>
                <div>
                  <h3 className="font-bold text-graphite text-base">
                    {service.technicianName || 'Certified FixMate Pro Technician'}
                  </h3>
                  <p className="text-xs text-graphite-light flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Background verified & skill certified
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-graphite-light bg-ivory px-3 py-1.5 rounded-lg border border-graphite/10">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-bold text-graphite">4.9 / 5.0</span>
                <span>(verified customer rating)</span>
              </div>
            </div>
          </div>

          {/* Right Column / Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl p-6 border border-graphite/10 shadow-md space-y-6">
              <div>
                <span className="text-xs font-semibold text-graphite-light uppercase tracking-wider block mb-1">
                  Base Service Price
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-graphite">
                    ${service.basePrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-graphite-light font-medium">starting price</span>
                </div>
                <p className="text-xs text-graphite-light mt-1">
                  Final price confirmed after on-site diagnostic if hardware replacement is required.
                </p>
              </div>

              {/* Status Indicator */}
              <div className="p-3 rounded-xl bg-ivory border border-graphite/10 flex items-center gap-3">
                <span
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    service.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                  }`}
                />
                <div className="text-xs">
                  <p className="font-bold text-graphite">
                    {service.isAvailable ? 'Technician Available Now' : 'Currently Unavailable'}
                  </p>
                  <p className="text-graphite-light">
                    {service.isAvailable
                      ? 'Accepting bookings for upcoming dates'
                      : 'Check back soon or explore other pros'}
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <button
                type="button"
                onClick={handleBookClick}
                disabled={!service.isAvailable}
                className="w-full py-3.5 px-6 bg-repair-orange hover:bg-repair-orange-dark text-white rounded-xl text-base font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Calendar className="w-5 h-5" />
                <span>{service.isAvailable ? 'Book This Repair' : 'Service Unavailable'}</span>
              </button>

              {/* Customer Guarantee Perks */}
              <div className="space-y-3 pt-4 border-t border-graphite/10 text-xs text-graphite-light">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>FixMate 90-day parts & labor guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Pay securely with Stripe only after repair completion</span>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-repair-orange flex-shrink-0" />
                  <span>Free cancellation while booking is in requested state</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Dialog Modal */}
      <BookingModal
        service={{
          _id: service._id,
          title: service.title,
          category: service.category,
          basePrice: service.basePrice,
          estimatedDuration: service.estimatedDuration,
          serviceMode: service.serviceMode,
          technicianName: service.technicianName,
        }}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSuccess={(bookingId) => {
          router.push(`/dashboard/customer/bookings/${bookingId}`);
        }}
      />
    </div>
  );
}
