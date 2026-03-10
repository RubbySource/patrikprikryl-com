'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslations } from 'next-intl';
import { beliefs } from '@/data/beliefs';

function BeliefCard({ belief, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group relative overflow-hidden bg-white dark:bg-[#141414] rounded-2xl p-8 sm:p-10 border border-gray-100 dark:border-gray-800 hover:border-[#1A56DB]/20 dark:hover:border-[#1A56DB]/20 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5 cursor-default"
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
      <p className="relative font-display font-semibold text-xl sm:text-2xl text-[#111111] dark:text-[#F0F0F0] leading-snug">
        {belief.text}
      </p>

      {/* Accent line on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#1A56DB] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl" />
    </motion.div>
  );
}

export default function Beliefs() {
  const t = useTranslations('beliefs');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="section-padding bg-gray-50/50 dark:bg-[#0D0D0D]">
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
          {beliefs.map((belief, index) => (
            <BeliefCard key={index} belief={belief} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
