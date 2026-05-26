'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function LocaleError({ error, reset }) {
  const t = useTranslations('error500');
  const locale = useLocale();
  const home = locale === 'en' ? '/' : `/${locale}`;
  const contact = `${home === '/' ? '' : home}/#contact`;
  const terminal = `${home === '/' ? '' : home}/terminal`;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.error('App error boundary caught:', error);
    }
  }, [error]);

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(220, 38, 38, 0.12) 0%, transparent 55%), radial-gradient(ellipse at 75% 80%, rgba(26, 86, 219, 0.10) 0%, transparent 55%)',
        }}
      />

      <div className="relative max-w-3xl mx-auto text-center">
        <div
          aria-hidden="true"
          className="mx-auto mb-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center bg-[#1A56DB]/10 border-2 border-[#1A56DB]/30"
        >
          <svg className="w-12 h-12 sm:w-14 sm:h-14 text-[#1A56DB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>

        <p className="text-xs font-semibold tracking-[0.4em] uppercase text-[#1A56DB] mb-4">
          {t('error_label')}
        </p>

        <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl text-[var(--text)] leading-[1.05] mb-6">
          {t('title')}
        </h1>

        <p className="text-base sm:text-lg text-[var(--muted)] max-w-xl mx-auto mb-10 leading-relaxed">
          {t('text')}
        </p>

        {error?.digest ? (
          <p className="text-xs text-[var(--muted)]/70 font-mono mb-8 select-all">
            {t('digest_label')}: {error.digest}
          </p>
        ) : null}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A56DB] text-white font-semibold text-sm hover:bg-[#1340B0] active:scale-95 transition-all duration-200 shadow-lg shadow-blue-500/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {t('try_again')}
          </button>
          <Link
            href={home}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[var(--text)]/20 text-[var(--text)] font-semibold text-sm hover:border-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] active:scale-95 transition-all duration-200"
          >
            {t('back_home')}
          </Link>
          <Link
            href={contact}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[var(--text)] font-semibold text-sm hover:text-[#1A56DB] active:scale-95 transition-all duration-200"
          >
            {t('contact')}
          </Link>
        </div>

        <p className="mt-12 text-xs text-[var(--muted)]/80">
          {t('terminal_hint')}{' '}
          <Link href={terminal} className="font-mono font-semibold text-[#1A56DB] hover:underline underline-offset-4">
            {t('terminal_cta')}
          </Link>
        </p>
      </div>
    </main>
  );
}
