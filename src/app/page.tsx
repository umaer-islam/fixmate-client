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
  { name: 'Smartphone', icon: Smartphone, count: 'Screen, Battery & Port', color: 'bg-rose-500/10 text-rose-600', border: 'hover:border-rose-300' },
  { name: 'Laptop & PC', icon: Laptop, count: 'Logic Board, SSD & Screen', color: 'bg-blue-500/10 text-blue-600', border: 'hover:border-blue-300' },
  { name: 'AC', icon: Wind, count: 'Compressor, Gas & PCB', color: 'bg-sky-500/10 text-sky-600', border: 'hover:border-sky-300' },
  { name: 'Refrigerator', icon: Refrigerator, count: 'Cooling, Thermostat & Gas', color: 'bg-amber-500/10 text-amber-600', border: 'hover:border-amber-300' },
  { name: 'TV', icon: Tv, count: 'OLED/LED Panels & Power', color: 'bg-purple-500/10 text-purple-600', border: 'hover:border-purple-300' },
  { name: 'Washing Machine', icon: Disc, count: 'Motor, Drum & Drainage', color: 'bg-emerald-500/10 text-emerald-600', border: 'hover:border-emerald-300' },
  { name: 'Electrical', icon: Zap, count: 'Wiring, Breakers & Load', color: 'bg-yellow-500/10 text-yellow-600', border: 'hover:border-yellow-300' },
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
        {/* HERO SECTION */}
        {/* =================================================================== */}
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-[#F5F3EE] via-[#F5F3EE] to-background py-16 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column Text */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <FadeIn direction="down" delay={0.05}>
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-bold text-[#202522] shadow-xs">
                    <span className="flex h-2 w-2 rounded-full bg-[#F26A3D] animate-ping" />
                    <span className="flex h-2 w-2 rounded-full bg-[#F26A3D]" />
                    <span className="tracking-wide">FixMate Verified Repair Network</span>
                    <span className="hidden sm:inline text-muted-foreground">•</span>
                    <span className="hidden sm:inline text-emerald-600 font-semibold">Zero Upfront Fee</span>
                  </div>
                </FadeIn>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#202522] font-heading leading-[1.08]">
                  <SplitText text="Precision Repair for Smart Devices & Home Appliances" />
                </h1>

                <FadeIn direction="up" delay={0.25}>
                  <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                    Connect with vetted local technicians across smartphones, laptops, AC units, and major household appliances. Inspect the completed repair first, then pay securely through Stripe with an authoritative <span className="font-bold text-[#202522]">90-Day Warranty</span>.
                  </p>
                </FadeIn>

                {/* Hero CTAs */}
                <FadeIn direction="up" delay={0.35}>
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                    <Link href="/services">
                      <MotionButton size="lg" variant="primary" className="w-full sm:w-auto shadow-md">
                        <span>Explore Repair Services</span>
                        <ArrowRight className="h-4 w-4" />
                      </MotionButton>
                    </Link>
                    <Link href="/sign-up">
                      <MotionButton size="lg" variant="outline" className="w-full sm:w-auto">
                        <span>Join as Technician</span>
                      </MotionButton>
                    </Link>
                  </div>
                </FadeIn>

                {/* Trust Metrics Bar */}
                <FadeIn direction="up" delay={0.45}>
                  <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/80 max-w-lg mx-auto lg:mx-0 text-left">
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
                  </div>
                </FadeIn>
              </div>

              {/* Right Column Workshop Card Preview */}
              <div className="lg:col-span-5 relative">
                <FadeIn direction="left" delay={0.2} distance={24}>
                  <SpotlightCard className="mx-auto max-w-md shadow-xl bg-card border-border/80 p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-border/70 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#202522] text-white shadow-xs">
                          <Wrench className="h-6 w-6 text-[#F26A3D]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">FixMate Guarantee</p>
                          <p className="text-xs text-muted-foreground">Certified Diagnostic & Repair</p>
                        </div>
                      </div>
                      <Badge variant="success" className="font-bold text-[11px]">
                        Verified Tech
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3 rounded-2xl bg-muted/50 p-3.5 transition-colors hover:bg-muted/80">
                        <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-600">
                          <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">Zero Upfront Payment</p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            Book your appointment without providing credit card details in advance.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-2xl bg-muted/50 p-3.5 transition-colors hover:bg-muted/80">
                        <div className="h-8 w-8 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 text-blue-600">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">Home Visit or Shop Drop-off</p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            Flexible service modes tailored to appliances and handheld electronics.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 rounded-2xl bg-muted/50 p-3.5 transition-colors hover:bg-muted/80">
                        <div className="h-8 w-8 rounded-xl bg-[#F26A3D]/10 flex items-center justify-center shrink-0 text-[#F26A3D]">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">Post-Repair Stripe Checkout</p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            Inspect completed work first, then settle your digital invoice with one click.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link href="/services" className="block">
                        <MotionButton variant="graphite" size="md" className="w-full">
                          <span>Find a Repair Technician in Your Area</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </MotionButton>
                      </Link>
                    </div>
                  </SpotlightCard>
                </FadeIn>
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
        {/* REPAIR CATEGORIES SPECTRUM */}
        {/* =================================================================== */}
        <section className="py-20 border-b border-border bg-[#F5F3EE]/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeIn direction="up">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F26A3D]">
                    7 Device Categories
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202522] font-heading mt-1">
                    Specialized Repair Categories
                  </h2>
                </div>
                <Link href="/services">
                  <MotionButton variant="outline" size="sm">
                    <span>View All Services</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </MotionButton>
                </Link>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {CATEGORIES.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <FadeIn key={idx} direction="up" delay={0.06 * idx}>
                    <Link href={`/services?category=${encodeURIComponent(cat.name)}`}>
                      <SpotlightCard className="flex items-center justify-between p-5 bg-card hover:border-[#F26A3D]/50 cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${cat.color}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-foreground">
                              {cat.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">{cat.count}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-[#F26A3D] transition-transform" />
                      </SpotlightCard>
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
        {/* CALL TO ACTION */}
        {/* =================================================================== */}
        <section className="bg-[#202522] py-20 text-white text-center relative overflow-hidden">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
            <FadeIn direction="up">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F26A3D]">
                Get Started Today
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-heading text-white mt-2">
                Ready to Repair Your Device with Zero Risk?
              </h2>
              <p className="text-sm text-white/70 max-w-xl mx-auto leading-relaxed mt-3">
                Join thousands of customers who rely on FixMate for transparent pricing, certified diagnostics, and post-repair Stripe protection.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/services">
                  <MotionButton variant="primary" size="lg" className="w-full sm:w-auto shadow-lg">
                    <span>Find a Technician Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </MotionButton>
                </Link>
                <Link href="/sign-up">
                  <MotionButton variant="outline" size="lg" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10">
                    <span>Become a FixMate Pro</span>
                  </MotionButton>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
