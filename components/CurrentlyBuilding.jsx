'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const ITEMS = [
  { key: 'gardenpin', icon: '🌱', accent: 'emerald' },
  { key: 'health',    icon: '🩺', accent: 'sky' },
  { key: 'centralWeb', icon: '🖥️', accent: 'violet' },
];

const ACCENT = {
  emerald: 'from-emerald-500/15 to-emerald-700/10 border-emerald-100 dark:border-emerald-900/40',
  sky:     'from-sky-500/15 to-sky-700/10 border-sky-100 dark:border-sky-900/40',
  violet:  'from-violet-500/15 to-violet-700/10 border-violet-100 dark:border-violet-900/40',
};

const ease = [0.22, 1, 0.36, 1];

export default function CurrentlyBuilding() {
  const t = useTranslations('currentlyBuilding');

  return (
    <section
      id="currently-building"
      className="py-16 md:py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-emerald-600 dark:text-emerald-400">
            <LiveDot />
            {t('label')}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#111111] dark:text-[#F0F0F0] mt-3 mb-3 leading-tight">
            {t('title')}
          </h2>
          <p className="text-base text-[#6B7280] dark:text-gray-400 max-w-xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {ITEMS.map((item, idx) => (
            <motion.article
              key={item.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease, delay: idx * 0.08 }}
              whileHover={{ y: -4 }}
              className={`group relative overflow-hidden rounded-3xl border bg-white dark:bg-[#141414] p-6 sm:p-7 shadow-sm ${ACCENT[item.accent]}`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${ACCENT[item.accent]} opacity-60 pointer-events-none`}
              />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl" aria-hidden="true">{item.icon}</span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-emerald-700 dark:text-emerald-300">
                    <LiveDot />
                    {t('active')}
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl text-[#111111] dark:text-[#F0F0F0] mb-1.5 leading-tight">
                  {t(`items.${item.key}.name`)}
                </h3>
                <p className="text-sm text-[#6B7280] dark:text-gray-400 leading-relaxed mb-4">
                  {t(`items.${item.key}.description`)}
                </p>

                <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-800/60">
                  <span className="text-xs font-medium text-[#374151] dark:text-gray-300">
                    {t(`items.${item.key}.status`)}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LiveDot() {
  return (
    <span className="relative inline-flex w-2 h-2">
      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
      <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
    </span>
  );
}
