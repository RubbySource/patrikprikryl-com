'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const year = new Date().getFullYear();
  const th = useTranslations('hero');
  const tn = useTranslations('nav');

  const navLinks = [
    { key: 'projects', href: '#projects' },
    { key: 'awards',   href: '#awards' },
    { key: 'contact',  href: '#contact' },
  ];

  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <p className="text-sm text-[#6B7280]">
            © {year} Patrik {th('name_last')}. All rights reserved.
          </p>

          {/* Nav links */}
          <nav className="flex items-center gap-6">
            {navLinks.map(({ key, href }) => (
              <a
                key={key}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-sm text-[#6B7280] hover:text-[#1A56DB] transition-colors"
              >
                {tn(key)}
              </a>
            ))}
          </nav>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/patrikprikryl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#6B7280] hover:text-[#1A56DB] transition-colors"
            aria-label="LinkedIn"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
