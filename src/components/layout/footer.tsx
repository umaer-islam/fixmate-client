import React from 'react';
import Link from 'next/link';
import { Wrench, Shield, CheckCircle2, CreditCard, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#202522] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#202522]">
                <Wrench className="h-5 w-5 text-[#F26A3D]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-heading">
                Fix<span className="text-[#F26A3D]">Mate</span>
              </span>
            </Link>
            <p className="text-xs text-white/70 leading-relaxed">
              FixMate is the smart device and home appliance repair platform connecting customers with vetted local technicians. Guaranteed transparent pricing and post-repair Stripe payments.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/90">
                <Shield className="h-3.5 w-3.5 text-[#F26A3D]" /> Vetted Experts
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/90">
                <CreditCard className="h-3.5 w-3.5 text-emerald-400" /> Stripe Protected
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <Link href="/" className="hover:text-[#F26A3D] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#F26A3D] transition-colors">
                  All Repair Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#F26A3D] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#F26A3D] transition-colors">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Repair Categories */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <Link href="/services?category=Smartphones" className="hover:text-[#F26A3D] transition-colors">
                  Smartphones & Tablets
                </Link>
              </li>
              <li>
                <Link href="/services?category=Laptops" className="hover:text-[#F26A3D] transition-colors">
                  Laptops & Computers
                </Link>
              </li>
              <li>
                <Link href="/services?category=Home+Appliances" className="hover:text-[#F26A3D] transition-colors">
                  Home Appliances
                </Link>
              </li>
              <li>
                <Link href="/services?category=Smart+TVs" className="hover:text-[#F26A3D] transition-colors">
                  Smart TVs & Audio
                </Link>
              </li>
              <li>
                <Link href="/services?category=Gaming+Consoles" className="hover:text-[#F26A3D] transition-colors">
                  Gaming Consoles
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">
              Direct Support
            </h4>
            <ul className="space-y-3 text-xs text-white/70">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#F26A3D]" />
                <span>support@fixmate.io</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#F26A3D]" />
                <span>+1 (800) FIX-MATE</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#F26A3D] shrink-0 mt-0.5" />
                <span>FixMate Repair Network, Global Service Coverage</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50">
          <p>© {new Date().getFullYear()} FixMate Platform. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <span>Assignment 09 Production Full-Stack</span>
            <span>Category 006 · Smart Device & Appliance Repair</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
