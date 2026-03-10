import { setRequestLocale } from 'next-intl/server';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import StatsBar from '@/components/StatsBar';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Awards from '@/components/Awards';
import Beliefs from '@/components/Beliefs';
import CoCreators from '@/components/CoCreators';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import BackToTop from '@/components/BackToTop';

export default function Home({ params: { locale } }) {
  setRequestLocale(locale);
  return (
    <main className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#111111] dark:text-[#F0F0F0]">
      <Navigation />
      <Hero />
      <StatsBar />
      <About />
      <Projects />
      <Awards />
      <Beliefs />
      <CoCreators />
      <Contact />
      <Footer />
      <CookieBanner />
      <BackToTop />
    </main>
  );
}
