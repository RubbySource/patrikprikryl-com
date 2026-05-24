'use client';

import { useEffect } from 'react';

/**
 * Lenis smooth-scroll wrapper.
 *
 * Lenis (~10 kB) is dynamically imported inside the effect so it never lands
 * in the initial JS bundle — it loads after hydration, off the critical path.
 * The cleanup guards against the import resolving after unmount.
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    // Disable browser scroll restoration — Lenis manages it
    if (typeof window !== 'undefined') {
      history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }

    let lenis;
    let rafId;
    let cancelled = false;

    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return;

      lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      function raf(time) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);
    });

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
