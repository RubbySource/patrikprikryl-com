'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function ScrollNav() {
  const tn = useTranslations('nav');
  const tb = useTranslations('beliefs');
  const tc = useTranslations('cocreators');

  const sections = useMemo(() => [
    { id: 'hero',       label: 'Home' },
    { id: 'projects',   label: tn('projects') },
    { id: 'awards',     label: tn('awards') },
    { id: 'beliefs',    label: tb('label') },
    { id: 'cocreators', label: tc('label') },
    { id: 'contact',    label: tn('contact') },
  ], [tn, tb, tc]);

  const [active, setActive] = useState('hero');
  const [hovered, setHovered] = useState(null);
  const [scrollPct, setScrollPct] = useState(0);

  // Track overall scroll progress
  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setScrollPct(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observers = [];
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.15, rootMargin: '0px 0px -60% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [sections]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className="fixed top-1/2 -translate-y-1/2 z-50 hidden lg:block select-none"
      style={{ right: 'calc(50vw - 40rem - 2rem)' }}
    >
      <div className="relative flex flex-col items-end">

        {/* Track line — full height behind dots */}
        <div className="absolute right-[9px] inset-y-0 w-px overflow-hidden rounded-full">
          <div className="absolute inset-0 bg-gray-300/40 dark:bg-white/10" />
          <motion.div
            className="absolute top-0 left-0 right-0 bg-[#1A56DB] origin-top"
            style={{ height: '100%', scaleY: scrollPct, transformOrigin: 'top' }}
            transition={{ duration: 0.25 }}
          />
        </div>

        {sections.map((section) => {
          const isActive = active === section.id;
          const isHovered = hovered === section.id;

          return (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              onMouseEnter={() => setHovered(section.id)}
              onMouseLeave={() => setHovered(null)}
              aria-label={`Go to ${section.label}`}
              className="relative flex items-center justify-end gap-3 py-3.5 cursor-pointer"
            >
              {/* Label — only on hover, never overlaps content */}
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    key={`label-${section.id}`}
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 6 }}
                    transition={{ duration: 0.15 }}
                    className={`text-[10px] font-bold tracking-widest uppercase whitespace-nowrap ${
                      isActive
                        ? 'text-[#1A56DB]'
                        : 'text-[#6B7280] dark:text-gray-400'
                    }`}
                  >
                    {section.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Dot */}
              <div className="relative z-10 w-[18px] h-[18px] flex items-center justify-center">
                <motion.div
                  animate={{
                    width:  isActive ? 10 : isHovered ? 8 : 5,
                    height: isActive ? 10 : isHovered ? 8 : 5,
                    backgroundColor: isActive
                      ? '#1A56DB'
                      : isHovered
                      ? '#9CA3AF'
                      : '#D1D5DB',
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className="rounded-full"
                />
                {/* Pulse ring on active */}
                {isActive && (
                  <motion.div
                    className="absolute rounded-full border border-[#1A56DB]/60"
                    animate={{
                      width: [10, 24, 10],
                      height: [10, 24, 10],
                      opacity: [0.7, 0, 0.7],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}
              </div>
            </button>
          );
        })}

        {/* Scroll % — floats along the progress line */}
        <motion.span
          className="absolute text-[9px] font-mono text-[#1A56DB]/70 dark:text-[#1A56DB]/60 whitespace-nowrap pointer-events-none -translate-y-1/2"
          style={{ top: `${scrollPct * 100}%`, right: '1.5rem' }}
          animate={{ opacity: scrollPct > 0.02 && scrollPct < 0.97 ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {Math.round(scrollPct * 100)}%
        </motion.span>
      </div>
    </div>
  );
}
