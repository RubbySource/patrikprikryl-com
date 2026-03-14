'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslations, useLocale } from 'next-intl';
import { awards } from '@/data/awards';

function AwardCard({ award, index, t, locale }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  // Pick the right locale from a multilingual field object; fall back to 'en'
  const f = (field) => {
    if (!field) return null;
    if (typeof field === 'string') return field;
    return field[locale] ?? field.en;
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="group relative bg-white dark:bg-[#141414] rounded-2xl p-7 border border-gray-100 dark:border-gray-800 hover:border-[#1A56DB]/30 dark:hover:border-[#1A56DB]/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5"
    >
      {/* Icon */}
      <div className="text-4xl mb-5">{award.icon}</div>

      {/* Subtitle */}
      <span className="text-xs font-semibold tracking-wider uppercase text-[#6B7280] mb-2 block">
        {f(award.subtitle)}
      </span>

      {/* Title */}
      <h3 className="font-display font-bold text-lg sm:text-xl text-[#111111] dark:text-[#F0F0F0] mb-2 leading-tight">
        {f(award.title)}
      </h3>

      {/* Project name */}
      {award.project && (
        <p className="text-sm font-semibold text-[#1A56DB] mb-3">
          {f(award.project)}
        </p>
      )}

      {/* Description */}
      <p className="text-sm text-[#6B7280] dark:text-gray-400 leading-relaxed mb-3">
        {f(award.description)}
      </p>

      {/* Role */}
      {award.role && (
        <p className="text-xs text-[#6B7280] dark:text-gray-500">
          <span className="font-semibold">{t('role_label')}:</span> {f(award.role)}
        </p>
      )}

      {/* Quote for Negobot awards */}
      {award.quote && (
        <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
          <blockquote className="text-sm italic text-[#6B7280] dark:text-gray-400 leading-relaxed">
            &ldquo;{award.quote}&rdquo;
          </blockquote>
        </div>
      )}

      {/* Negobot label + CACIO link */}
      {award.isNegobot && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B7280] bg-gray-50 dark:bg-gray-800 px-2.5 py-1.5 rounded-full">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Internal Project @ Škoda Auto
          </span>
          {award.url && (
            <a
              href={award.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A56DB] hover:text-[#1340B0] transition-colors"
            >
              More info →
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function Awards() {
  const t = useTranslations('awards');
  const locale = useLocale();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="awards" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {awards.map((award, index) => (
            <AwardCard key={index} award={award} index={index} t={t} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
