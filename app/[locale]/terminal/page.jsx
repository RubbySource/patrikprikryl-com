import { setRequestLocale, getTranslations } from 'next-intl/server';
import Terminal from '@/components/Terminal';

export async function generateMetadata({ params: { locale } }) {
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('terminal_title'),
    description: t('terminal_description'),
    robots: { index: false, follow: true },
  };
}

export default function TerminalPage({ params: { locale } }) {
  setRequestLocale(locale);
  return <Terminal />;
}
