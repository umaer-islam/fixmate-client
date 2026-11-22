'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Wrench,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { buttonTapSpring } from '@/lib/motion/tokens';
import { LiquidChrome } from '@/components/ui/liquid-chrome/liquid-chrome';

export function Footer() {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) {
      toast.error('Please provide a valid email address.');
      return;
    }
    setSubscribed(true);
    toast.success('Subscribed to FixMate service updates!');
    setEmailInput('');
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const categories = [
    { name: 'Smartphone', href: '/services?category=Smartphone' },
    { name: 'Laptop & PC', href: '/services?category=Laptop+%26+PC' },
    { name: 'AC', href: '/services?category=AC' },
    { name: 'Refrigerator', href: '/services?category=Refrigerator' },
    { name: 'TV', href: '/services?category=TV' },
    { name: 'Washing Machine', href: '/services?category=Washing+Machine' },
    { name: 'Electrical', href: '/services?category=Electrical' },
  ];

  const quickLinks = [
    { label: 'Browse All Services', href: '/services' },
    { label: 'How FixMate Works', href: '/#how-it-works' },
    { label: 'About Our Platform', href: '/about' },
    { label: 'Customer Portal', href: '/dashboard/customer' },
    { label: 'Technician Workspace', href: '/dashboard/technician' },
    { label: 'Admin Moderation', href: '/dashboard/admin' },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#181C1A] text-white border-t border-white/10">
      {/* React Bits LiquidChrome WebGL2 Fluid Metallic Background with Brand Colors */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-35">
        <LiquidChrome
          color="#F26A3D"
          speed={0.15}
          amplitude={0.25}
          interactive={true}
        />
      </div>

      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-25">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-[#F26A3D]/20 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        {/* =================================================================== */}
        {/* PRE-FOOTER ACTION STRIP */}
        {/* =================================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 rounded-3xl border border-white/10 bg-gradient-to-r from-white/[0.07] via-white/[0.04] to-white/[0.07] p-6 sm:p-8 backdrop-blur-xl shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center lg:text-left">
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Got a broken device or faulty appliance?
              </h3>
              <p className="text-xs sm:text-sm text-white/70 max-w-xl">
                Get priority repair diagnostics with zero upfront charge. Pay securely only after your hardware is completely restored.
              </p>
            </div>

            {/* Newsletter / Alerts */}
            <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative w-full sm:w-72">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter email for repair alerts..."
                  className="w-full rounded-2xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-4 text-xs text-white placeholder-white/40 focus:border-[#F26A3D] focus:outline-none focus:ring-1 focus:ring-[#F26A3D] transition-colors"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={buttonTapSpring}
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#F26A3D] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#F26A3D]/20 hover:bg-[#F26A3D]/90 transition-colors cursor-pointer"
              >
                <span>{subscribed ? 'Subscribed!' : 'Get Alerts'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* =================================================================== */}
        {/* MAIN NAVIGATION MATRIX */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Brand & Authority */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: 18, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F26A3D] text-white shadow-md shadow-[#F26A3D]/30"
              >
                <Wrench className="h-5 w-5" />
              </motion.div>
              <span className="text-2xl font-black tracking-tight text-white font-heading">
                Fix<span className="text-[#F26A3D]">Mate</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-sm">
              The premier on-demand repair platform for precision smart devices and major home appliances. Verified technicians, transparent quotes, and secure escrow payments.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mr-1">
                Follow Us
              </span>
              {/* X (Twitter) */}
              <motion.a
                whileHover={{ scale: 1.12, y: -2 }}
                whileTap={buttonTapSpring}
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (formerly Twitter)"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-[#F26A3D] hover:text-white hover:border-[#F26A3D] transition-colors"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </motion.a>

              {/* GitHub */}
              <motion.a
                whileHover={{ scale: 1.12, y: -2 }}
                whileTap={buttonTapSpring}
                href="https://github.com/umaer-islam"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-[#F26A3D] hover:text-white hover:border-[#F26A3D] transition-colors"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </motion.a>

              {/* LinkedIn */}
              <motion.a
                whileHover={{ scale: 1.12, y: -2 }}
                whileTap={buttonTapSpring}
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-[#F26A3D] hover:text-white hover:border-[#F26A3D] transition-colors"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </motion.a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F26A3D]" />
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 hover:text-[#F26A3D] transition-colors"
                  >
                    <span className="text-white/20 group-hover:text-[#F26A3D] transition-colors">•</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: 7 Official Repair Categories */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F26A3D]" />
              7 Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={cat.href}
                    className="group inline-flex items-center gap-1.5 hover:text-[#F26A3D] transition-colors"
                  >
                    <span className="text-white/20 group-hover:text-[#F26A3D] transition-colors">•</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {cat.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Operations */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F26A3D]" />
              Direct Support
            </h4>
            <ul className="space-y-3 text-xs text-white/70">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#F26A3D] shrink-0" />
                <a href="mailto:support@fixmate.io" className="text-white/70 hover:text-[#F26A3D] transition-colors">
                  support@fixmate.io
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#F26A3D] shrink-0" />
                <a href="tel:+18003496283" className="text-white/70 hover:text-[#F26A3D] transition-colors">
                  +1 (800) FIX-MATE
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-[#F26A3D] shrink-0" />
                <span className="text-white/70">
                  Austin, TX &amp; Nationwide
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* =================================================================== */}
        {/* BOTTOM METADATA & BACK TO TOP BAR */}
        {/* =================================================================== */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} FixMate Repair Inc. All rights reserved.</p>

          <div className="flex items-center gap-5">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>

            {/* Smooth Animated Back To Top Button */}
            <motion.button
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={buttonTapSpring}
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-[#F26A3D] hover:text-white hover:border-[#F26A3D] transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
