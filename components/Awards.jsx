'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { awards } from '@/data/awards';

/* ── Award-level config ───────────────────────────────────────────── */

const LEVEL = {
  trophy: {
    dot:    '#B8962E',           // warm gold
    border: 'border-[#B8962E]/60',
    hoverBorder: 'hover:border-[#B8962E]',
    badge:  'text-[#92720D] bg-[#FEF3C7] dark:text-[#FDE68A] dark:bg-[#78350F]/30',
    label:  { en: 'Winner', cs: 'Vítěz', de: 'Gewinner' },
  },
  star: {
    dot:    '#2563EB',
    border: 'border-[#2563EB]/40',
    hoverBorder: 'hover:border-[#2563EB]/80',
    badge:  'text-[#1D4ED8] bg-[#EFF6FF] dark:text-[#93C5FD] dark:bg-[#1E3A5F]/30',
    label:  { en: 'Finalist', cs: 'Finalista', de: 'Finalist' },
  },
};

/* ── Card ─────────────────────────────────────────────────────────── */

function AwardCard({ award, index, t, locale }) {
  const f = (field) => {
    if (!field) return null;
    if (typeof field === 'string') return field;
    return field[locale] ?? field.en;
  };

  const level     = LEVEL[award.icon] ?? LEVEL.star;
  const badgeText = level.label[locale] ?? level.label.en;

  // Extract year from subtitle for the decorative element
  const subtitleStr = f(award.subtitle) ?? '';
  const yearMatch   = subtitleStr.match(/\b(20\d{2})\b/);
  const year        = yearMatch ? yearMatch[1] : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`
        group relative flex flex-col overflow-hidden
        bg-white dark:bg-[#111111]
        rounded-2xl border ${level.border} ${level.hoverBorder}
        transition-[border-color,box-shadow] duration-300
        hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30
      `}
    >
      {/* Decorative year — large muted background text */}
      {year && (
        <span
          aria-hidden="true"
          className="absolute -top-3 right-4 font-display font-black text-[80px] leading-none select-none pointer-events-none text-black/[0.035] dark:text-white/[0.04]"
        >
          {year}
        </span>
      )}

      <div className="relative flex flex-col flex-1 p-7">

        {/* Top row — org + status badge */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <span className="block text-[11px] font-bold tracking-[0.12em] uppercase text-[#6B7280] dark:text-gray-500">
              {/* Org name only (first segment before ·) */}
              {subtitleStr.split('·')[0].trim()}
            </span>
            <span className="block text-[11px] tracking-wide text-[#9CA3AF] dark:text-gray-600 mt-0.5">
              {/* Rest: · March 2024 · 21st edition */}
              {subtitleStr.split('·').slice(1).join('·').trim()}
            </span>
          </div>

          <span className={`shrink-0 inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${level.badge}`}>
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: level.dot }}
            />
            {badgeText}
          </span>
        </div>

        {/* Award title */}
        <h3 className="font-display font-bold text-[1.15rem] sm:text-xl leading-snug text-[#111111] dark:text-[#F0F0F0] mb-3">
          {f(award.title)}
        </h3>

        {/* Project chip */}
        {award.project && (
          <span
            className="inline-block self-start text-xs font-semibold tracking-wide px-2.5 py-1 rounded-md mb-4"
            style={{ color: level.dot, background: `${level.dot}14` }}
          >
            {f(award.project)}
          </span>
        )}

        {/* Description */}
        <p className="text-sm text-[#6B7280] dark:text-gray-400 leading-relaxed">
          {f(award.description)}
        </p>

        {/* Role */}
        {award.role && (
          <p className="mt-2 text-xs text-[#9CA3AF] dark:text-gray-500">
            <span className="font-semibold text-[#6B7280] dark:text-gray-400">{t('role_label')}: </span>
            {f(award.role)}
          </p>
        )}

        {/* Quote */}
        {award.quote && (
          <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800/80">
            <blockquote className="text-sm italic text-[#6B7280] dark:text-gray-400 leading-relaxed before:content-['“'] after:content-['”'] before:not-italic after:not-italic before:text-[#9CA3AF] after:text-[#9CA3AF]">
              {award.quote}
            </blockquote>
          </div>
        )}

        {/* Spacer pushes footer to bottom */}
        <div className="flex-1" />

        {/* Footer — internal badge + link */}
        {(award.isNegobot || award.url) && (
          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800/80 flex flex-wrap items-center gap-3">
            {award.isNegobot && (
              <span className="text-[10px] font-semibold tracking-widest uppercase text-[#9CA3AF] dark:text-gray-600">
                {t('internal_project')} @ Škoda Auto
              </span>
            )}
            {award.url && (
              <a
                href={award.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[#6B7280] dark:text-gray-400 hover:text-[#111111] dark:hover:text-white transition-colors"
              >
                {t('more_info')}
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2.5 9.5l7-7M9.5 9V2.5H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ── Section ──────────────────────────────────────────────────────── */

export default function Awards() {
  const t      = useTranslations('awards');
  const locale = useLocale();

  return (
    <section id="awards" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-[#1A56DB] mb-4 block">
            {t('label')}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#111111] dark:text-[#F0F0F0]">
            {t('title')}
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {awards.map((award, index) => (
            <AwardCard
              key={index}
              award={award}
              index={index}
              t={t}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
