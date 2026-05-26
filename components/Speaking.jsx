'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { speaking } from '@/data/speaking';

/* ── Talk type config — chip color + icon ──────────────────────────── */

const TYPE = {
  keynote: {
    chip: 'text-[#1D4ED8] bg-[#EFF6FF] dark:text-[#93C5FD] dark:bg-[#1E3A5F]/30',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M5 4v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4M12 14v6m-3 0h6" />
    ),
  },
  conference: {
    chip: 'text-violet-700 bg-violet-50 dark:text-violet-300 dark:bg-violet-900/30',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h4v-1a3 3 0 0 0-2.4-2.94M9 20H3v-1a3 3 0 0 1 2.4-2.94m9.1-3.06a3 3 0 1 0-5 0M16 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM8 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
    ),
  },
  podcast: {
    chip: 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-900/30',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Zm-7 9a7 7 0 0 0 14 0M12 18v3m-3 0h6" />
    ),
  },
  interview: {
    chip: 'text-[#92720D] bg-[#FEF3C7] dark:text-[#FDE68A] dark:bg-[#78350F]/30',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 13.5h5M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5.5A8 8 0 1 1 21 12Z" />
    ),
  },
};

function pickField(field, locale) {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[locale] ?? field.en ?? '';
}

// Largest 4-digit year drives newest-first ordering; full dates beat bare years.
function sortKey(date) {
  const s = String(date ?? '');
  const m = s.match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/);
  if (!m) return 0;
  return Number(m[1]) * 10000 + Number(m[2] ?? 0) * 100 + Number(m[3] ?? 0);
}

// 'YYYY' → "2025"; 'YYYY-MM' → "March 2025"; 'YYYY-MM-DD' → "12 March 2025",
// all localised. Anything else is shown verbatim.
function formatDate(date, locale) {
  if (!date) return '';
  const s = String(date);
  const m = s.match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/);
  if (!m) return s;
  const [, y, mo, d] = m;
  if (!mo) return y;
  const dateObj = new Date(Number(y), Number(mo) - 1, d ? Number(d) : 1);
  const opts = d
    ? { year: 'numeric', month: 'long', day: 'numeric' }
    : { year: 'numeric', month: 'long' };
  try {
    return new Intl.DateTimeFormat(locale, opts).format(dateObj);
  } catch {
    return s;
  }
}

// Turns a YouTube or Spotify URL into an embeddable player descriptor.
function embedFor(url) {
  if (!url) return null;
  let u;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\./, '');

  if (host === 'youtu.be') {
    const id = u.pathname.split('/').filter(Boolean)[0];
    return id ? { kind: 'youtube', src: `https://www.youtube.com/embed/${id}` } : null;
  }
  if (host === 'youtube.com' || host === 'm.youtube.com') {
    const v = u.searchParams.get('v');
    if (v) return { kind: 'youtube', src: `https://www.youtube.com/embed/${v}` };
    const parts = u.pathname.split('/').filter(Boolean);
    if ((parts[0] === 'embed' || parts[0] === 'shorts') && parts[1]) {
      return { kind: 'youtube', src: `https://www.youtube.com/embed/${parts[1]}` };
    }
    return null;
  }
  if (host === 'open.spotify.com') {
    const [type, id] = u.pathname.split('/').filter(Boolean);
    if (id && ['episode', 'show', 'track', 'playlist'].includes(type)) {
      return { kind: 'spotify', src: `https://open.spotify.com/embed/${type}/${id}` };
    }
    return null;
  }
  return null;
}

/* ── Single talk card ──────────────────────────────────────────────── */

function TalkCard({ item, index, locale, t }) {
  const type = TYPE[item.type] ?? TYPE.keynote;
  const title = pickField(item.title, locale);
  const event = pickField(item.event, locale);
  const location = pickField(item.location, locale);
  const description = pickField(item.description, locale);
  const dateLabel = formatDate(item.date, locale);
  const embed = embedFor(item.videoUrl);
  const isPodcast = item.type === 'podcast' || embed?.kind === 'spotify';
  const ctaHref = item.videoUrl || item.link;

  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#141414] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-black/30 hover:border-[#1A56DB]/20 dark:hover:border-[#1A56DB]/30"
    >
      {/* Media — embed > image > nothing */}
      {embed?.kind === 'youtube' ? (
        <div className="aspect-video bg-gray-100 dark:bg-black/40">
          <iframe
            src={embed.src}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      ) : embed?.kind === 'spotify' ? (
        <iframe
          src={embed.src}
          title={title}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          className="w-full"
          height="152"
          style={{ border: 0 }}
        />
      ) : item.image ? (
        <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-black/40">
          <img
            src={item.image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Type chip + date */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${type.chip}`}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {type.icon}
            </svg>
            {t(`types.${item.type}`, {})}
          </span>
          {dateLabel && (
            <span className="text-xs font-medium text-[#9CA3AF] dark:text-gray-500 tabular-nums whitespace-nowrap">
              {dateLabel}
            </span>
          )}
        </div>

        <h3 className="font-display font-bold text-lg sm:text-xl leading-snug text-[#111111] dark:text-[#F0F0F0]">
          {title}
        </h3>

        {(event || location) && (
          <p className="mt-1 text-sm font-medium text-[#6B7280] dark:text-gray-400">
            {[event, location].filter(Boolean).join(' · ')}
          </p>
        )}

        {description && (
          <p className="mt-3 text-sm sm:text-[15px] text-[#4B5563] dark:text-gray-400 leading-relaxed">
            {description}
          </p>
        )}

        {/* External CTA only when there's no inline embed (the embed is the player) */}
        {ctaHref && !embed && (
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A56DB] hover:gap-2.5 transition-all focus-visible:outline-offset-4"
          >
            {isPodcast ? t('listen') : t('watch')}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        )}
      </div>
    </motion.li>
  );
}

/* ── Section ───────────────────────────────────────────────────────── */

export default function Speaking() {
  const t = useTranslations('speaking');
  const locale = useLocale();

  if (!speaking.length) return null;

  const sorted = [...speaking].sort((a, b) => sortKey(b.date) - sortKey(a.date));

  return (
    <section id="speaking" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-3xl"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-[#1A56DB] mb-4 block">
            {t('label')}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#111111] dark:text-[#F0F0F0]">
            {t('title')}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#6B7280] dark:text-gray-400">
            {t('subtitle')}
          </p>
        </motion.div>

        <ul className="grid gap-6 sm:grid-cols-2">
          {sorted.map((item, index) => (
            <TalkCard
              key={`${pickField(item.title, locale)}-${index}`}
              item={item}
              index={index}
              locale={locale}
              t={t}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
