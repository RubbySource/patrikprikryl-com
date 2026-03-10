'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useTheme } from 'next-themes';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const PPLogo = ({ className }) => (
  <svg
    viewBox="0 0 60 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="PP Logo"
  >
    <text
      x="0"
      y="34"
      fontFamily="Sora, sans-serif"
      fontWeight="700"
      fontSize="38"
      fill="currentColor"
      letterSpacing="-4"
    >
      PP
    </text>
  </svg>
);

export default function Navigation() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t('about'), href: '#about' },
    { label: t('projects'), href: '#projects' },
    { label: t('awards'), href: '#awards' },
    { label: t('contact'), href: '#contact' },
  ];

  const locales = ['en', 'cs', 'de'];

  const switchLocale = (newLocale) => {
    const segments = pathname.split('/');
    if (['en', 'cs', 'de'].includes(segments[1])) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join('/') || '/';
    router.push(newPath === '/en' ? '/' : newPath);
    setMenuOpen(false);
  };

  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 text-[#111111] dark:text-[#F0F0F0] hover:opacity-70 transition-opacity"
          aria-label="Go to top"
        >
          <PPLogo className="h-8 w-auto" />
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollTo(item.href)}
              className="text-sm font-medium text-[#6B7280] dark:text-gray-400 hover:text-[#111111] dark:hover:text-[#F0F0F0] transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <div className="hidden md:flex items-center gap-1 text-xs font-medium text-[#6B7280] dark:text-gray-400">
            {locales.map((l, i) => (
              <span key={l} className="flex items-center">
                <button
                  onClick={() => switchLocale(l)}
                  className={`px-1 py-0.5 rounded transition-colors hover:text-[#111111] dark:hover:text-[#F0F0F0] ${
                    locale === l
                      ? 'text-[#1A56DB] font-semibold'
                      : ''
                  }`}
                >
                  {l.toUpperCase()}
                </button>
                {i < locales.length - 1 && <span className="opacity-30">|</span>}
              </span>
            ))}
          </div>

          {/* Dark mode toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full text-[#6B7280] dark:text-gray-400 hover:text-[#111111] dark:hover:text-[#F0F0F0] hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          )}

          {/* Hamburger */}
          <button
            className="md:hidden p-2 rounded-full text-[#6B7280] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass-nav border-t border-gray-200/20 dark:border-gray-700/20"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className="text-left text-base font-medium text-[#111111] dark:text-[#F0F0F0] hover:text-[#1A56DB] transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-200/30 dark:border-gray-700/30">
                {locales.map((l) => (
                  <button
                    key={l}
                    onClick={() => switchLocale(l)}
                    className={`text-sm font-medium px-2 py-1 rounded transition-colors ${
                      locale === l
                        ? 'text-[#1A56DB] bg-blue-50 dark:bg-blue-900/20'
                        : 'text-[#6B7280] hover:text-[#111111] dark:hover:text-[#F0F0F0]'
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
