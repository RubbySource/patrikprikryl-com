import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { notFound } from 'next/navigation';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import SmoothScroll from '@/components/SmoothScroll';
import TerminalShortcut from '@/components/TerminalShortcut';

const locales = ['en', 'cs', 'de'];

const FEED_TITLES = {
  en: 'Patrik Přikryl — Blog (EN)',
  cs: 'Patrik Přikryl — Blog (CS)',
  de: 'Patrik Přikryl — Blog (DE)',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  if (!locales.includes(locale)) return {};

  const feedHref = `/${locale}/blog/feed.xml`;
  return {
    alternates: {
      types: {
        'application/rss+xml': [
          { url: feedHref, title: FEED_TITLES[locale] },
        ],
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
