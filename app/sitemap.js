import { getAllPostsForLocale } from '@/lib/blog';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://patrikprikryl.com';
const LOCALES = ['en', 'cs', 'de'];
const DEFAULT_LOCALE = 'en';

// Match next-intl `localePrefix: 'as-needed'` — EN lives at root, others at /{locale}.
function localePath(locale, suffix = '') {
  if (locale === DEFAULT_LOCALE) return suffix || '/';
  return `/${locale}${suffix}`;
}

function localesEntry(buildSuffix) {
  return Object.fromEntries(
    LOCALES.map((l) => [l, `${BASE_URL}${localePath(l, buildSuffix)}`]),
  );
}

function entry({ url, lastModified, changeFrequency, priority, alternates }) {
  const out = { url, lastModified, changeFrequency, priority };
  if (alternates) out.alternates = { languages: alternates };
  return out;
}

export default function sitemap() {
  const now = new Date().toISOString();
  const entries = [];

  // Homepage — one canonical per locale, cross-linked via hreflang.
  for (const locale of LOCALES) {
    entries.push(
      entry({
        url: `${BASE_URL}${localePath(locale)}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 1.0,
        alternates: localesEntry(''),
      }),
    );
  }

  // Blog index per locale.
  for (const locale of LOCALES) {
    entries.push(
      entry({
        url: `${BASE_URL}${localePath(locale, '/blog')}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: localesEntry('/blog'),
      }),
    );
  }

  // GardenPin case study per locale.
  for (const locale of LOCALES) {
    entries.push(
      entry({
        url: `${BASE_URL}${localePath(locale, '/projects/gardenpin')}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: localesEntry('/projects/gardenpin'),
      }),
    );
  }

  // Health Analyzer case study per locale.
  for (const locale of LOCALES) {
    entries.push(
      entry({
        url: `${BASE_URL}${localePath(locale, '/projects/zdravotni')}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: localesEntry('/projects/zdravotni'),
      }),
    );
  }

  // Blog posts — only the slugs that actually exist for each locale.
  // Slugs can differ between locales (e.g. CZ "jak-jsem-postavil-gardenpin"
  // vs EN "how-i-built-gardenpin"), so we don't cross-link them via hreflang.
  for (const locale of LOCALES) {
    const posts = getAllPostsForLocale(locale);
    for (const post of posts) {
      entries.push(
        entry({
          url: `${BASE_URL}${localePath(locale, `/blog/${post.slug}`)}`,
          lastModified: post.date || now,
          changeFrequency: 'monthly',
          priority: 0.6,
        }),
      );
    }
  }

  // Easter-egg terminal page — discoverable, not promoted.
  for (const locale of LOCALES) {
    entries.push(
      entry({
        url: `${BASE_URL}${localePath(locale, '/terminal')}`,
        lastModified: now,
        changeFrequency: 'yearly',
        priority: 0.3,
        alternates: localesEntry('/terminal'),
      }),
    );
  }

  return entries;
}
