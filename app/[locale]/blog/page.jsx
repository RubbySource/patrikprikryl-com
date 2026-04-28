import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import NetworkCanvas from '@/components/NetworkCanvas';
import { getAllPosts } from '@/lib/blog';

export const metadata = {
  title: 'Blog — Patrik Přikryl',
  description:
    'Notes on AI, procurement, side projects, and what I learn while building.',
};

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function BlogIndex({ params: { locale } }) {
  setRequestLocale(locale);
  const posts = getAllPosts();

  return (
    <>
      <NetworkCanvas />
      <main className="relative z-[1] min-h-screen text-[var(--text)]">
        <Navigation />

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#1A56DB] mb-4 block">
            Blog
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-[var(--text)] mb-6 leading-tight">
            Notes on building, AI, and procurement.
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl mb-16">
            Long-form thoughts on what I&apos;m working on, what I learned the
            hard way, and what I&apos;d do differently next time.
          </p>

          <div className="space-y-6">
            {posts.length === 0 && (
              <p className="text-[var(--muted)]">No posts yet — check back soon.</p>
            )}

            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/${locale}/blog/${post.slug}`}
                className="block group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 hover:border-[#1A56DB]/40 hover:shadow-lg hover:shadow-[#1A56DB]/5 transition-all"
              >
                <div className="flex items-center gap-3 text-xs font-medium text-[var(--muted)] mb-3">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span aria-hidden>·</span>
                  <span>{post.readingTime}</span>
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-[#1A56DB]/10 text-[#1A56DB] text-[10px] font-semibold tracking-wide uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text)] mb-3 group-hover:text-[#1A56DB] transition-colors">
                  {post.title}
                </h2>

                <p className="text-base text-[var(--muted)] leading-relaxed mb-4">
                  {post.excerpt}
                </p>

                <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#1A56DB]">
                  Read post
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
