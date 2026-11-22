'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { FadeIn } from '@/components/motion/fade-in';
import { SpotlightCard } from '@/components/motion/spotlight-card';
import { MotionButton } from '@/components/motion/motion-button';
import { motionSprings } from '@/lib/motion/tokens';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please complete all required fields.');
      return;
    }

    setIsSent(true);
    toast.success('Thank you! Your inquiry has been dispatched to FixMate Support.');
  };

  const faqs = [
    {
      q: 'How does payment work with FixMate?',
      a: 'FixMate uses a strictly post-repair Stripe escrow model. You book with an upfront estimate without paying in advance. When your technician completes and tests the repair, they log the authoritative final amount and you pay securely through Stripe Checkout.',
    },
    {
      q: 'What is covered by the FixMate 90-day warranty?',
      a: 'All replaced hardware components and workmanship are covered. If the identical component or fault recurs within 90 days of payment, we dispatch your technician to remediate it at zero diagnostic charge.',
    },
    {
      q: 'Can I cancel my repair booking?',
      a: 'Yes. You can cancel any booking free of charge while it is in the "Requested" state directly from your customer dashboard with zero cancellation penalties.',
    },
    {
      q: 'How do I become a verified FixMate Technician?',
      a: 'Register an account, select the "Technician" role, complete your professional profile with your specialties and service area, and create your service offerings for administrative review.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F3EE]">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <FadeIn direction="down">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-[#F26A3D] uppercase tracking-wider block">
                Support & Inquiries
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-[#202522] tracking-tight font-heading">
                We&apos;re Here to Help
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Have questions regarding a repair booking, technician partnership, or warranty claim? Reach out to our customer care specialists.
              </p>
            </div>
          </FadeIn>

          {/* Contact Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Direct Info Cards */}
            <div className="space-y-4">
              <FadeIn direction="right" delay={0.1}>
                <SpotlightCard className="p-6 bg-card flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#202522] text-[#F26A3D] flex items-center justify-center shrink-0 shadow-xs">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">Direct Phone Support</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Mon - Sat from 8:00 AM - 8:00 PM</p>
                    <p className="text-sm font-bold text-[#F26A3D] mt-1">+1 (800) 555-FIXMATE</p>
                  </div>
                </SpotlightCard>
              </FadeIn>

              <FadeIn direction="right" delay={0.2}>
                <SpotlightCard className="p-6 bg-card flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#202522] text-[#F26A3D] flex items-center justify-center shrink-0 shadow-xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">Email Helpdesk</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Guaranteed response within 4 hours</p>
                    <p className="text-sm font-bold text-foreground mt-1">support@fixmate.io</p>
                  </div>
                </SpotlightCard>
              </FadeIn>

              <FadeIn direction="right" delay={0.3}>
                <SpotlightCard className="p-6 bg-card flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#202522] text-[#F26A3D] flex items-center justify-center shrink-0 shadow-xs">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">Headquarters</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Central Logistics & Training Lab</p>
                    <p className="text-xs font-semibold text-foreground mt-1">
                      452 Innovation Blvd, Suite 300, Austin, TX 78701
                    </p>
                  </div>
                </SpotlightCard>
              </FadeIn>
            </div>

            {/* Right Column: Contact Form (2 cols) */}
            <div className="lg:col-span-2">
              <FadeIn direction="left" delay={0.15}>
                <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-xs">
                  <h2 className="text-lg font-bold text-[#202522] mb-1 font-heading">
                    Send Us a Direct Message
                  </h2>
                  <p className="text-xs text-muted-foreground mb-6">
                    Fill in the details below and an operations specialist will follow up with you.
                  </p>

                  {isSent ? (
                    <div className="p-8 text-center bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-3">
                      <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                      <h3 className="font-bold text-emerald-900 text-base">Message Dispatched!</h3>
                      <p className="text-xs text-emerald-700 max-w-sm mx-auto leading-relaxed">
                        Thank you, {name}. Our customer care team has received your inquiry and will follow up at {email}.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                            Your Name <span className="text-[#F26A3D]">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Alex Johnson"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 border border-input rounded-xl text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                            Your Email <span className="text-[#F26A3D]">*</span>
                          </label>
                          <input
                            type="email"
                            placeholder="alex@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 border border-input rounded-xl text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                          Subject
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Question regarding repair warranty coverage"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full px-3.5 py-2.5 border border-input rounded-xl text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-foreground uppercase tracking-wider">
                          Message <span className="text-[#F26A3D]">*</span>
                        </label>
                        <textarea
                          rows={5}
                          placeholder="Describe your inquiry or support requirements..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 border border-input rounded-xl text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30"
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <MotionButton type="submit" variant="primary" size="md">
                          <Send className="w-3.5 h-3.5 mr-1" />
                          <span>Transmit Message</span>
                        </MotionButton>
                      </div>
                    </form>
                  )}
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Interactive FAQ Accordion */}
          <div className="pt-8 border-t border-border">
            <FadeIn direction="up">
              <div className="text-center max-w-xl mx-auto mb-10">
                <span className="text-xs font-bold text-[#F26A3D] uppercase tracking-wider block mb-1">
                  Common Inquiries
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202522] font-heading">
                  Frequently Asked Questions
                </h2>
              </div>
            </FadeIn>

            <div className="max-w-3xl mx-auto space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <motion.div
                    key={idx}
                    className="bg-card rounded-2xl border border-border overflow-hidden shadow-xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-muted/40 transition-colors"
                    >
                      <span className="font-bold text-sm text-foreground flex items-center gap-2.5">
                        <HelpCircle className="w-4 h-4 text-[#F26A3D] shrink-0" />
                        {faq.q}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={motionSprings.snappy}
                      >
                        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={motionSprings.snappy}
                          className="px-5 pb-5 text-xs text-muted-foreground leading-relaxed pl-11"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
