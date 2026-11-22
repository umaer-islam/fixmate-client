import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { FadeIn } from '@/components/motion/fade-in';
import { AnimatedCounter } from '@/components/motion/animated-counter';
import { SpotlightCard } from '@/components/motion/spotlight-card';
import { MotionButton } from '@/components/motion/motion-button';
import {
  Wrench,
  ShieldCheck,
  Award,
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const metadata = {
  title: 'About FixMate | Reliable Device & Appliance Repair Platform',
  description:
    'Learn about FixMate mission to provide transparent, verified, and high-standard electronic device and home appliance repairs.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F3EE]">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-[#202522] text-white py-20 sm:py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <FadeIn direction="up">
              <div className="max-w-3xl space-y-4">
                <span className="text-xs font-bold text-[#F26A3D] uppercase tracking-wider block">
                  The FixMate Standard
                </span>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight font-heading">
                  Fixing More Than Devices. Restoring Peace of Mind.
                </h1>
                <p className="text-xs sm:text-base text-white/70 leading-relaxed pt-2">
                  FixMate was founded to revolutionize smart device and home appliance repair. We replace guesswork and opaque pricing with verified professionals, upfront estimates, comprehensive 90-day warranties, and post-repair Stripe payments.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold text-[#F26A3D] uppercase tracking-wider block mb-2">
                Operational Pillars
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#202522] font-heading">
                Four Pillars Guiding Every Repair
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: 'Vetted Technicians',
                desc: 'Every service technician undergoes strict skill certification, identity validation, and workshop audits.',
              },
              {
                icon: Award,
                title: '90-Day Warranty',
                desc: 'Every repair is backed by our authoritative 90-day parts and labor warranty against recurrence.',
              },
              {
                icon: Clock,
                title: 'Zero Upfront Fee',
                desc: 'Transparent base prices with zero surprise surcharges. Inspect completed work before you pay.',
              },
              {
                icon: Sparkles,
                title: 'Modern Experience',
                desc: 'Live 4-stage lifecycle order tracking, instant status updates, and digital receipts powered by Stripe.',
              },
            ].map((v, idx) => {
              const Icon = v.icon;
              return (
                <FadeIn key={idx} direction="up" delay={0.08 * idx}>
                  <SpotlightCard className="h-full bg-card p-6 shadow-xs space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#202522] text-[#F26A3D] flex items-center justify-center mb-4 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-foreground text-base">{v.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
                  </SpotlightCard>
                </FadeIn>
              );
            })}
          </div>
        </section>

        {/* By the numbers */}
        <section className="bg-card border-y border-border py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <span className="text-3xl sm:text-4xl font-black text-[#F26A3D] block">
                  <AnimatedCounter value={98.4} decimals={1} suffix="%" />
                </span>
                <span className="text-xs font-bold text-foreground uppercase tracking-wider mt-1 block">
                  First-Visit Resolution
                </span>
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-black text-[#202522] block">
                  <AnimatedCounter value={15200} suffix="+" />
                </span>
                <span className="text-xs font-bold text-foreground uppercase tracking-wider mt-1 block">
                  Hardware Restored
                </span>
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-black text-[#202522] block">
                  <AnimatedCounter value={90} suffix=" Days" />
                </span>
                <span className="text-xs font-bold text-foreground uppercase tracking-wider mt-1 block">
                  Warranty Coverage
                </span>
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-black text-[#F26A3D] block">
                  <AnimatedCounter value={4.9} decimals={1} suffix=" / 5.0" />
                </span>
                <span className="text-xs font-bold text-foreground uppercase tracking-wider mt-1 block">
                  Average Rating
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="bg-[#202522] rounded-3xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2 max-w-xl text-center sm:text-left">
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight font-heading">
                  Ready to restore your device?
                </h3>
                <p className="text-xs sm:text-sm text-white/70">
                  Browse our certified repair directory, pick your preferred date, and experience zero-upfront repair service.
                </p>
              </div>
              <Link href="/services">
                <MotionButton variant="primary" size="md">
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </MotionButton>
              </Link>
            </div>
          </FadeIn>
        </section>
      </main>

      <Footer />
    </div>
  );
}
