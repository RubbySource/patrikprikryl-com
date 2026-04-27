import { blogPosts } from '@/data/blog';

const BASE_URL = 'https://patrikprikryl.com';
const LOCALES = ['en', 'cs', 'de'];

export default function sitemap() {
  const lastModified = new Date().toISOString();
  const entries = [];

  // Root URL (redirects to default locale)
  entries.push({
    url: BASE_URL,
    lastModified,
    changeFrequency: 'monthly',
    priority: 1.0,
  });

  // Per-locale homepage
  for (const locale of LOCALES) {
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: locale === 'cs' ? 1.0 : 0.8,
    });
  }

  // Blog posts (one entry per locale; empty until data/blog.js is populated)
  for (const post of blogPosts) {
    const postLastMod = new Date(post.date).toISOString();
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: postLastMod,
        changeFrequency: 'yearly',
        priority: 0.6,
      });
    }
  }

  // Easter-egg terminal page (low priority — discoverable, not promoted)
  for (const locale of LOCALES) {
    entries.push({
      url: `${BASE_URL}/${locale}/terminal`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    });
  }

  return entries;
}
