/**
 * FixMate Central Motion System Tokens
 * Aligned with the "Precision Workshop" aesthetic:
 * - Warm Ivory (#F5F3EE)
 * - Graphite (#202522)
 * - Repair Orange (#F26A3D)
 * - Muted Sage (#DCE8DE)
 */

export const motionDurations = {
  instant: 0.1,
  fast: 0.18,
  normal: 0.28,
  slow: 0.42,
  reveal: 0.65,
};

export const motionEasings = {
  // Smooth deceleration for entrances
  easeOutCubic: [0.215, 0.61, 0.355, 1] as const,
  // Snappy modern acceleration-deceleration
  easeInOutQuart: [0.77, 0, 0.175, 1] as const,
  // Smooth natural mechanical motion
  workshop: [0.16, 1, 0.3, 1] as const,
};

export const motionSprings = {
  // For buttons, chips, micro-interactions
  snappy: { type: 'spring' as const, stiffness: 420, damping: 28 },
  // For cards, modals, dropdowns
  smooth: { type: 'spring' as const, stiffness: 260, damping: 25 },
  // For gentle reveals and floating badges
  gentle: { type: 'spring' as const, stiffness: 140, damping: 20 },
};

// Reusable standard Framer/Motion variants
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: motionDurations.normal, ease: motionEasings.workshop },
  },
  exit: {
    opacity: 0,
    transition: { duration: motionDurations.fast },
  },
};

export const slideUpVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDurations.normal, ease: motionEasings.workshop },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: motionDurations.fast },
  },
};

export const scaleUpVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: motionSprings.smooth,
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: motionDurations.fast },
  },
};

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const buttonTapSpring = {
  scale: 0.97,
  transition: { type: 'spring' as const, stiffness: 500, damping: 25 },
};

export const cardHoverSpring = {
  y: -4,
  transition: { type: 'spring' as const, stiffness: 350, damping: 25 },
};
