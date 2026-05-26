'use client';

import { useEffect } from 'react';

export default function SmoothScroll({ children }) {
  useEffect(() => {
    // Disable browser scroll restoration — Lenis manages it
    if (typeof window !== 'undefined') {
      history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }

    // Skip smooth scroll entirely when the user prefers reduced motion —
    // also avoids loading the lenis chunk for those users.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let lenis;
    let rafId;
    let cancelled = false;

    // Lazy-load lenis after hydration so it stays out of the First Load JS
    // (~10 kB saved on every route, including ones that never scroll).
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
