import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import NetworkCanvas from '@/components/NetworkCanvas';
import HealthAnalyzerCaseStudy from '@/components/HealthAnalyzerCaseStudy';

const SITE_URL = 'https://patrikprikryl.com';

const OG_LOCALES = { en: 'en_US', cs: 'cs_CZ', de: 'de_DE' };
const ogLocaleFor = (l) => OG_LOCALES[l] ?? 'en_US';
const alternateOgLocales = (l) =>
  Object.entries(OG_LOCALES).filter(([c]) => c !== l).map(([, tag]) => tag);

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const path = locale === 'en' ? '/projects/zdravotni' : `/${locale}/projects/zdravotni`;
  const ogTitle = t('health_title');
  const ogSubtitle = t('health_description');
  const ogUrl = `${SITE_URL}/api/og?kind=post&locale=${locale}&title=${encodeURIComponent(
    ogTitle,
  )}&tag=${encodeURIComponent('Case Study')}&subtitle=${encodeURIComponent(ogSubtitle)}`;
  return {
    title: { absolute: ogTitle },
    description: ogSubtitle,
    alternates: {
      canonical: path,
      languages: {
        en: '/projects/zdravotni',
        cs: '/cs/projects/zdravotni',
        de: '/de/projects/zdravotni',
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogSubtitle,
      url: `${SITE_URL}${path}`,
      siteName: 'Patrik Přikryl',
      type: 'article',
      locale: ogLocaleFor(locale),
      alternateLocale: alternateOgLocales(locale),
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          type: 'image/png',
          alt: 'Health Analyzer — offline AI health tracker',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogSubtitle,
      images: [ogUrl],
    },
  };
}

export default async function HealthAnalyzerCaseStudyPage({ params }) {
  const { locale } = await params;
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
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--muted)] hover:text-pink-600 transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('back_to_projects')}
          </Link>

          <HealthAnalyzerCaseStudy />
        </article>

        <Footer />
      </main>
    </>
  );
}
