import Link from 'next/link';
import NotFoundScene from '@/components/NotFoundScene';

export const metadata = {
  title: '404 — Lost in the garden | Patrik Přikryl',
  description: "This page wandered off into the garden. Let's get you back.",
};

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      {/* Soft garden gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(13, 74, 42, 0.18) 0%, transparent 55%), radial-gradient(ellipse at 75% 80%, rgba(26, 86, 219, 0.10) 0%, transparent 55%)',
        }}
      />

      <div className="relative max-w-3xl mx-auto text-center">
        <NotFoundScene />

        <p className="text-xs font-semibold tracking-[0.4em] uppercase text-[#1A56DB] mt-10 mb-4">
          Error · 404
        </p>

        <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl text-[var(--text)] leading-[1.05] mb-6">
          This page got lost in the garden 🌿
        </h1>

        <p className="text-base sm:text-lg text-[var(--muted)] max-w-xl mx-auto mb-10 leading-relaxed">
          Maybe it&apos;s under a tomato leaf, maybe a butterfly carried it off.
          Either way — let&apos;s get you somewhere useful.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A56DB] text-white font-semibold text-sm hover:bg-[#1340B0] active:scale-95 transition-all duration-200 shadow-lg shadow-blue-500/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to homepage
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[var(--text)]/20 text-[var(--text)] font-semibold text-sm hover:border-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--bg)] active:scale-95 transition-all duration-200"
          >
            Read the blog
          </Link>
        </div>
      </div>
    </main>
  );
}
