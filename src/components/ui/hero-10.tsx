'use client';

import * as React from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import Balancer from 'react-wrap-balancer';
import { cn } from '@/lib/utils';
import { Cta, type CtaProps } from '@/components/ui/hero-10-utils/cta';
import { DotField } from '@/components/ui/dot-field/dot-field';

export interface Hero10Props {
  badge?: React.ReactNode;
  title: string;
  titleLine2Prefix?: string;
  titleHighlight?: string;
  description: string;
  socialProof?: string;
  images: string[];
  imageAlts?: string[];
  animation?: 'none' | 'subtle';
  primaryCTA: CtaProps;
  secondaryCTA?: CtaProps;
  variant?: 'standard' | 'compact';
}

const variantStyles = {
  standard: {
    section: 'py-16 sm:py-24 lg:py-28',
    title: 'text-3xl sm:text-5xl lg:text-6xl leading-[1.08]',
    description: 'max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed',
    header: 'gap-5',
    content: 'gap-8 sm:gap-10',
    fan: 'max-w-3xl pt-2',
    fanCard: 'aspect-4/3 sm:aspect-16/10',
  },
  compact: {
    section: 'py-12 sm:py-16',
    title: 'text-2xl sm:text-4xl md:text-5xl leading-[1.1]',
    description: 'max-w-xl text-xs sm:text-sm leading-relaxed',
    header: 'gap-4',
    content: 'gap-6 sm:gap-8',
    fan: 'max-w-2xl pt-2',
    fanCard: 'aspect-4/3 sm:aspect-16/10',
  },
} as const;

const fanSlots = [
  { width: 'w-[36%]', layout: '-mr-6 z-10', rotate: -6, x: 40, ty: 20 },
  { width: 'w-[44%]', layout: 'z-20', rotate: 0, x: 0, ty: -10 },
  { width: 'w-[36%]', layout: '-ml-6 z-10', rotate: 6, x: -40, ty: 20 },
];

const fanContainer: Variants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.3,
      delayChildren: 0.4,
      staggerChildren: 0.1,
    },
  },
};

const fanCard: Variants = {
  hidden: (slot: (typeof fanSlots)[number]) => ({
    x: slot.x,
    rotate: slot.rotate,
    y: slot.ty,
    scale: 0.95,
  }),
  visible: (slot: (typeof fanSlots)[number]) => ({
    x: 0,
    rotate: slot.rotate,
    y: slot.ty,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

function Reveal({
  active,
  variants,
  className,
  children,
}: Readonly<{
  active: boolean;
  variants?: Variants;
  className?: string;
  children: React.ReactNode;
}>) {
  if (!active) return <div className={className}>{children}</div>;

  return (
    <motion.div variants={variants ?? item} className={className}>
      {children}
    </motion.div>
  );
}

function ImageFan({
  images,
  imageAlts,
  cardAspect,
  animate,
}: Readonly<{
  images: string[];
  imageAlts?: string[];
  cardAspect: string;
  animate: boolean;
}>) {
  return (
    <motion.div
      className="relative flex w-full items-center justify-center py-4"
      variants={fanContainer}
      initial={animate ? 'hidden' : false}
      whileInView={animate ? 'visible' : undefined}
      animate={animate ? undefined : 'visible'}
      viewport={{ once: true, margin: '-60px' }}
    >
      {images.slice(0, 3).map((src, i) => {
        const slot = fanSlots[i] ?? fanSlots[1];
        return (
          <motion.div
            key={src}
            custom={slot}
            variants={fanCard}
            whileHover={{ scale: 1.03, y: slot.ty - 6, transition: { duration: 0.2 } }}
            className={cn(
              'relative shrink-0 overflow-hidden rounded-3xl shadow-xl border border-border/80 bg-card',
              cardAspect,
              slot.width,
              slot.layout
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={imageAlts?.[i] ?? 'FixMate certified repair showcase'}
              decoding="async"
              onError={(e) => {
                // Verified high-res fallback image if source is unreachable
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
              }}
              className="size-full object-cover transition-transform duration-500 hover:scale-105"
            />
            {imageAlts?.[i] && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-6 pointer-events-none">
                <span className="text-[10px] sm:text-[11px] font-bold text-white tracking-wide drop-shadow-xs line-clamp-1">
                  {imageAlts[i]}
                </span>
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export function Hero10({
  badge,
  title,
  titleLine2Prefix,
  titleHighlight,
  description,
  socialProof,
  images,
  imageAlts,
  animation = 'none',
  primaryCTA,
  secondaryCTA,
  variant = 'standard',
}: Readonly<Hero10Props>) {
  const reduce = useReducedMotion();
  const animate = animation === 'subtle' && !reduce;
  const vs = variantStyles[variant];

  const titleElement = title && (
    <h1
      className={cn(
        'text-foreground font-black tracking-tight text-balance font-heading',
        vs.title
      )}
    >
      <Balancer>{title}</Balancer>
      {(titleLine2Prefix || titleHighlight) && (
        <>
          <br />
          <Balancer>
            {titleLine2Prefix && <span>{titleLine2Prefix} </span>}
            {titleHighlight && (
              <span className="text-[#F26A3D]">{titleHighlight}</span>
            )}
          </Balancer>
        </>
      )}
    </h1>
  );

  const descriptionElement = description && (
    <p className={cn('text-muted-foreground font-normal', vs.description)}>
      <Balancer>{description}</Balancer>
    </p>
  );

  const ctasElement = (primaryCTA?.ctaEnabled || secondaryCTA?.ctaEnabled) && (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 pt-2">
      {primaryCTA?.ctaEnabled && <Cta cta={primaryCTA} />}
      {secondaryCTA?.ctaEnabled && (
        <Cta
          cta={{ ...secondaryCTA, variant: secondaryCTA.variant ?? 'outline' }}
        />
      )}
    </div>
  );

  const socialProofElement = socialProof && (
    <p className="text-muted-foreground text-xs font-semibold tracking-wide">
      {socialProof}
    </p>
  );

  const mediaElement = images?.length ? (
    <ImageFan
      images={images}
      imageAlts={imageAlts}
      cardAspect={vs.fanCard}
      animate={animate}
    />
  ) : null;

  return (
    <section className="bg-gradient-to-b from-[#F5F3EE] via-[#F5F3EE] to-background relative isolate w-full overflow-hidden border-b border-border/60">
      {/* React Bits Interactive WebGL2 DotField Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-45">
        <DotField
          gradientFrom="#F26A3D"
          gradientTo="#202522"
          dotRadius={1.4}
          dotSpacing={16}
          cursorRadius={240}
          bulgeStrength={0.55}
          glowRadius={160}
          glowIntensity={0.9}
          lightMode
          opacity={0.7}
        />
      </div>

      <motion.div
        className={cn(
          'relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 sm:px-6 lg:px-8 text-center',
          vs.section,
          vs.content
        )}
        variants={animate ? container : undefined}
        initial={animate ? 'hidden' : false}
        whileInView={animate ? 'visible' : undefined}
        viewport={{ once: true, margin: '-60px' }}
      >
        {badge && (
          <Reveal active={animate}>
            <div className="mb-2">{badge}</div>
          </Reveal>
        )}

        <Reveal
          active={animate}
          className={cn(
            'flex w-full max-w-3xl flex-col items-center',
            vs.header
          )}
        >
          {titleElement}
          {descriptionElement}
        </Reveal>

        <Reveal active={animate} className="flex flex-col items-center gap-3.5">
          {ctasElement}
          {socialProofElement}
        </Reveal>

        <div className={cn('mx-auto w-full', vs.fan)}>{mediaElement}</div>
      </motion.div>
    </section>
  );
}

export default Hero10;
