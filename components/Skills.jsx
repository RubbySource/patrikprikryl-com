'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslations } from 'next-intl';

const AREA_KEYS = [
  'ai_integration',
  'product_development',
  'procurement_strategy',
  'digital_transformation',
  'speaking',
  'side_projects',
];

export default function Skills() {
  const t = useTranslations('skills');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="skills" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-12 lg:mb-16"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-[#1A56DB] mb-4 block">
            {t('label')}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[var(--text)] mb-6 leading-tight">
            {t('title')}
          </h2>
          <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {AREA_KEYS.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[#1A56DB]/40 transition-colors"
            >
              <h3 className="font-display font-semibold text-lg text-[var(--text)] mb-2">
                {t(`areas.${key}.name`)}
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {t(`areas.${key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
