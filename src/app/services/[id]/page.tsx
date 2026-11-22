'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { api } from '@/lib/api-client';
import { useAuth } from '@/providers/auth-provider';
import { BookingModal } from '@/components/booking/booking-modal';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { FadeIn } from '@/components/motion/fade-in';
import { MotionButton } from '@/components/motion/motion-button';
import { toast } from 'sonner';
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
  Lock,
  ChevronRight,
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
    if (role && role !== 'customer') {
      toast.error('Only Customer accounts can book repair services.');
      return;
    }
    setIsBookingOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F3EE]">
        <Navbar />
        <main className="flex-1 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-6 w-48 mb-6 rounded-lg" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-96 w-full rounded-3xl" />
                <Skeleton className="h-10 w-3/4 rounded-xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
              </div>
              <div>
                <Skeleton className="h-80 w-full rounded-3xl" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F3EE]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full text-center bg-card p-8 rounded-3xl shadow-sm border border-border space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-[#F26A3D] mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Service Not Available</h2>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {error || 'The requested repair service could not be found or is no longer listed.'}
            </p>
            <Link href="/services">
              <MotionButton variant="graphite" size="sm" className="mt-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Browse All Services</span>
              </MotionButton>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F3EE]">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <FadeIn direction="down">
            <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6 font-medium">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/services" className="hover:text-foreground transition-colors">
                Services
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-bold truncate max-w-xs">{service.title}</span>
            </nav>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Image Card */}
              <FadeIn direction="up">
                <div className="relative rounded-3xl overflow-hidden bg-card border border-border shadow-xs aspect-video md:aspect-[16/9]">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                    <Badge variant="default" className="text-xs uppercase tracking-wider font-bold bg-[#202522]/90 backdrop-blur-xs text-white">
                      {service.category}
                    </Badge>
                    <Badge variant="sage" className="capitalize font-bold text-xs shadow-xs">
                      {service.serviceMode}
                    </Badge>
                  </div>

                  {!service.isAvailable && (
                    <div className="absolute inset-0 bg-[#202522]/70 backdrop-blur-xs flex items-center justify-center">
                      <span className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold tracking-wide uppercase text-xs shadow-md">
                        Currently Unavailable
                      </span>
                    </div>
                  )}
                </div>
              </FadeIn>

              {/* Title & Metadata */}
              <FadeIn direction="up" delay={0.1}>
                <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-xs space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#F26A3D] uppercase tracking-wider mb-2">
                      <Sparkles className="w-4 h-4" />
                      <span>FixMate Certified Service Specification</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#202522] tracking-tight font-heading">
                      {service.title}
                    </h1>
                  </div>

                  {/* Quick Specs Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-muted/40 border border-border/70">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-muted-foreground block mb-1">
                        Est. Duration
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <Clock className="w-4 h-4 text-[#F26A3D]" />
                        <span>{service.estimatedDuration}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase text-muted-foreground block mb-1">
                        Service Area
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <MapPin className="w-4 h-4 text-[#F26A3D]" />
                        <span className="truncate">{service.serviceArea || 'Metro & Suburbs'}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase text-muted-foreground block mb-1">
                        Turnaround
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <Calendar className="w-4 h-4 text-[#F26A3D]" />
                        <span>{service.turnaroundTime || '24h Standard'}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase text-muted-foreground block mb-1">
                        Warranty
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>90-Day Coverage</span>
                      </div>
                    </div>
                  </div>

                  {/* Service Description */}
                  <div className="space-y-3">
                    <h2 className="text-base font-bold text-[#202522]">Service Overview</h2>
                    <div className="text-muted-foreground text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                      {service.description}
                    </div>
                  </div>

                  {/* Service Standards Breakdown */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <h2 className="text-base font-bold text-[#202522]">What&apos;s Included With Every Repair</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        'Comprehensive diagnostic hardware & circuit analysis',
                        'Genuine OEM or certified replacement components',
                        'Post-repair stress testing & calibration inspection',
                        '90-day parts & workmanship warranty coverage',
                        'Authoritative quote with zero upfront charge',
                        'Direct post-repair Stripe digital receipt',
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-foreground font-medium">
                          <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Technician Credentials Info Card */}
              <FadeIn direction="up" delay={0.2}>
                <div className="bg-card rounded-3xl p-6 border border-border shadow-xs flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#202522] text-[#F26A3D] flex items-center justify-center font-bold text-lg shadow-xs">
                      {service.technicianName ? service.technicianName.charAt(0).toUpperCase() : 'T'}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-base">
                        {service.technicianName || 'Certified FixMate Specialist'}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Verified background & certified technician
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-foreground bg-muted/60 px-3.5 py-1.5 rounded-xl border border-border/80">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-bold">4.9 / 5.0</span>
                    <span className="text-muted-foreground font-normal">(Verified Rating)</span>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right Column / Sticky Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-3xl p-6 border border-border shadow-md space-y-6">
                <div>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                    Base Service Price
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-[#202522]">
                      ${service.basePrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">starting price</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                    Authoritative base fee. Final price established upon on-site diagnosis before any replacement components are installed.
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="p-3.5 rounded-2xl bg-muted/50 border border-border flex items-center gap-3">
                  <span
                    className={`w-3 h-3 rounded-full shrink-0 ${
                      service.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                    }`}
                  />
                  <div className="text-xs">
                    <p className="font-bold text-foreground">
                      {service.isAvailable ? 'Technician Available Now' : 'Currently Unavailable'}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {service.isAvailable
                        ? 'Accepting bookings for upcoming dates'
                        : 'Check back soon or explore other pros'}
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <MotionButton
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={handleBookClick}
                  disabled={
                    !service.isAvailable ||
                    (!!user?.id && user.id === service.technicianId) ||
                    (isAuthenticated && role !== 'customer')
                  }
                  className="w-full text-sm font-bold shadow-md"
                >
                  <Calendar className="w-4 h-4" />
                  <span>
                    {!service.isAvailable
                      ? 'Service Unavailable'
                      : user?.id && user.id === service.technicianId
                      ? 'Your Own Service'
                      : isAuthenticated && role === 'technician'
                      ? 'Technicians Cannot Book'
                      : isAuthenticated && role === 'admin'
                      ? 'Admins Cannot Book'
                      : 'Book This Repair'}
                  </span>
                </MotionButton>

                {isAuthenticated && role !== 'customer' && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
                    <p className="font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      Only Customers Can Book Services
                    </p>
                    <p className="text-[11px] mt-1 text-muted-foreground leading-relaxed">
                      You are currently signed in as a <span className="font-semibold capitalize text-foreground">{role}</span>. Booking repair appointments is reserved exclusively for customer accounts.
                    </p>
                  </div>
                )}

                {/* Customer Guarantee Perks */}
                <div className="space-y-3 pt-4 border-t border-border text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>FixMate 90-day parts & labor guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Pay securely with Stripe only after completion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#F26A3D] shrink-0" />
                    <span>Zero upfront fee • Free cancellation while requested</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

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

      <Footer />
    </div>
  );
}
