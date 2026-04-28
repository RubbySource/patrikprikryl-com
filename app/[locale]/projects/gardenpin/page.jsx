import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import NetworkCanvas from '@/components/NetworkCanvas';
import GardenPinCaseStudy from '@/components/GardenPinCaseStudy';

const SITE_URL = 'https://patrikprikryl.com';

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  const path = locale === 'en' ? '/projects/gardenpin' : `/${locale}/projects/gardenpin`;
  return {
    title: t('gardenpin_title'),
    description: t('gardenpin_description'),
    alternates: {
      canonical: path,
      languages: {
        en: '/projects/gardenpin',
        cs: '/cs/projects/gardenpin',
        de: '/de/projects/gardenpin',
      },
    },
    openGraph: {
      title: t('gardenpin_title'),
      description: t('gardenpin_description'),
      url: `${SITE_URL}${path}`,
      siteName: 'Patrik Přikryl',
      type: 'article',
      locale: locale === 'cs' ? 'cs_CZ' : locale === 'de' ? 'de_DE' : 'en_US',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          type: 'image/png',
          alt: 'GardenPin — companion-planting garden planner',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('gardenpin_title'),
      description: t('gardenpin_description'),
      images: ['/og-image.png'],
    },
  };
}

export default async function GardenPinCaseStudyPage({ params: { locale } }) {
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'projects' });

  return (
    <>
      <NetworkCanvas />
      <main className="relative z-[1] min-h-screen text-[var(--text)]">
        <Navigation />

        <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <Link
            href={`/${locale}#projects`}
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--muted)] hover:text-[#1A56DB] transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('back_to_projects')}
          </Link>

          <GardenPinCaseStudy />
        </article>

        <Footer />
      </main>
    </>
  );
}
