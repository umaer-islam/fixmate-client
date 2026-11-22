'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Wrench,
  Smartphone,
  Laptop,
  Refrigerator,
  Tv,
  Wind,
  Disc,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  ArrowRight,
  Star,
  MapPin,
  ChevronRight,
  Sparkles,
  Lock,
  Award,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';
import { ServiceCard } from '@/components/services/service-card';
import { Hero10 } from '@/components/ui/hero-10';
import { SplitText } from '@/components/motion/split-text';
import { AnimatedCounter } from '@/components/motion/animated-counter';
import { SpotlightCard } from '@/components/motion/spotlight-card';
import { FadeIn } from '@/components/motion/fade-in';
import { StaggerList, StaggerItem } from '@/components/motion/stagger-list';
import { MotionButton } from '@/components/motion/motion-button';
import { buttonTapSpring, cardHoverSpring } from '@/lib/motion/tokens';

interface ServiceItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  serviceMode: string;
  basePrice: number;
  estimatedDuration: string;
  image: string;
  technicianName: string;
  serviceArea?: string;
}

const CATEGORIES = [
  {
    name: 'Smartphone',
    icon: Smartphone,
    tagline: 'Screen, Battery & Port',
  },
  {
    name: 'Laptop & PC',
    icon: Laptop,
    tagline: 'Logic Board, SSD & RAM',
  },
  {
    name: 'AC',
    icon: Wind,
    tagline: 'Compressor, Gas & PCB',
  },
  {
    name: 'Refrigerator',
    icon: Refrigerator,
    tagline: 'Cooling & Thermostats',
  },
  {
    name: 'TV',
    icon: Tv,
    tagline: 'OLED Panels & Power',
  },
  {
    name: 'Washing Machine',
    icon: Disc,
    tagline: 'Motor, Drum & Drainage',
  },
  {
    name: 'Electrical',
    icon: Zap,
    tagline: 'Wiring & Circuit Breakers',
  },
];

export default function HomePage() {
  const [featuredServices, setFeaturedServices] = useState<ServiceItem[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await api.get('/services?limit=6');
        if (res.success && res.data) {
          setFeaturedServices(res.data);
        }
      } catch (err) {
        console.error('Failed to load featured services', err);
      } finally {
        setLoadingServices(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F3EE]">
      <Navbar />

      <main className="flex-1">
        {/* =================================================================== */}
        {/* HERO SECTION (HERO10 FAN SHOWCASE) */}
        {/* =================================================================== */}
        <Hero10
          badge={
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-bold text-[#202522] shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-[#F26A3D] animate-ping" />
              <span className="flex h-2 w-2 rounded-full bg-[#F26A3D]" />
              <span className="tracking-wide">FixMate Verified Repair Network</span>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <span className="hidden sm:inline text-emerald-600 font-semibold">Zero Upfront Fee</span>
            </div>
          }
          title="Precision Repair for Smart Devices"
          titleLine2Prefix="&"
          titleHighlight="Home Appliances"
          description="Connect with vetted local technicians across smartphones, laptops, AC units, and major household appliances. Inspect the completed repair first, then pay securely through Stripe with an authoritative 90-Day Warranty."
          socialProof="Trusted by 14,800+ completed repairs • 4.9/5.0 Customer Rating • Stripe Escrow Safe"
          images={[
            'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
          ]}
          imageAlts={[
            'Smartphone Screen & Digitizer Calibration',
            'Circuit Board Micro-Soldering & Diagnostics',
            'AC & Major Home Appliance Restoration',
          ]}
          animation="subtle"
          primaryCTA={{
            ctaEnabled: true,
            text: 'Explore Repair Services',
            link: '/services',
            variant: 'primary',
            size: 'lg',
          }}
          secondaryCTA={{
            ctaEnabled: true,
            text: 'Join as Technician',
            link: '/sign-up',
            variant: 'outline',
            size: 'lg',
          }}
        />

        {/* Trust Metrics Bar */}
        <section className="bg-card border-b border-border/80 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#202522]">
                  <AnimatedCounter value={14850} suffix="+" />
                </p>
                <p className="text-xs font-semibold text-muted-foreground mt-0.5">Repairs Completed</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#202522]">
                  <AnimatedCounter value={4.9} decimals={1} suffix=" / 5" />
                </p>
                <p className="text-xs font-semibold text-muted-foreground mt-0.5">Customer Rating</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#202522]">
                  <AnimatedCounter value={100} suffix="%" />
                </p>
                <p className="text-xs font-semibold text-muted-foreground mt-0.5">Stripe Escrow Safe</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-[#F26A3D]">
                  <AnimatedCounter value={90} suffix=" Days" />
                </p>
                <p className="text-xs font-semibold text-muted-foreground mt-0.5">Parts & Labor Warranty</p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* 4-STEP PROCESS SECTION */}
        {/* =================================================================== */}
        <section className="py-20 border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn direction="up">
              <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F26A3D]">
                  Transparent Repair Lifecycle
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202522] font-heading">
                  How FixMate Protects Every Job
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  From initial request to final sign-off, experience a verified repair flow designed for total customer and technician confidence.
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: 'Select & Book',
                  desc: 'Pick your device category and select an approved service with transparent upfront base pricing.',
                  badge: 'Zero Upfront',
                },
                {
                  step: '02',
                  title: 'Technician Confirms',
                  desc: 'A verified local specialist reviews and accepts your request with scheduling confirmation.',
                  badge: 'Vetted Pro',
                },
                {
                  step: '03',
                  title: 'Repair & Test',
                  desc: 'Work is performed on-site or at the workshop. Hardware is tested before final invoice.',
                  badge: 'In-Depth Diagnostic',
                },
                {
                  step: '04',
                  title: 'Pay via Stripe',
                  desc: 'Inspect the resolved repair, then pay securely through Stripe with 90-day warranty coverage.',
                  badge: 'Escrow Protected',
                },
              ].map((item, idx) => (
                <FadeIn key={idx} direction="up" delay={0.1 * idx}>
                  <SpotlightCard className="h-full bg-background p-6 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black text-[#F26A3D]/40">
                        {item.step}
                      </span>
                      <Badge variant="sage" className="text-[10px] font-bold">
                        {item.badge}
                      </Badge>
                    </div>
                    <h3 className="text-base font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </SpotlightCard>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* REPAIR CATEGORIES SPECTRUM (CLEAN & MINIMAL 7-CATEGORY GRID) */}
        {/* =================================================================== */}
        <section className="py-20 border-b border-border bg-[#F5F3EE]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn direction="up">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#202522]/5 px-3 py-1 text-xs font-bold text-[#202522]">
                    <Wrench className="h-3.5 w-3.5 text-[#F26A3D]" />
                    <span>Specialized Hardware Disciplines</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202522] tracking-tight">
                    7 Core Repair Categories
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                    Select your equipment category to browse verified, background-checked technicians with guaranteed turnaround times.
                  </p>
                </div>
                <Link href="/services">
                  <MotionButton variant="outline" size="sm" className="bg-card hover:bg-[#202522] hover:text-white transition-colors">
                    <span>View All Services</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </MotionButton>
                </Link>
              </div>
            </FadeIn>

            {/* Clean, balanced 7-column grid on desktop, 3-4 col on tablet, 2 col on mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
              {CATEGORIES.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <FadeIn key={cat.name} direction="up" delay={0.04 * idx}>
                    <Link
                      href={`/services?category=${encodeURIComponent(cat.name)}`}
                      className="group flex flex-col justify-between h-full rounded-2xl border border-border/80 bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#F26A3D]/40 hover:shadow-md cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#202522]/5 text-[#202522] transition-colors duration-300 group-hover:bg-[#F26A3D] group-hover:text-white">
                            <Icon className="h-5 w-5" />
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground/30 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-[#F26A3D]" />
                        </div>
                        <h3 className="text-sm font-bold text-[#202522] group-hover:text-[#F26A3D] transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                          {cat.tagline}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border/40 flex items-center text-[10px] font-bold text-[#F26A3D] group-hover:underline">
                        <span>Browse Repairs</span>
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </div>
                    </Link>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* FEATURED SERVICES (DYNAMIC CATALOG) */}
        {/* =================================================================== */}
        <section className="py-20 border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn direction="up">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F26A3D]">
                    Top Rated & Vetted
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202522] font-heading mt-1">
                    Featured Repair Services
                  </h2>
                </div>
                <Link href="/services">
                  <MotionButton variant="graphite" size="sm">
                    <span>Explore Full Directory</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </MotionButton>
                </Link>
              </div>
            </FadeIn>

            {loadingServices ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl border border-border p-4 space-y-3 bg-background">
                    <Skeleton className="h-48 w-full rounded-xl" />
                    <Skeleton className="h-6 w-3/4 rounded-lg" />
                    <Skeleton className="h-4 w-1/2 rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </div>
                ))}
              </div>
            ) : featuredServices.length > 0 ? (
              <StaggerList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredServices.map((service) => (
                  <StaggerItem key={service._id}>
                    <ServiceCard service={service} />
                  </StaggerItem>
                ))}
              </StaggerList>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3">
                <Wrench className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-sm font-bold text-foreground">No approved services yet.</p>
                <p className="text-xs text-muted-foreground">
                  Technicians can list services from their dashboard for administrator approval.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* =================================================================== */}
        {/* TRUST & 90-DAY WARRANTY SECTION */}
        {/* =================================================================== */}
        <section className="py-20 border-b border-border bg-[#F5F3EE]/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-border/80 bg-card p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  <Award className="h-4 w-4" />
                  <span>FixMate Ironclad Repair Guarantee</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#202522] font-heading">
                  90-Day Parts & Labor Warranty Included on All Paid Jobs
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Every settled repair carries a 90-day guarantee against recurrence of the diagnosed defect. If your device exhibits the same issue within three months, your technician will re-inspect and remediate at no additional diagnostic fee.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    100% Genuine Tested Components
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <Lock className="h-4 w-4 text-emerald-600" />
                    Stripe PCI-DSS Escrow Protection
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Identity-Verified Technicians
                  </span>
                </div>
              </div>

              <div className="lg:col-span-4 flex justify-center">
                <div className="flex h-36 w-36 flex-col items-center justify-center rounded-3xl bg-[#202522] text-white p-4 shadow-xl text-center space-y-1">
                  <Award className="h-8 w-8 text-[#F26A3D]" />
                  <span className="text-2xl font-black">90 DAYS</span>
                  <span className="text-[10px] text-white/70 uppercase tracking-widest font-bold">WARRANTY</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* CALL TO ACTION (REACT BITS CLEAN, MINIMAL & ANIMATED REDESIGN) */}
        {/* =================================================================== */}
        <section className="py-20 sm:py-28 bg-[#F5F3EE] relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <FadeIn direction="up">
              <SpotlightCard
                spotlightColor="rgba(242, 106, 61, 0.16)"
                className="relative rounded-3xl border border-white/10 bg-[#161A18] text-white p-8 sm:p-14 lg:p-16 overflow-hidden shadow-2xl text-center"
              >
                {/* Ambient React Bits Glowing Background Orbs */}
                <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-[#F26A3D]/25 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />

                {/* Subtle Geometric Dot Grid Pattern */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                    backgroundSize: '24px 24px',
                  }}
                />

                <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                  {/* Shimmer Pill Badge */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="inline-flex items-center gap-2 rounded-full border border-[#F26A3D]/30 bg-[#F26A3D]/10 px-4 py-1.5 text-xs font-bold text-[#F26A3D] backdrop-blur-md cursor-default"
                  >
                    <Sparkles className="h-3.5 w-3.5 animate-spin text-[#F26A3D]" style={{ animationDuration: '8s' }} />
                    <span className="tracking-wide">Get Started Today</span>
                    <span className="text-white/30">•</span>
                    <span className="text-emerald-400 font-semibold">100% Risk Free</span>
                  </motion.div>

                  {/* Headline with High-Contrast Typography & Brand Gradient */}
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-white tracking-tight leading-[1.12]">
                    Ready to Repair Your Device with{' '}
                    <span className="bg-gradient-to-r from-[#F26A3D] via-[#FF9266] to-[#F26A3D] bg-clip-text text-transparent">
                      Zero Risk
                    </span>
                    ?
                  </h2>

                  {/* Clean Subtitle */}
                  <p className="text-xs sm:text-sm text-white/75 max-w-xl mx-auto leading-relaxed">
                    Join over 14,800 device owners who trust FixMate for transparent pricing, certified on-site diagnostic tests, and post-repair Stripe protection.
                  </p>

                  {/* Interactive Perks Strip (ReactBits / Motion Brew) */}
                  <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-2">
                    {[
                      { icon: ShieldCheck, label: '90-Day Parts & Labor Warranty', color: 'text-emerald-400' },
                      { icon: CreditCard, label: 'Pay Only After Completion', color: 'text-[#F26A3D]' },
                      { icon: CheckCircle2, label: 'Zero Upfront Diagnostic Fee', color: 'text-amber-400' },
                    ].map((perk, i) => {
                      const Icon = perk.icon;
                      return (
                        <motion.div
                          key={i}
                          whileHover={{ y: -2, scale: 1.02 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold text-white/90 backdrop-blur-sm shadow-xs"
                        >
                          <Icon className={`h-3.5 w-3.5 ${perk.color}`} />
                          <span>{perk.label}</span>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Dual Action CTA Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
                    <Link href="/services" className="w-full sm:w-auto">
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={buttonTapSpring}>
                        <Button
                          size="lg"
                          className="w-full sm:w-auto bg-[#F26A3D] hover:bg-[#F26A3D]/90 text-white font-bold text-sm rounded-2xl px-7 py-6 shadow-xl shadow-[#F26A3D]/25 cursor-pointer group"
                        >
                          <span>Explore Repair Catalog</span>
                          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Button>
                      </motion.div>
                    </Link>

                    <Link href="/sign-up" className="w-full sm:w-auto">
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={buttonTapSpring}>
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full sm:w-auto border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-2xl px-7 py-6 backdrop-blur-sm cursor-pointer"
                        >
                          <span>Become a Verified Pro</span>
                        </Button>
                      </motion.div>
                    </Link>
                  </div>

                  {/* Micro Trust Proof */}
                  <p className="text-[11px] text-white/40 pt-2 font-medium">
                    No credit card required to request • Cancel anytime before technician acceptance
                  </p>
                </div>
              </SpotlightCard>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
