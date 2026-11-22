import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileText, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata = {
  title: 'Terms of Service | FixMate',
  description: 'Terms and conditions governing the FixMate smart device and home appliance repair platform.',
};

export default function TermsOfServicePage() {
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
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[#202522] font-heading">
                Terms of Service
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Last updated: November 2026 • Platform Version 1.0 (Production)
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-8 text-foreground shadow-xs text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#202522] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#202522] text-[11px] font-bold text-[#F5F3EE]">
                1
              </span>
              Platform Agreement & Acceptance
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              By accessing, browsing, or creating an account on FixMate (&ldquo;the Platform&rdquo;), you agree to be bound by these Terms of Service. FixMate operates as an intermediary connecting certified technicians with residential and commercial device owners requiring repair, maintenance, and diagnostics for smartphones, laptops, PCs, AC units, refrigerators, televisions, and electrical appliances.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#202522] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#202522] text-[11px] font-bold text-[#F5F3EE]">
                2
              </span>
              Booking Lifecycle & Zero Upfront Fee Policy
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              FixMate guarantees a strictly post-repair payment model. Customers are never charged upfront fees or required to provide credit card details at the time of placing a repair request. The four-stage lifecycle governs all bookings:
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground list-disc list-inside">
              <li><strong>Requested:</strong> The customer selects an approved service and provides preferred scheduling and location details.</li>
              <li><strong>Accepted:</strong> The assigned technician confirms feasibility and scheduling within the service area.</li>
              <li><strong>In Progress:</strong> The physical inspection or diagnostic teardown is actively underway.</li>
              <li><strong>Completed:</strong> The repair is tested and validated, and the final invoice amount is finalized.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#202522] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#202522] text-[11px] font-bold text-[#F5F3EE]">
                3
              </span>
              Stripe Checkout & Payment Processing
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Upon marking a repair completed, payment is processed securely through Stripe Checkout. FixMate does not store raw credit card numbers or banking secrets. Payment status transitions to settled only upon cryptographically verified webhook execution or authoritative server-side session verification.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#202522] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#202522] text-[11px] font-bold text-[#F5F3EE]">
                4
              </span>
              90-Day Repair Warranty Guarantee
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All settled repairs performed through FixMate carry a mandatory 90-day parts and labor warranty against recurrence of the diagnosed defect. If the repaired hardware exhibits identical component failure within 90 days of invoice payment, the assigned technician is obligated to remediate without additional diagnostic surcharges.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#202522] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#202522] text-[11px] font-bold text-[#F5F3EE]">
                5
              </span>
              Cancellations & Dispute Resolution
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Customers may cancel a repair request free of penalty while it remains in the &ldquo;Requested&rdquo; state. Once a technician has arrived on-site or accepted parts transit, mutual resolution through platform administration is required. Contact support@fixmate.io for escalation.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
