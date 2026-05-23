'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { testimonials } from '@/data/testimonials';

const avatarColors = [
  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
];

function pickField(field, locale) {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[locale] ?? field.en ?? '';
}

function TestimonialCard({ person, index, locale }) {
  const colorClass = avatarColors[index % avatarColors.length];
  const role = pickField(person.role, locale);
  const quote = pickField(person.quote, locale);

  return (
    <motion.figure
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="group relative flex flex-col bg-white dark:bg-[#141414] rounded-2xl p-7 border border-gray-100 dark:border-gray-800 hover:border-[#1A56DB]/20 dark:hover:border-[#1A56DB]/30 transition-[border-color,box-shadow,transform] duration-300 hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-black/30 hover:-translate-y-0.5"
    >
      <svg
        aria-hidden="true"
        className="absolute top-5 right-6 w-9 h-9 text-[#1A56DB]/15 dark:text-[#1A56DB]/20 group-hover:text-[#1A56DB]/25 transition-colors"
        viewBox="0 0 32 32"
        fill="currentColor"
      >
        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36 1 24.4 4.024 28 8.2 28c3.336 0 5.84-2.664 5.84-5.84 0-3.168-2.336-5.504-5.336-5.504-.504 0-1.176.104-1.344.168.504-3.336 3.672-7.336 6.84-9.336L9.352 4Zm17.5 0c-4.832 3.456-8.296 9.12-8.296 15.36 0 5.04 3.024 8.64 7.2 8.64 3.336 0 5.84-2.664 5.84-5.84 0-3.168-2.336-5.504-5.336-5.504-.504 0-1.176.104-1.344.168.504-3.336 3.672-7.336 6.84-9.336L26.852 4Z" />
      </svg>

      <blockquote className="relative text-base text-[#111111] dark:text-[#F0F0F0] leading-relaxed mb-6 pr-8">
        “{quote}”
      </blockquote>

      <figcaption className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
        {person.image ? (
          <div className="flex-shrink-0 w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-100 dark:ring-gray-700">
            <Image
              src={person.image}
              alt={person.name}
              width={44}
              height={44}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-sm ${colorClass}`}>
            {person.initials}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-display font-semibold text-sm text-[#111111] dark:text-[#F0F0F0] truncate">
              {person.name}
            </p>
            {person.linkedin && (
              <a
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 text-[#6B7280] dark:text-gray-400 hover:text-[#1A56DB] dark:hover:text-[#1A56DB] transition-colors"
                aria-label={`${person.name} on LinkedIn`}
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            )}
          </div>
          <p className="text-xs text-[#6B7280] dark:text-gray-400 truncate">
            {[role, person.company].filter(Boolean).join(' · ')}
          </p>
        </div>
      </figcaption>
    </motion.figure>
  );
}

function Placeholder() {
  const t = useTranslations('testimonials');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl border border-dashed border-gray-200 dark:border-gray-700/70 bg-white/60 dark:bg-[#141414]/60 backdrop-blur-sm p-10 sm:p-12 text-center"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A56DB]/[0.04] via-transparent to-emerald-500/[0.04] pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1A56DB]/10 text-[#1A56DB] mb-5">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.25c0-.97.79-1.75 1.76-1.75H8.5l-1.6 4.8a3.2 3.2 0 0 1-3.04 2.2H3V8.25Zm11.5 0c0-.97.79-1.75 1.76-1.75H20l-1.6 4.8a3.2 3.2 0 0 1-3.04 2.2h-.86V8.25Z" />
          </svg>
        </div>

        <h3 className="font-display font-semibold text-2xl sm:text-3xl text-[#111111] dark:text-[#F0F0F0] mb-3 leading-snug">
          {t('placeholder_title')}
        </h3>
        <p className="text-base text-[#6B7280] dark:text-gray-400 mb-7 leading-relaxed">
          {t('placeholder_text')}
        </p>

        <a
          href="#contact"
          onClick={(e) => {
            const el = document.getElementById('contact');
            if (el) {
              e.preventDefault();
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1A56DB] text-white font-semibold text-sm hover:bg-[#1340B0] active:scale-95 transition-all duration-200 shadow-lg shadow-blue-500/20"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 0 1-4.255-.949L3 20l1.395-3.72A7.96 7.96 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z" />
          </svg>
          {t('placeholder_cta')}
        </a>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const t = useTranslations('testimonials');
  const locale = useLocale();
  const hasContent = testimonials.length > 0;

  return (
    <section id="testimonials" className="section-padding">
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
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#111111] dark:text-[#F0F0F0]">
            {t('title')}
          </h2>
          {hasContent && (
            <p className="mt-4 text-base sm:text-lg text-[#6B7280] dark:text-gray-400 max-w-2xl">
              {t('subtitle')}
            </p>
          )}
        </motion.div>

        {hasContent ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((person, index) => (
              <TestimonialCard key={person.name} person={person} index={index} locale={locale} />
            ))}
          </div>
        ) : (
          <Placeholder />
        )}
      </div>
    </section>
  );
}
