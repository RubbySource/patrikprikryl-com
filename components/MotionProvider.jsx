'use client';

import { LazyMotion, domAnimation } from 'framer-motion';

/**
 * Wraps the app in LazyMotion so animated components can use the lightweight
 * `m` component instead of the full `motion` component. `domAnimation` ships
 * only the DOM animation feature set (~15 kB) instead of the full bundle
 * (~30 kB). `strict` throws if a component imports the heavy `motion` API,
 * guaranteeing the saving holds over time.
 */
export default function MotionProvider({ children }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
