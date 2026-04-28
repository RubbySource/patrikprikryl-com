import { setRequestLocale, getTranslations } from 'next-intl/server';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import StatsBar from '@/components/StatsBar';
import Projects from '@/components/Projects';
import Awards from '@/components/Awards';
import Beliefs from '@/components/Beliefs';
import Skills from '@/components/Skills';
import CoCreators from '@/components/CoCreators';
import Contact from '@/components/Contact';
import GetInTouch from '@/components/GetInTouch';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import BackToTop from '@/components/BackToTop';
import ScrollNav from '@/components/ScrollNav';
import NetworkCanvas from '@/components/NetworkCanvas';

const SITE_URL = 'https://patrikprikryl.com';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const path = locale === 'en' ? '/' : `/${locale}`;
  return {
    title: t('home_title'),
    description: t('home_description'),
    alternates: {
      canonical: path,
      languages: {
        en: '/',
        cs: '/cs',
        de: '/de',
      },
    },
    openGraph: {
      title: t('home_title'),
      description: t('home_description'),
      url: `${SITE_URL}${path}`,
      siteName: 'Patrik Přikryl',
      type: 'website',
      locale: locale === 'cs' ? 'cs_CZ' : locale === 'de' ? 'de_DE' : 'en_US',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          type: 'image/png',
          alt: t('og_alt'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('home_title'),
      description: t('home_description'),
      images: ['/og-image.png'],
    },
  };
}

export default async function Home({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      {/* Global network background — fixed, behind all content */}
      <NetworkCanvas />

      <main className="relative z-[1] min-h-screen text-[#111111] dark:text-[#F0F0F0]">
        <Navigation />
        <Hero />
        <StatsBar />
        <Projects />
        <Awards />
        <Beliefs />
        <Skills />
        <CoCreators />
        <Contact />
        <GetInTouch />
        <Newsletter />
        <Footer />
        <CookieBanner />
        <BackToTop />
        <ScrollNav />
      </main>
    </>
  );
}
