'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Clock, Wrench, ArrowRight, User, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MotionButton } from '@/components/motion/motion-button';
import { buttonTapSpring } from '@/lib/motion/tokens';

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

  return (
    <motion.div
      whileHover={{ y: -5, transition: { type: 'spring', stiffness: 350, damping: 25 } }}
      className="group relative rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xs hover:shadow-xl hover:border-[#F26A3D]/40 transition-all duration-300 flex flex-col justify-between h-full"
    >
      <div>
        {/* Card Media Header */}
        <div className="relative h-48 w-full bg-muted/60 overflow-hidden">
          {service.image && !imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={service.image}
              alt={service.title}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-muted/90 to-muted">
              <Wrench className="h-10 w-10 text-muted-foreground/40 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-[11px] text-muted-foreground/70 font-bold mt-1.5 uppercase tracking-wider">
                FixMate Certified
              </span>
            </div>
          )}

          {/* Gradient Overlay on image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

          {/* Service Mode Badge */}
          <div className="absolute top-3.5 right-3.5 z-10">
            <Badge variant="sage" className="font-bold text-[10px] tracking-wide shadow-sm uppercase">
              {service.serviceMode}
            </Badge>
          </div>

          {/* Category Badge */}
          <div className="absolute top-3.5 left-3.5 z-10">
            <Badge variant="default" className="text-[11px] font-bold shadow-sm bg-[#202522]/90 backdrop-blur-xs text-white">
              {service.category}
            </Badge>
          </div>
        </div>

        {/* Card Details */}
        <div className="p-5 space-y-3">
          <div>
            <h3 className="font-bold text-base text-foreground line-clamp-1 group-hover:text-[#F26A3D] transition-colors">
              {service.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
              {service.description}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/60">
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              {service.estimatedDuration}
            </span>
            {service.technicianName && (
              <span className="flex items-center gap-1.5 font-semibold text-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                {service.technicianName}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-5 pt-0">
        <div className="flex items-center justify-between border-t border-border/60 pt-3.5">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">
              Estimated Base
            </span>
            <p className="text-xl font-black text-[#202522] leading-none mt-0.5">
              ${Number(service.basePrice).toFixed(2)}
            </p>
          </div>
          <Link href={`/services/${service._id}`}>
            <MotionButton
              size="sm"
              variant="graphite"
              className="rounded-xl font-bold text-xs px-3.5 group-hover:bg-[#F26A3D] transition-colors"
            >
              <span>Book Repair</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </MotionButton>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
