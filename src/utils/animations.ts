export const prefersReducedMotion =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

export const fadeInUp = {
  initial: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: prefersReducedMotion ? 0 : 0.5, ease: 'easeOut' },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: prefersReducedMotion ? 0 : 0.4 },
};

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: prefersReducedMotion ? 0 : 0.1,
    },
  },
};

export const scaleIn = {
  initial: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: prefersReducedMotion ? 0 : 0.4 },
};
