'use client';

import { useEffect } from 'react';

// Global scroll-reveal: any element with [data-animate] fades + slides
// into view exactly once when it intersects the viewport. Pairs with
// the [data-animate] / .is-visible CSS rules in globals.css.
export default function ScrollReveal() {
  useEffect(() => {
    const reveal = (el) => {
      el.classList.add('is-visible');
      io.unobserve(el);
    };

    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('[data-animate]').forEach((el) =>
        el.classList.add('is-visible')
      );
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    const observe = () =>
      document
        .querySelectorAll('[data-animate]:not(.is-visible)')
        .forEach((el) => io.observe(el));

    observe();

    // Pick up nodes inserted later (locale switches, etc.)
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
