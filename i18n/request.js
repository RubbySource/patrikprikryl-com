import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'cs', 'de'];
const defaultLocale = 'en';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = locales.includes(requested) ? requested : defaultLocale;

  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});
