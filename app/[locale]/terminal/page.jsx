import { setRequestLocale } from 'next-intl/server';
import Terminal from '@/components/Terminal';

export const metadata = {
  title: 'Terminal — patrikprikryl.com',
  description: "patrik@portfolio:~$ — type 'help' for a list of commands.",
  robots: { index: false, follow: true },
};

export default function TerminalPage({ params: { locale } }) {
  setRequestLocale(locale);
  return <Terminal />;
}
