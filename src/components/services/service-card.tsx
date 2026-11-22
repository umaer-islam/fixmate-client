'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Clock, Wrench, ArrowRight, ShieldCheck } from 'lucide-react';

export interface ServiceCardProps {
  service: {
    _id: string;
    title: string;
    description: string;
    category: string;
    serviceMode: string;
    basePrice: number;
    estimatedDuration: string;
    image?: string;
    technicianName?: string;
    serviceArea?: string;
  };
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [imgError, setImgError] = useState(false);

  const formattedMode =
    service.serviceMode === 'both'
      ? 'On-Site & In-Shop'
      : service.serviceMode === 'on-site'
        ? 'On-Site'
        : 'In-Shop';

  return (
    <Link
      href={`/services/${service._id}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#F26A3D]/40 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#F26A3D]/30 h-full"
    >
      <div>
        {/* Media Thumbnail */}
        <div className="relative aspect-[16/10] w-full bg-muted/40 overflow-hidden">
          {service.image && !imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={service.image}
              alt={service.title}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-muted/60 text-muted-foreground/50">
              <Wrench className="h-8 w-8 transition-transform duration-300 group-hover:rotate-12 group-hover:text-[#F26A3D]" />
            </div>
          )}

          {/* Mode Pill */}
          <span className="absolute top-3 right-3 rounded-full bg-[#181C1A]/75 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white shadow-xs">
            {formattedMode}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#F26A3D]">
            {service.category}
          </span>

          <h3 className="font-bold text-base text-[#202522] tracking-tight line-clamp-1 transition-colors group-hover:text-[#F26A3D]">
            {service.title}
          </h3>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {service.description}
          </p>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
              <span>{service.estimatedDuration}</span>
            </span>

            {service.technicianName && (
              <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span className="truncate max-w-[120px]">{service.technicianName}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 sm:p-5 pt-0">
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div>
            <span className="text-[10px] text-muted-foreground font-medium block">Starting from</span>
            <span className="text-lg font-black text-[#202522]">${Number(service.basePrice).toFixed(0)}</span>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#202522] px-3.5 py-2 text-xs font-bold text-white transition-colors duration-200 group-hover:bg-[#F26A3D]">
            <span>Book</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
