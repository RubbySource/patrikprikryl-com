'use client';

import { m } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { mediaMentions } from '@/data/mediaMentions';

// Above this many entries the strip becomes an auto-scrolling marquee;
// below it, the logos are simply centred (a marquee of 3 logos looks silly).
const MARQUEE_THRESHOLD = 6;

function Logo({ item }) {
  const inner = item.logoUrl ? (
    <img
      src={item.logoUrl}
      alt={item.name}
      title={item.date || undefined}
      loading="lazy"
      className="h-7 sm:h-8 w-auto object-contain opacity-60 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0 dark:opacity-50"
    />
  ) : (
    <span
      title={item.date || undefined}
      className="font-display font-bold text-base sm:text-lg tracking-tight whitespace-nowrap text-[#9CA3AF] dark:text-gray-500 transition-colors duration-300 group-hover:text-[#111111] dark:group-hover:text-[#F0F0F0]"
    >
      {item.name}
    </span>
  );

  if (item.articleUrl) {
    return (
      <a
        href={item.articleUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={item.name}
        className="group inline-flex items-center focus-visible:outline-offset-4"
      >
        {inner}
      </a>
    );
  }

  return <span className="group inline-flex items-center">{inner}</span>;
}

export default function MediaMentions() {
  const t = useTranslations('mediaMentions');

  if (!mediaMentions.length) return null;

  const scroll = mediaMentions.length > MARQUEE_THRESHOLD;

  return (
    <section
      aria-label={t('aria')}
      className="border-y border-gray-100 dark:border-gray-800/70 bg-gray-50/40 dark:bg-white/[0.02]"
    >
      <m.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12"
      >
        <p className="text-center text-xs font-semibold tracking-widest uppercase text-[#6B7280] dark:text-gray-500 mb-8">
          {t('label')}
        </p>

        {scroll ? (
          // Seamless marquee — the list is duplicated and translated -50%.
          // Pauses on hover; static (no animation) under prefers-reduced-m.
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
            <ul className="flex w-max items-center gap-x-12 sm:gap-x-16 motion-safe:animate-marquee hover:[animation-play-state:paused]">
              {[...mediaMentions, ...mediaMentions].map((item, i) => (
                <li key={`${item.name}-${i}`} aria-hidden={i >= mediaMentions.length}>
                  <Logo item={item} />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
            {mediaMentions.map((item) => (
              <li key={item.name}>
                <Logo item={item} />
              </li>
            ))}
          </ul>
        )}
      </m.div>
    </section>
  );
}
