import { setRequestLocale, getTranslations } from 'next-intl/server';
import Terminal from '@/components/Terminal';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('terminal_title'),
    description: t('terminal_description'),
    robots: { index: false, follow: true },
  };
}

export default async function TerminalPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Terminal />;
}
