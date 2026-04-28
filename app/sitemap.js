import { getAllPosts } from '@/lib/blog';

export default function sitemap() {
  const baseUrl = 'https://patrikprikryl.com';
  const locales = ['en', 'cs', 'de'];
  const lastModified = new Date().toISOString();

  const localeRoutes = locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: locale === 'cs' ? 1.0 : 0.8,
  }));

  const blogIndex = locales.map((locale) => ({
    url: `${baseUrl}/${locale}/blog`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const blogPosts = getAllPosts().flatMap((post) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: post.date || lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
  );

  const gardenpin = locales.map((locale) => ({
    url: `${baseUrl}/${locale}/projects/gardenpin`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    ...localeRoutes,
    ...blogIndex,
    ...blogPosts,
    ...gardenpin,
  ];
}
