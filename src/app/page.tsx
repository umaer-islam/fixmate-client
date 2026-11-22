'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Smartphone,
  Laptop,
  Refrigerator,
  Tv,
  Gamepad2,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  ArrowRight,
  Star,
  MapPin,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api-client';

interface ServiceItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  serviceMode: 'onsite' | 'remote' | 'both';
  basePrice: number;
  estimatedDuration: string;
  image: string;
  technicianName: string;
  serviceArea?: string;
}

const CATEGORIES = [
  { name: 'Smartphones', icon: Smartphone, count: 'Screen, Battery & Port', color: 'bg-rose-50 text-rose-600' },
  { name: 'Laptops', icon: Laptop, count: 'Logic Board & Screen', color: 'bg-blue-50 text-blue-600' },
  { name: 'Home Appliances', icon: Refrigerator, count: 'Fridges, Washers & Ovens', color: 'bg-amber-50 text-amber-600' },
  { name: 'Smart TVs', icon: Tv, count: 'Panels & Power Boards', color: 'bg-purple-50 text-purple-600' },
  { name: 'Gaming Consoles', icon: Gamepad2, count: 'HDMI, Thermal & Drives', color: 'bg-emerald-50 text-emerald-600' },
  { name: 'Smart Home & IoT', icon: Cpu, count: 'Thermostats & Cameras', color: 'bg-indigo-50 text-indigo-600' },
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
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* =================================================================== */}
        {/* HERO SECTION */}
        {/* =================================================================== */}
        <section className="relative overflow-hidden border-b border-border bg-[#F5F3EE] py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column Text */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-[#202522] shadow-xs">
                  <span className="flex h-2 w-2 rounded-full bg-[#F26A3D] animate-ping" />
                  <span className="flex h-2 w-2 rounded-full bg-[#F26A3D]" />
                  <span>Verified Professional Repair Platform</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#202522] font-heading leading-[1.1]">
                  Expert Repair for Smart Devices & Home Appliances
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Book certified local technicians for smartphones, laptops, smart TVs, and major household appliances. Pay securely through Stripe <span className="font-semibold text-foreground">only after</span> your repair is completed and verified.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link href="/services">
                    <Button size="lg" className="w-full sm:w-auto bg-[#F26A3D] hover:bg-[#F26A3D]/90 text-white font-bold text-sm rounded-xl px-8 py-6 shadow-sm">
                      Browse Repair Services
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold text-sm rounded-xl px-6 py-6 border-[#202522] text-[#202522] hover:bg-muted">
                      Join as a Technician
                    </Button>
                  </Link>
                </div>

                {/* Trust Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/80 max-w-lg mx-auto lg:mx-0">
                  <div>
                    <p className="text-2xl font-black text-[#202522]">10,000+</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Repairs Completed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-[#202522]">4.9 / 5</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Customer Rating</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-[#202522]">100%</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Stripe Escrow Safe</p>
                  </div>
                </div>
              </div>

              {/* Right Column Graphic / Highlights */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md rounded-3xl border border-border bg-card p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-border/80 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#202522] text-white">
                        <Wrench className="h-6 w-6 text-[#F26A3D]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">FixMate Guaranteed</p>
                        <p className="text-xs text-muted-foreground">Certified Diagnostic & Repair</p>
                      </div>
                    </div>
                    <Badge variant="success">Verified Tech</Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 rounded-2xl bg-muted/50 p-3">
                      <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">Zero Upfront Payment</p>
                        <p className="text-[11px] text-muted-foreground">
                          Book your appointment without paying a dime in advance.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-2xl bg-muted/50 p-3">
                      <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">Same-Day Diagnostic Options</p>
                        <p className="text-[11px] text-muted-foreground">
                          Choose on-site home visits or remote troubleshooting.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-2xl bg-muted/50 p-3">
                      <CreditCard className="h-5 w-5 text-[#F26A3D] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">Post-Repair Stripe Checkout</p>
                        <p className="text-[11px] text-muted-foreground">
                          Inspect completed work first, then pay with one click.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link href="/services" className="block">
                      <Button className="w-full bg-[#202522] text-white hover:bg-[#202522]/90 rounded-xl font-semibold text-xs py-2.5">
                        Find a Repair Technician in Your Area
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* HOW IT WORKS */}
        {/* =================================================================== */}
        <section className="py-20 border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F26A3D]">
                Simple 4-Step Process
              </span>
              <h2 className="text-3xl font-extrabold text-[#202522] font-heading">
                How FixMate Protects Your Repairs
              </h2>
              <p className="text-sm text-muted-foreground">
                From initial request to final sign-off, experience seamless and transparent repair services.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: 'Select & Book',
                  desc: 'Pick your device category and select an approved service with upfront pricing.',
                },
                {
                  step: '02',
                  title: 'Technician Confirms',
                  desc: 'A verified technician reviews and accepts your booking with scheduling confirmation.',
                },
                {
                  step: '03',
                  title: 'Repair Completed',
                  desc: 'Work is performed on-site or remotely. Final amount is established upon testing.',
                },
                {
                  step: '04',
                  title: 'Pay via Stripe',
                  desc: 'Receive digital invoice and pay securely through Stripe with full warranty coverage.',
                },
              ].map((item, idx) => (
                <div key={idx} className="relative rounded-2xl border border-border bg-background p-6 space-y-3 shadow-xs">
                  <span className="text-3xl font-black text-[#F26A3D]/40 font-mono">
                    {item.step}
                  </span>
                  <h3 className="text-base font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* CATEGORIES GRID */}
        {/* =================================================================== */}
        <section className="py-20 border-b border-border bg-[#F5F3EE]/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F26A3D]">
                  Device Spectrum
                </span>
                <h2 className="text-3xl font-extrabold text-[#202522] font-heading mt-1">
                  Popular Repair Categories
                </h2>
              </div>
              <Link href="/services">
                <Button variant="outline" className="text-xs font-semibold rounded-xl">
                  View All Services <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {CATEGORIES.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={idx}
                    href={`/services?category=${encodeURIComponent(cat.name)}`}
                    className="group"
                  >
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs transition-all hover:shadow-md hover:border-[#F26A3D]/50 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${cat.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-foreground group-hover:text-[#F26A3D] transition-colors">
                            {cat.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">{cat.count}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-[#F26A3D] group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* FEATURED SERVICES (DYNAMIC FROM API) */}
        {/* =================================================================== */}
        <section className="py-20 border-b border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F26A3D]">
                  Hand-Picked Top Rated
                </span>
                <h2 className="text-3xl font-extrabold text-[#202522] font-heading mt-1">
                  Featured Repair Services
                </h2>
              </div>
              <Link href="/services">
                <Button className="bg-[#202522] text-white hover:bg-[#202522]/90 text-xs font-semibold rounded-xl">
                  Explore Full Catalog
                </Button>
              </Link>
            </div>

            {loadingServices ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl border border-border p-4 space-y-3">
                    <Skeleton className="h-44 w-full rounded-xl" />
                    <Skeleton className="h-6 w-3/4 rounded-lg" />
                    <Skeleton className="h-4 w-1/2 rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </div>
                ))}
              </div>
            ) : featuredServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredServices.map((service) => (
                  <Card key={service._id} className="overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="relative h-48 w-full bg-muted/60 overflow-hidden">
                      {service.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={service.image}
                          alt={service.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <Wrench className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <Badge variant="sage" className="capitalize font-semibold text-[11px]">
                          {service.serviceMode}
                        </Badge>
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge variant="default" className="text-[11px]">
                          {service.category}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-5 space-y-3">
                      <div>
                        <h3 className="font-bold text-base text-foreground line-clamp-1 group-hover:text-[#F26A3D] transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {service.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/60">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {service.estimatedDuration}
                        </span>
                        <span className="font-semibold text-foreground">
                          Tech: {service.technicianName}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground">Starting At</p>
                          <p className="text-xl font-black text-[#202522]">
                            ${service.basePrice.toFixed(2)}
                          </p>
                        </div>
                        <Link href={`/services/${service._id}`}>
                          <Button size="sm" className="bg-[#F26A3D] hover:bg-[#F26A3D]/90 text-white font-semibold text-xs rounded-xl shadow-xs">
                            View & Book
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3">
                <Wrench className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground">No approved services yet.</p>
                <p className="text-xs text-muted-foreground">
                  Technicians can create services, and administrators will approve them for public listing.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* =================================================================== */}
        {/* CTA BANNER */}
        {/* =================================================================== */}
        <section className="bg-[#202522] py-16 text-white text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black font-heading text-white">
              Ready to Get Your Device Repaired with Confidence?
            </h2>
            <p className="text-sm text-white/70 max-w-xl mx-auto leading-relaxed">
              Join thousands of satisfied customers who trust FixMate for transparent pricing, certified diagnostics, and post-repair Stripe protection.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link href="/services">
                <Button size="lg" className="bg-[#F26A3D] hover:bg-[#F26A3D]/90 text-white font-bold text-sm rounded-xl px-8 py-5">
                  Find a Technician Now
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 font-bold text-sm rounded-xl px-8 py-5">
                  Become a FixMate Pro
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
