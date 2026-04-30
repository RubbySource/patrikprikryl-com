import { setRequestLocale, getTranslations } from 'next-intl/server';
import Terminal from '@/components/Terminal';

const SITE_URL = 'https://patrikprikryl.com';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const path = locale === 'en' ? '/terminal' : `/${locale}/terminal`;
  return {
    title: t('terminal_title'),
    description: t('terminal_description'),
    robots: { index: false, follow: true },
    openGraph: {
      title: t('terminal_title'),
      description: t('terminal_description'),
      url: `${SITE_URL}${path}`,
      siteName: 'Patrik Přikryl',
      type: 'website',
      locale: locale === 'cs' ? 'cs_CZ' : locale === 'de' ? 'de_DE' : 'en_US',
      images: [
        {
          url: '/og-default.svg',
          width: 1200,
          height: 630,
          type: 'image/svg+xml',
          alt: 'Terminal — patrikprikryl.com',
        },
      ],
    },
  };
}

export default async function TerminalPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Terminal />;
}
