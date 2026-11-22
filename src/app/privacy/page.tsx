import React from 'react';
import Link from 'next/link';
import { Lock, ShieldCheck, ArrowLeft, Eye, Database, Server } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata = {
  title: 'Privacy Policy | FixMate',
  description: 'How FixMate protects and manages customer, technician, and payment data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F3EE]">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-3 border-b border-border pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#202522] text-[#F26A3D]">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[#202522] font-heading">
                Privacy Policy
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Effective Date: November 2026 • Compliant with Assignment 09 Standards
              </p>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-8 text-foreground shadow-xs text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#202522] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#202522] text-[11px] font-bold text-[#F5F3EE]">
                1
              </span>
              Overview & Scope
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              FixMate (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to maintaining robust privacy protections for our users. This Privacy Policy details our practices concerning data collection, transmission, storage, and processing across the FixMate platform, including our customer portal, technician workspace, and administrative moderation systems.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#202522] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#202522] text-[11px] font-bold text-[#F5F3EE]">
                2
              </span>
              Data We Collect
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl border border-border bg-background space-y-1.5">
                <span className="text-xs font-bold text-foreground block">Account Credentials</span>
                <p className="text-[11px] text-muted-foreground">
                  Names, verified email addresses, role identifiers (customer, technician, admin), and securely hashed passwords managed via BetterAuth.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-background space-y-1.5">
                <span className="text-xs font-bold text-foreground block">Service Order Data</span>
                <p className="text-[11px] text-muted-foreground">
                  Device models, problem descriptions, preferred appointment dates, repair contact numbers, and service addresses for Home Visits.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-background space-y-1.5">
                <span className="text-xs font-bold text-foreground block">Technician Profiles</span>
                <p className="text-[11px] text-muted-foreground">
                  Specialties, designated service areas, professional bios, catalog service listings, and verified avatar imagery.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-background space-y-1.5">
                <span className="text-xs font-bold text-foreground block">Diagnostic Media</span>
                <p className="text-[11px] text-muted-foreground">
                  Uploaded device repair photographs and component invoices processed via secure HTTPS endpoints and validated MIME checks.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#202522] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#202522] text-[11px] font-bold text-[#F5F3EE]">
                3
              </span>
              Payment Isolation & Stripe Integration
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All financial transactions are conducted strictly through Stripe test and live mode interfaces. FixMate servers never receive, store, or process raw credit card numbers, CVVs, or cardholder banking credentials. When a customer initiates payment, they are directed to a Stripe-hosted Checkout session. FixMate only receives cryptographic webhook events confirming transaction settlement, recording the Stripe Payment Intent ID and settled amount for warranty verification.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#202522] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#202522] text-[11px] font-bold text-[#F5F3EE]">
                4
              </span>
              Security & Access Control
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We employ strict role-based access control (RBAC) and JWT verification across all backend routes. Passwords are never stored in plaintext and are salted with high-work-factor cryptographic algorithms. Customer service requests and technician queues are isolated by database ownership checks to ensure no unauthorized user can inspect third-party repair documents.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#202522] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#202522] text-[11px] font-bold text-[#F5F3EE]">
                5
              </span>
              User Rights & Profile Controls
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Users can view and update their profile details (name, phone, area, bio, and avatar) at any time through the unified <Link href="/dashboard/profile" className="text-[#F26A3D] underline font-semibold">Profile Management</Link> dashboard. For complete account deletion or data erasure requests, please contact privacy@fixmate.io.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
