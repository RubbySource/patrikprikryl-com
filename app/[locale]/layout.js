import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';
import { notFound } from 'next/navigation';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import SmoothScroll from '@/components/SmoothScroll';
import TerminalShortcut from '@/components/TerminalShortcut';

const locales = ['en', 'cs', 'de'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params: { locale } }) {
  if (!locales.includes(locale)) notFound();

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
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
