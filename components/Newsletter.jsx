'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function Newsletter() {
  const t = useTranslations('newsletter');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    if (status === 'loading' || status === 'success') return;
    setError('');
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || t('error_generic'));
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  return (
    <section id="newsletter" className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden border border-emerald-100 dark:border-emerald-900/40 bg-white dark:bg-[#0E1A12] p-10 sm:p-14 text-center shadow-sm"
        >
          {/* Forest-green gradient accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-emerald-700/10 pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-emerald-600 dark:text-emerald-400 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {t('label')}
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#111111] dark:text-[#F0F0F0] mb-4 leading-tight">
              {t('title')}
            </h2>
            <p className="text-base text-[#6B7280] dark:text-gray-400 mb-8 max-w-md mx-auto">
              {t('subtitle')}
            </p>

            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-medium text-sm"
              >
                <span aria-hidden="true">✅</span>
                {t('success')}
              </motion.div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto"
                noValidate
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  {t('email_label')}
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('email_placeholder')}
                  disabled={status === 'loading'}
                  className="flex-1 px-5 py-3.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-[#F0F0F0] placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={status === 'loading' || !email}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm active:scale-95 transition-all duration-200 shadow-lg shadow-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? t('submitting') : t('submit')}
                </button>
              </form>
            )}

            {status === 'error' && (
              <p
                role="alert"
                className="mt-4 text-sm text-red-600 dark:text-red-400"
              >
                {error || t('error_generic')}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
