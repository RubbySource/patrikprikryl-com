import { setRequestLocale, getTranslations } from 'next-intl/server';
import Terminal from '@/components/Terminal';

const SITE_URL = 'https://patrikprikryl.com';

const OG_LOCALES = { en: 'en_US', cs: 'cs_CZ', de: 'de_DE' };
const ogLocaleFor = (l) => OG_LOCALES[l] ?? 'en_US';
const alternateOgLocales = (l) =>
  Object.entries(OG_LOCALES).filter(([c]) => c !== l).map(([, tag]) => tag);

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const path = locale === 'en' ? '/terminal' : `/${locale}/terminal`;
  return {
    title: { absolute: t('terminal_title') },
    description: t('terminal_description'),
    alternates: {
      canonical: path,
      languages: {
        en: '/terminal',
        cs: '/cs/terminal',
        de: '/de/terminal',
      },
    },
    robots: { index: false, follow: true },
    openGraph: {
      title: t('terminal_title'),
      description: t('terminal_description'),
      url: `${SITE_URL}${path}`,
      siteName: 'Patrik Přikryl',
      type: 'website',
      locale: ogLocaleFor(locale),
      alternateLocale: alternateOgLocales(locale),
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          type: 'image/png',
          alt: 'Terminal — patrikprikryl.com',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('terminal_title'),
      description: t('terminal_description'),
      images: ['/og-image.png'],
    },
  };
}

export default async function TerminalPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Terminal />;
}
