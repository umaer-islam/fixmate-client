import React from 'react';
import Link from 'next/link';
import {
  Wrench,
  ShieldCheck,
  Award,
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const metadata = {
  title: 'About FixMate | Reliable Device & Appliance Repair Platform',
  description:
    'Learn about FixMate mission to provide transparent, verified, and high-standard electronic device and home appliance repairs.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="bg-graphite text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial from-repair-orange/10 via-transparent to-transparent opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold text-repair-orange uppercase tracking-wider block">
              Our Mission
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Fixing More Than Devices. Restoring Peace of Mind.
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed pt-2">
              FixMate was created to revolutionize the device and appliance repair industry. We replace predatory pricing and dubious craftsmanship with verified professionals, upfront estimates, comprehensive warranties, and secure milestone-based payment processing.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-repair-orange uppercase tracking-wider block mb-2">
            The FixMate Standard
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-graphite">
            Four Pillars That Guide Every Repair
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              icon: ShieldCheck,
              title: 'Vetted Technicians',
              desc: 'Every service technician undergoes strict skill certification, identity validation, and workshop audits.',
            },
            {
              icon: Award,
              title: 'Guaranteed Workmanship',
              desc: 'Every repair is backed by our 90-day parts and labor warranty, giving you total peace of mind.',
            },
            {
              icon: Clock,
              title: 'Transparent Pricing',
              desc: 'Upfront base price quotes with zero surprise surcharges. Pay securely only after your job is completed.',
            },
            {
              icon: Sparkles,
              title: 'Modern Experience',
              desc: 'Live lifecycle order tracking, instant technician messaging, and digital receipts powered by Stripe.',
            },
          ].map((v, idx) => {
            const Icon = v.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-graphite/10 p-6 shadow-xs hover:border-repair-orange transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-repair-orange/10 flex items-center justify-center text-repair-orange mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-graphite text-base mb-2">{v.title}</h3>
                <p className="text-xs text-graphite-light leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* By the numbers */}
      <section className="bg-white border-y border-graphite/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <span className="text-3xl sm:text-4xl font-black text-repair-orange block">98.4%</span>
              <span className="text-xs font-bold text-graphite uppercase tracking-wider mt-1 block">
                First-Visit Resolution
              </span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-repair-orange block">15,000+</span>
              <span className="text-xs font-bold text-graphite uppercase tracking-wider mt-1 block">
                Devices Restored
              </span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-repair-orange block">90 Days</span>
              <span className="text-xs font-bold text-graphite uppercase tracking-wider mt-1 block">
                Warranty Coverage
              </span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-repair-orange block">4.9 / 5.0</span>
              <span className="text-xs font-bold text-graphite uppercase tracking-wider mt-1 block">
                Average Rating
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-graphite rounded-3xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to restore your device?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Browse our approved service catalog, pick your date, and have a verified specialist inspect your hardware.
            </p>
          </div>
          <Link
            href="/services"
            className="px-6 py-3 bg-repair-orange hover:bg-repair-orange-dark text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 whitespace-nowrap"
          >
            <span>Browse Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
