import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { notFound } from 'next/navigation';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import SmoothScroll from '@/components/SmoothScroll';
import TerminalShortcut from '@/components/TerminalShortcut';

const locales = ['en', 'cs', 'de'];

const SITE_URL = 'https://patrikprikryl.com';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const blogPath = locale === 'en' ? '/blog' : `/${locale}/blog`;
  return {
    alternates: {
      types: {
        'application/rss+xml': `${SITE_URL}${blogPath}/feed.xml`,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <TerminalShortcut />
        <GoogleAnalytics />
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
