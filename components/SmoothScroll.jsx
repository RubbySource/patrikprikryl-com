'use client';

import { useEffect } from 'react';

export default function SmoothScroll({ children }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    let lenis = null;
    let rafId = 0;
    let cancelled = false;

    async function start() {
      if (cancelled) return;
      const { default: Lenis } = await import('lenis');
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
    }

    const triggers = ['wheel', 'touchmove', 'pointerdown', 'keydown'];
    let started = false;
    const onInteract = () => {
      if (started) return;
      started = true;
      teardownTriggers();
      start();
    };
    const teardownTriggers = () => {
      triggers.forEach((evt) => window.removeEventListener(evt, onInteract));
    };
    triggers.forEach((evt) =>
      window.addEventListener(evt, onInteract, { passive: true })
    );

    const idleHandle =
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(onInteract, { timeout: 2000 })
        : window.setTimeout(onInteract, 1500);

    return () => {
      cancelled = true;
      teardownTriggers();
      if (typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleHandle);
      } else {
        window.clearTimeout(idleHandle);
      }
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
