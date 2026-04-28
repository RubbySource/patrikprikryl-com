'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function TerminalShortcut() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    function onKey(e) {
      // Ctrl+` opens the terminal from anywhere on the site
      if (e.ctrlKey && e.key === '`') {
        if (pathname?.endsWith('/terminal')) return;
        // Don't hijack the shortcut while the user is typing in a form field
        const t = e.target;
        if (
          t instanceof HTMLInputElement ||
          t instanceof HTMLTextAreaElement ||
          (t instanceof HTMLElement && t.isContentEditable)
        ) {
          return;
        }
        e.preventDefault();
        router.push(`/${locale}/terminal`);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [router, locale, pathname]);

  return null;
}
