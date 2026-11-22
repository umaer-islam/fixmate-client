'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Clock, Wrench, ArrowRight, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
    <Card className="overflow-hidden group hover:shadow-md transition-shadow border-border/80 flex flex-col justify-between h-full bg-card">
      <div>
        {/* Card Media Header */}
        <div className="relative h-48 w-full bg-muted/60 overflow-hidden">
          {service.image && !imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={service.image}
              alt={service.title}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-muted/80 to-muted">
              <Wrench className="h-10 w-10 text-muted-foreground/50" />
              <span className="text-[11px] text-muted-foreground/70 font-medium mt-1">FixMate Certified</span>
            </div>
          )}

          {/* Service Mode Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant="sage" className="font-semibold text-[11px] shadow-xs">
              {service.serviceMode}
            </Badge>
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="default" className="text-[11px] shadow-xs">
              {service.category}
            </Badge>
          </div>
        </div>

        {/* Card Details */}
        <CardContent className="p-5 space-y-3">
          <div>
            <h3 className="font-bold text-base text-foreground line-clamp-1 group-hover:text-[#F26A3D] transition-colors">
              {service.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
              {service.description}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/60">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              {service.estimatedDuration}
            </span>
            {service.technicianName && (
              <span className="flex items-center gap-1 font-medium text-foreground">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                {service.technicianName}
              </span>
            )}
          </div>
        </CardContent>
      </div>

      {/* Card Footer Actions */}
      <div className="p-5 pt-0">
        <div className="flex items-center justify-between border-t border-border/60 pt-3">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              Starting From
            </span>
            <p className="text-lg font-black text-[#202522]">
              ${Number(service.basePrice).toFixed(2)}
            </p>
          </div>
          <Link href={`/services/${service._id}`}>
            <Button
              size="sm"
              className="bg-[#202522] text-[#F5F3EE] hover:bg-[#202522]/90 rounded-xl font-semibold text-xs px-3.5"
            >
              Book Repair <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
