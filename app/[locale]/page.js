import { setRequestLocale } from 'next-intl/server';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import StatsBar from '@/components/StatsBar';
import Projects from '@/components/Projects';
import Awards from '@/components/Awards';
import Beliefs from '@/components/Beliefs';
import Skills from '@/components/Skills';
import CoCreators from '@/components/CoCreators';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import BackToTop from '@/components/BackToTop';
import ScrollNav from '@/components/ScrollNav';
import NetworkCanvas from '@/components/NetworkCanvas';

export default function Home({ params: { locale } }) {
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
        <Footer />
        <CookieBanner />
        <BackToTop />
        <ScrollNav />
      </main>
    </>
  );
}
