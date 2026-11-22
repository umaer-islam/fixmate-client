import React from 'react';
import Link from 'next/link';
import { Wrench, ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-ivory flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-graphite/10 p-8 shadow-sm text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-repair-orange/10 flex items-center justify-center mx-auto text-repair-orange">
          <Wrench className="w-10 h-10 -rotate-45" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-black text-graphite tracking-tight block">404</span>
          <h1 className="text-xl font-extrabold text-graphite">Page Out of Service</h1>
          <p className="text-xs text-graphite-light leading-relaxed">
            The repair blueprint or page you are looking for does not exist, has been moved, or has completed its service cycle.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 bg-repair-orange hover:bg-repair-orange-dark text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/services"
            className="w-full sm:w-auto px-5 py-2.5 bg-graphite hover:bg-graphite/90 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Explore Services</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
