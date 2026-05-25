'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { timeline } from '@/data/timeline';

/* ── Milestone type config — dot color + accent + icon ─────────────── */

const TYPE = {
  work: {
    dot: '#1A56DB',
    ring: 'ring-[#1A56DB]/15 dark:ring-[#1A56DB]/25',
    chip: 'text-[#1D4ED8] bg-[#EFF6FF] dark:text-[#93C5FD] dark:bg-[#1E3A5F]/30',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1Zm-5 0V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v2" />
    ),
  },
  education: {
    dot: '#059669',
    ring: 'ring-emerald-500/15 dark:ring-emerald-400/25',
    chip: 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-900/30',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4 2 9l10 5 10-5-10-5Zm0 5v8m-6-5v4c0 1.1 2.7 2 6 2s6-.9 6-2v-4" />
    ),
  },
  project: {
    dot: '#7C3AED',
    ring: 'ring-violet-500/15 dark:ring-violet-400/25',
    chip: 'text-violet-700 bg-violet-50 dark:text-violet-300 dark:bg-violet-900/30',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="m16 18 4-6-4-6M8 6l-4 6 4 6m6-13-4 14" />
    ),
  },
  award: {
    dot: '#B8962E',
    ring: 'ring-amber-500/20 dark:ring-amber-400/25',
    chip: 'text-[#92720D] bg-[#FEF3C7] dark:text-[#FDE68A] dark:bg-[#78350F]/30',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8m-4-4v4m5-17H7v4a5 5 0 0 0 10 0V4Zm0 1h3v2a3 3 0 0 1-3 3m-10-5H4v2a3 3 0 0 0 3 3" />
    ),
  },
};

function pickField(field, locale) {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[locale] ?? field.en ?? '';
}

// Largest 4-digit year found in the value — drives newest-first ordering
// and works for ranges like "2018–2021".
function sortKey(year) {
  const matches = String(year ?? '').match(/\d{4}/g);
  return matches ? Math.max(...matches.map(Number)) : 0;
}

/* ── Single milestone row ──────────────────────────────────────────── */

function Milestone({ item, index, locale, t }) {
  const type = TYPE[item.type] ?? TYPE.work;
  const role = pickField(item.role, locale);
  const company = pickField(item.company, locale);
  const location = pickField(item.location, locale);
  const description = pickField(item.description, locale);
  const typeLabel = t(`types.${item.type}`, {});

  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-[3.5rem_1fr] sm:grid-cols-[6rem_1fr] gap-x-4 sm:gap-x-8"
    >
      {/* Year — sticks while its card scrolls past */}
      <div className="sticky top-24 self-start h-fit text-right pt-0.5">
        <span className="font-display font-bold text-lg sm:text-2xl text-[#111111] dark:text-[#F0F0F0] tabular-nums tracking-tight">
          {item.year}
        </span>
        {item.current && (
          <span className="mt-1 inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            {t('now')}
          </span>
        )}
      </div>

      {/* Rail + dot + card */}
      <div className="relative border-l-2 border-gray-200 dark:border-gray-800 pl-6 sm:pl-9 pb-12 last:pb-0">
        {/* Dot on the rail */}
        <span
          aria-hidden="true"
          className={`absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-[#0A0A0A] ring-4 ${type.ring}`}
        >
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: type.dot }} />
        </span>

        <div className="group rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#141414] p-5 sm:p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-black/30 hover:border-[#1A56DB]/20 dark:hover:border-[#1A56DB]/30">
          {/* Type chip */}
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full mb-3 ${type.chip}`}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {type.icon}
            </svg>
            {typeLabel}
          </span>

          <h3 className="font-display font-bold text-lg sm:text-xl leading-snug text-[#111111] dark:text-[#F0F0F0]">
            {role}
          </h3>

          {(company || location) && (
            <p className="mt-1 text-sm font-medium text-[#6B7280] dark:text-gray-400">
              {[company, location].filter(Boolean).join(' · ')}
            </p>
          )}

          {description && (
            <p className="mt-3 text-sm sm:text-[15px] text-[#4B5563] dark:text-gray-400 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </motion.li>
  );
}

/* ── Section ───────────────────────────────────────────────────────── */

export default function Timeline() {
  const t = useTranslations('timeline');
  const locale = useLocale();

  if (!timeline.length) return null;

  const sorted = [...timeline].sort((a, b) => sortKey(b.year) - sortKey(a.year));

  return (
    <section id="journey" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-3xl"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-[#1A56DB] mb-4 block">
            {t('label')}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#111111] dark:text-[#F0F0F0]">
            {t('title')}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#6B7280] dark:text-gray-400">
            {t('subtitle')}
          </p>
        </motion.div>

        <ol className="max-w-3xl">
          {sorted.map((item, index) => (
            <Milestone
              key={`${item.year}-${index}`}
              item={item}
              index={index}
              locale={locale}
              t={t}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
