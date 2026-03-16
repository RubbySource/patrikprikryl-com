'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useTranslations } from 'next-intl';
import { stats } from '@/data/stats';

function CountUp({ value, isInView }) {
  const [display, setDisplay] = useState('0');
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    // Extract numeric part if any
    const numMatch = value.match(/(\d+)/);
    if (!numMatch) {
      setDisplay(value);
      return;
    }

    const target = parseInt(numMatch[1]);
    const prefix = value.slice(0, numMatch.index);
    const suffix = value.slice(numMatch.index + numMatch[1].length);
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), target);
      setDisplay(`${prefix}${current}${suffix}`);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span>{display}</span>;
}

export default function StatsBar() {
  const t = useTranslations('stats');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <div ref={ref} className="bg-[#111111] dark:bg-[#141414] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center flex flex-col items-center gap-1"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'none' : 'translateY(16px)',
                transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`,
              }}
            >
              <span className="font-display font-bold text-3xl md:text-4xl text-white tabular-nums">
                <CountUp value={stat.value} isInView={inView} />
              </span>
              <span className="text-xs sm:text-sm text-gray-400 font-medium text-center leading-tight">
                {t(stat.key)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
