'use client';

import { useState } from 'react';
import { m } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

/**
 * Reusable contact form — used both by the homepage <Contact /> section
 * and by the standalone /contact page.
 */
export default function ContactForm() {
  const t = useTranslations('contact');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        reset();
      } else {
        const payload = await response.json().catch(() => null);
        setError(payload?.error || t('error_generic'));
      }
    } catch {
      setError(t('error_generic'));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <m.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 text-center"
      >
        <div className="text-4xl mb-4">✉️</div>
        <p className="font-display font-semibold text-xl text-emerald-700 dark:text-emerald-400">
          {t('success')}
        </p>
      </m.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#111111] dark:text-[#F0F0F0] mb-1.5">
          {t('name')}
        </label>
        <input
          id="name"
          type="text"
          {...register('name', { required: true })}
          className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-[#1C1C1C] border text-[#111111] dark:text-[#F0F0F0] placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/50 focus:border-[#1A56DB] transition-all ${
            errors.name ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
          }`}
          placeholder={t('placeholder_name')}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#111111] dark:text-[#F0F0F0] mb-1.5">
          {t('email')}
        </label>
        <input
          id="email"
          type="email"
          {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
          className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-[#1C1C1C] border text-[#111111] dark:text-[#F0F0F0] placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/50 focus:border-[#1A56DB] transition-all ${
            errors.email ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
          }`}
          placeholder={t('placeholder_email')}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-[#111111] dark:text-[#F0F0F0] mb-1.5">
          {t('message')}
        </label>
        <textarea
          id="message"
          rows={5}
          {...register('message', { required: true })}
          className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-[#1C1C1C] border text-[#111111] dark:text-[#F0F0F0] placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/50 focus:border-[#1A56DB] transition-all resize-none ${
            errors.message ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
          }`}
          placeholder={t('placeholder_message')}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#1A56DB] text-white font-semibold text-sm hover:bg-[#1340B0] active:scale-95 transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t('sending')}
            </>
          ) : (
            t('send')
          )}
        </button>

        <a
          href="https://www.linkedin.com/in/patrikprikryl"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border-2 border-gray-200 dark:border-gray-700 text-[#111111] dark:text-[#F0F0F0] font-semibold text-sm hover:border-[#1A56DB] hover:text-[#1A56DB] active:scale-95 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          {t('linkedin_cta')}
        </a>
      </div>
    </form>
  );
}
