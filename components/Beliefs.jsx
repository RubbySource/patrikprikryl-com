'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { beliefs } from '@/data/beliefs';

function BeliefCard({ belief, index, locale }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group relative overflow-hidden bg-[#1C1C1C] rounded-2xl p-8 sm:p-10 border border-white/5 hover:border-[#1A56DB]/30 transition-[border-color,box-shadow] duration-500 hover:shadow-2xl hover:shadow-blue-500/10 cursor-default"
    >
      {/* Large background number */}
      <div
        className="absolute -top-6 -right-2 font-display font-black text-[120px] sm:text-[160px] leading-none select-none pointer-events-none transition-all duration-500 group-hover:scale-105"
        style={{
          background: 'linear-gradient(180deg, rgba(26,86,219,0.06) 0%, transparent 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {belief.number}
      </div>

      {/* Number label */}
      <span className="relative text-xs font-semibold tracking-widest uppercase text-[#1A56DB]/60 mb-6 block">
        {belief.number}
      </span>

      {/* Statement */}
      <p className="relative font-display font-semibold text-xl sm:text-2xl text-[#F0F0F0] leading-snug">
        {belief.text[locale] ?? belief.text.en}
      </p>

      {/* Accent line on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#1A56DB] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl" />
    </motion.div>
  );
}

export default function Beliefs() {
  const t = useTranslations('beliefs');
  const locale = useLocale();

  return (
    <section id="beliefs" className="section-padding bg-[#111111] dark:bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#F0F0F0]">
            {t('title')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {beliefs.map((belief, index) => (
            <BeliefCard key={index} belief={belief} index={index} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
