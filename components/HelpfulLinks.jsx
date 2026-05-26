import Link from 'next/link';

// Pure presentational — no hooks, so it works in both server and client
// components (404 is a server component, 500 is 'use client').
const ICONS = {
  projects: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
    />
  ),
  'case-study': (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  ),
  contact: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
    />
  ),
  terminal: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
    />
  ),
};

/**
 * A small grid of "where to next" link cards for the error pages.
 * @param {{ heading: string, links: Array<{ href: string, icon: keyof typeof ICONS, title: string, desc: string }> }} props
 */
export default function HelpfulLinks({ heading, links }) {
  return (
    <nav aria-label={heading} className="mt-14 w-full max-w-2xl mx-auto text-left">
      <p className="text-[0.7rem] font-semibold tracking-[0.3em] uppercase text-[var(--muted)] mb-4 text-center">
        {heading}
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex items-start gap-3 p-4 rounded-2xl border border-[var(--text)]/10 bg-[var(--text)]/[0.02] hover:border-[#1A56DB]/40 hover:bg-[#1A56DB]/[0.05] active:scale-[0.98] transition-all duration-200"
            >
              <span className="shrink-0 mt-0.5 flex items-center justify-center w-9 h-9 rounded-xl bg-[#1A56DB]/10 text-[#1A56DB] group-hover:bg-[#1A56DB] group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  {ICONS[link.icon]}
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-sm text-[var(--text)] group-hover:text-[#1A56DB] transition-colors">
                  {link.title}
                </span>
                <span className="block text-xs text-[var(--muted)] leading-relaxed mt-0.5">
                  {link.desc}
                </span>
              </span>
              <svg
                className="shrink-0 w-4 h-4 mt-1 text-[#1A56DB] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
