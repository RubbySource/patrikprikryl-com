import { getAllPosts } from '@/lib/blog';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://patrikprikryl.com';
const LOCALES = ['en', 'cs', 'de'];

export default function sitemap() {
  const lastModified = new Date().toISOString();

  const root = {
    url: BASE_URL,
    lastModified,
    changeFrequency: 'monthly',
    priority: 1.0,
  };

  const localeRoutes = LOCALES.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: locale === 'cs' ? 1.0 : 0.8,
  }));

  const blogIndex = LOCALES.map((locale) => ({
    url: `${BASE_URL}/${locale}/blog`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const blogPosts = getAllPosts().flatMap((post) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/blog/${post.slug}`,
      lastModified: post.date || lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
  );

  const gardenpin = LOCALES.map((locale) => ({
    url: `${BASE_URL}/${locale}/projects/gardenpin`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Easter-egg terminal page (low priority — discoverable, not promoted)
  const terminal = LOCALES.map((locale) => ({
    url: `${BASE_URL}/${locale}/terminal`,
    lastModified,
    changeFrequency: 'yearly',
    priority: 0.3,
  }));

  return [
    root,
    ...localeRoutes,
    ...blogIndex,
    ...blogPosts,
    ...gardenpin,
    ...terminal,
  ];
}
