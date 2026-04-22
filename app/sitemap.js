export default function sitemap() {
  const baseUrl = 'https://patrikprikryl.com';
  const locales = ['en', 'cs', 'de'];
  const lastModified = new Date().toISOString();

  const routes = locales.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: locale === 'cs' ? 1.0 : 0.8,
  }));

  // Root URL (redirects to default locale)
  routes.unshift({
    url: baseUrl,
    lastModified,
    changeFrequency: 'monthly',
    priority: 1.0,
  });

  return routes;
}
