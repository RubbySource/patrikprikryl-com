'use client';

import { LazyMotion, domAnimation } from 'framer-motion';

/**
 * Wraps the app in LazyMotion so every `m.*` component lazy-loads only the
 * `domAnimation` feature bundle (animations, variants, exit + hover/tap/focus
 * gestures) instead of the full framer-motion runtime. Cuts ~25 kB off the
 * client First Load JS. `strict` makes any stray `motion.*` (the heavy variant)
 * throw, so regressions are caught at build/dev time rather than shipping.
 */
export default function MotionProvider({ children }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
