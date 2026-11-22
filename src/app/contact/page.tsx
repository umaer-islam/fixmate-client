'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

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
      a: 'FixMate uses a milestone-based Stripe model. You book with a starting base estimate. When your technician finishes the repair, they log the authoritative final amount and you pay securely through Stripe Checkout.',
    },
    {
      q: 'What is covered by the FixMate 90-day warranty?',
      a: 'All hardware components replaced and labor performed are covered. If the same malfunction recurs within 90 days, we dispatch a technician to rectify it free of charge.',
    },
    {
      q: 'Can I cancel my repair booking?',
      a: 'Yes. You can cancel any booking free of charge while it is in the "Requested" state directly from your customer dashboard.',
    },
    {
      q: 'How do I become a verified FixMate Technician?',
      a: 'Register an account, select the "Technician" role, complete your professional profile with specialties and certifications, and our admin team will audit your credentials.',
    },
  ];

  return (
    <div className="min-h-screen bg-ivory py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-repair-orange uppercase tracking-wider block">
            Customer Support & Inquiries
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-graphite tracking-tight">
            We&apos;re Here to Help
          </h1>
          <p className="text-sm text-graphite-light leading-relaxed">
            Have questions about an existing repair booking, technician partnerships, or enterprise fleet service? Reach out to our specialized care team.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Direct Info Cards */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-graphite/10 p-6 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-repair-orange/10 flex items-center justify-center text-repair-orange flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-graphite text-sm">Direct Phone Support</h3>
                <p className="text-xs text-graphite-light mt-0.5">Mon - Sat from 8:00 AM - 8:00 PM</p>
                <p className="text-sm font-bold text-repair-orange mt-1">+1 (800) 555-FIXMATE</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-graphite/10 p-6 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-graphite text-sm">Email Helpdesk</h3>
                <p className="text-xs text-graphite-light mt-0.5">Responses guaranteed within 4 hours</p>
                <p className="text-sm font-bold text-graphite mt-1">support@fixmate.io</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-graphite/10 p-6 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-graphite text-sm">Headquarters</h3>
                <p className="text-xs text-graphite-light mt-0.5">Central Logistics & Training Lab</p>
                <p className="text-xs font-medium text-graphite mt-1">
                  452 Innovation Blvd, Suite 300, Austin, TX 78701
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (2 cols) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-graphite/10 p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-graphite mb-1">Send Us a Direct Message</h2>
              <p className="text-xs text-graphite-light mb-6">
                Fill in the details below and an operations specialist will contact you promptly.
              </p>

              {isSent ? (
                <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="font-bold text-emerald-900 text-base">Message Dispatched!</h3>
                  <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                    Thank you, {name}. Our customer care team has received your inquiry and will follow up at {email}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-graphite uppercase tracking-wider mb-1">
                        Your Name <span className="text-repair-orange">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Alex Johnson"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 border border-graphite/20 rounded-xl text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-graphite uppercase tracking-wider mb-1">
                        Your Email <span className="text-repair-orange">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="alex@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 border border-graphite/20 rounded-xl text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-graphite uppercase tracking-wider mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Question about Booking #A4B29"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-graphite/20 rounded-xl text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-graphite uppercase tracking-wider mb-1">
                      Message <span className="text-repair-orange">*</span>
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Describe your inquiry or support requirements..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 border border-graphite/20 rounded-xl text-sm text-graphite focus:outline-none focus:ring-2 focus:ring-repair-orange/30 focus:border-repair-orange"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-repair-orange hover:bg-repair-orange-dark text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit Message</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="pt-8 border-t border-graphite/10">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold text-repair-orange uppercase tracking-wider block mb-1">
              Common Inquiries
            </span>
            <h2 className="text-2xl font-black text-graphite">Frequently Asked Questions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-graphite/10 p-5 shadow-xs space-y-1.5">
                <h3 className="font-bold text-graphite text-sm flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-repair-orange flex-shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs text-graphite-light leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
