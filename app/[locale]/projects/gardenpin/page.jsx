import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import NetworkCanvas from '@/components/NetworkCanvas';
import GardenPinCaseStudy from '@/components/GardenPinCaseStudy';

export const metadata = {
  title: 'GardenPin — Case Study | Patrik Přikryl',
  description:
    'A weekend build: how GardenPin grew from a Moleskine sketch into a working garden-planning app with companion-planting recommendations, offline mode, and a hand-rolled canvas grid.',
};

export default function GardenPinCaseStudyPage({ params: { locale } }) {
  setRequestLocale(locale);

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
            Back to projects
          </Link>

          <GardenPinCaseStudy />
        </article>

        <Footer />
      </main>
    </>
  );
}
