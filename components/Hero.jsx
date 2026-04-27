'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background gradient mesh */}
      <div className="gradient-mesh" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-5rem)]">

          {/* Text content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col justify-center order-1 pb-12 lg:pb-0"
          >
            <motion.div variants={item}>
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#1A56DB] mb-4">
                patrikprikryl.com
              </span>
            </motion.div>

            <motion.div variants={item} className="mb-5">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/60 px-3.5 py-1.5 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                {t('currently_building')}
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              className="font-bold text-[clamp(3rem,8vw,7rem)] leading-[0.9] tracking-[-0.03em] text-[#111111] dark:text-[#F0F0F0] mb-6"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Patrik
              <br />
              <span className="text-[#1A56DB]">{t('name_last')}</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="text-base sm:text-lg font-medium tracking-wide text-[#6B7280] dark:text-gray-400 mb-6"
            >
              {t('tagline')}
            </motion.p>

            <motion.p
              variants={item}
              className="text-base sm:text-lg text-[#4B5563] dark:text-gray-400 leading-relaxed max-w-xl mb-10"
            >
              {t('bio')}
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-4">
              <button
                onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A56DB] text-white font-semibold text-sm hover:bg-[#1340B0] active:scale-95 transition-all duration-200 shadow-lg shadow-blue-500/20"
              >
                {t('cta_projects')}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <a
                href="https://www.linkedin.com/in/patrikprikryl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#111111] dark:border-[#F0F0F0] text-[#111111] dark:text-[#F0F0F0] font-semibold text-sm hover:bg-[#111111] hover:text-white dark:hover:bg-[#F0F0F0] dark:hover:text-[#0A0A0A] active:scale-95 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                {t('cta_linkedin')}
              </a>
            </motion.div>
          </motion.div>

          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="order-2 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-sm lg:max-w-none lg:w-full aspect-[3/4] lg:aspect-[4/5] rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1A56DB]/10 to-transparent z-10 rounded-2xl" />
              <Image
                src="/patrik.jpg"
                alt="Patrik Přikryl"
                fill
                priority
                className="object-cover object-center rounded-2xl"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Decorative frame */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 dark:ring-white/5 z-20" />
            </div>
          </motion