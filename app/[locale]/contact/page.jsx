import Link from 'next/link';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import NetworkCanvas from '@/components/NetworkCanvas';
import ContactForm from '@/components/ContactForm';
import StructuredData from '@/components/seo/StructuredData';
import { contactPageSchema } from '@/components/seo/schemas';

const SITE_URL = 'https://patrikprikryl.com';

const OG_LOCALES = { en: 'en_US', cs: 'cs_CZ', de: 'de_DE' };
const ogLocaleFor = (l) => OG_LOCALES[l] ?? 'en_US';
const alternateOgLocales = (l) =>
  Object.entries(OG_LOCALES).filter(([c]) => c !== l).map(([, tag]) => tag);

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const path = locale === 'en' ? '/contact' : `/${locale}/contact`;
  const ogTitle = t('contact_title');
  const ogSubtitle = t('contact_tagline');
  const ogUrl = `${SITE_URL}/api/og?kind=home&locale=${locale}&title=${encodeURIComponent(
    ogTitle,
  )}&subtitle=${encodeURIComponent(ogSubtitle)}`;
  return {
    title: { absolute: ogTitle },
    description: t('contact_description'),
    alternates: {
      canonical: path,
      languages: {
        en: '/contact',
        cs: '/cs/contact',
        de: '/de/contact',
      },
    },
    openGraph: {
      title: ogTitle,
      description: t('contact_description'),
      url: `${SITE_URL}${path}`,
      siteName: 'Patrik Přikryl',
      type: 'website',
      locale: ogLocaleFor(locale),
      alternateLocale: alternateOgLocales(locale),
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          type: 'image/png',
          alt: ogTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: t('contact_description'),
      images: [ogUrl],
    },
  };
}

const ArrowIcon = () => (
  <svg
    className="w-4 h-4 text-[var(--muted)] group-hover:text-[#1A56DB] transition-colors flex-shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

export default async function ContactPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'contactPage' });
  const homeHref = locale === 'en' ? '/' : `/${locale}`;

  return (
    <>
      <StructuredData data={contactPageSchema(locale)} />
      <NetworkCanvas />
      <main className="relative z-[1] min-h-screen text-[var(--text)]">
        <Navigation />

        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <Link
            href={homeHref}
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--muted)] hover:text-[#1A56DB] transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('back_home')}
          </Link>

          {/* Header */}
          <header className="mb-14">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#1A56DB] mb-4 block">
              {t('label')}
            </span>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-[var(--text)] mb-6 leading-tight">
              {t('title')}
            </h1>
            <p className="text-lg text-[var(--muted)] max-w-2xl">{t('subtitle')}</p>
          </header>

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-14 items-start">
            {/* Form */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
              <h2 className="font-display font-semibold text-xl text-[var(--text)] mb-6">
                {t('form_heading')}
              </h2>
              <ContactForm />
              <p className="text-xs text-[var(--muted)] mt-6">{t('response_note')}</p>
            </div>

            {/* Aside — links + location */}
            <aside className="flex flex-col gap-6">
              <div>
                <p className="text-xs font-semibold tracking-wider uppercase text-[var(--muted)] mb-3">
                  {t('links_label')}
                </p>
                <div className="flex flex-col gap-3">
                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/in/patrikprikryl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[#1A56DB]/40 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#1A56DB] flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[var(--text)] text-sm">{t('linkedin_name')}</p>
                      <p className="text-xs text-[var(--muted)] truncate">{t('linkedin_desc')}</p>
                    </div>
                    <ArrowIcon />
                  </a>

                  {/* GitHub */}
                  <a
                    href="https://github.com/RubbySource"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[#1A56DB]/40 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#111111] dark:bg-[#F0F0F0] flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white dark:text-[#111111]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[var(--text)] text-sm">{t('github_name')}</p>
                      <p className="text-xs text-[var(--muted)] truncate">{t('github_desc')}</p>
                    </div>
                    <ArrowIcon />
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-[#1A56DB]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-[#1A56DB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wider uppercase text-[var(--muted)]">
                      {t('location_label')}
                    </p>
                    <p className="font-semibold text-[var(--text)] text-sm">{t('location_city')}</p>
                  </div>
                </div>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{t('location_text')}</p>
              </div>
            </aside>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
