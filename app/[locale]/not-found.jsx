import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import NotFoundScene from '@/components/NotFoundScene';
import Navigation from '@/components/Navigation';
import NetworkCanvas from '@/components/NetworkCanvas';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('notfound_title'),
    description: t('notfound_description'),
    robots: { index: false, follow: true },
  };
}

export default async function LocaleNotFound({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  const t = await getTranslations({ locale, namespace: 'notfound' });
  const home = locale === 'en' ? '/' : `/${locale}`;
  const blog = locale === 'en' ? '/blog' : `/${locale}/blog`;

  return (
    <>
      <NetworkCanvas />
      <main className="relative z-[1] min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden text-[var(--text)]">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse at 30% 20%, rgba(13, 74, 42, 0.18) 0%, transparent 55%), radial-gradient(ellipse at 75% 80%, rgba(26, 86, 219, 0.10) 0%, transparent 55%)',
          }}
        />

        <Navigation />

        <div className="relative max-w-3xl mx-auto text-center pt-16">
          <NotFoundScene />

          <p className="text-xs font-semibold tracking-[0.4em] uppercase text-[#1A56DB] mt-10 mb-4">
            {t('error_label')}
          </p>

          <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl text-[var(--text)] leading-[1.05] mb-6">
            {t('title')}
          </h1>

          <p className="text-base sm:text-lg text-[var(--muted)] max-w-xl mx-auto mb-10 leading-relaxed">
            {t('text')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={home}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A56DB] text-white font-semibold text-sm hover:bg-[#1340B0] active:scale-95 transition-all duration-200 shadow-lg shadow-blue-500/20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('back_home')}
            </Link>
            <Link
              href={blog}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[var(--text)]/20 text-[var(--text)] font-semibold text-sm hover:border-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] active:scale-95 transition-all duration-200"
            >
              {t('read_blog')}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
