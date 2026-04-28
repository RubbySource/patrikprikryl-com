'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function GetInTouch() {
  const t = useTranslations('getInTouch');

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#141414] p-10 sm:p-14 text-center shadow-sm"
        >
          {/* Subtle gradient accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A56DB]/5 via-transparent to-emerald-500/5 pointer-events-none" />

          <div className="relative z-10">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#1A56DB] mb-4 block">
              {t('label')}
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#111111] dark:text-[#F0F0F0] mb-4 leading-tight">
              {t('title')}
            </h2>
            <p className="text-base text-[#6B7280] dark:text-gray-400 mb-8 max-w-md mx-auto">
              {t('subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:pt.rubby@gmail.com"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#1A56DB] text-white font-semibold text-sm hover:bg-[#1340B0] active:scale-95 transition-all duration-200 shadow-lg shadow-blue-500/20"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t('email_cta')}
              </a>
              <a
                href="https://www.linkedin.com/in/patrikprikryl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border-2 border-gray-200 dark:border-gray-700 text-[#111111] dark:text-[#F0F0F0] font-semibold text-sm hover:border-[#1A56DB] hover:text-[#1A56DB] dark:hover:border-[#1A56DB] dark:hover:text-[#1A56DB] active:scale-95 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                {t('linkedin_cta')}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
