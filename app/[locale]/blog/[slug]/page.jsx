import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import NetworkCanvas from '@/components/NetworkCanvas';
import { getAllPosts, getPostBySlug } from '@/lib/blog';

const SITE_URL = 'https://patrikprikryl.com';

export function generateStaticParams() {
  const locales = ['en', 'cs', 'de'];
  const posts = getAllPosts();
  return locales.flatMap((locale) =>
    posts.map((post) => ({ locale, slug: post.slug }))
  );
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const path = locale === 'en' ? `/blog/${slug}` : `/${locale}/blog/${slug}`;
  const title = `${post.title} — Patrik Přikryl`;
  const description = post.excerpt;

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        en: `/blog/${slug}`,
        cs: `/cs/blog/${slug}`,
        de: `/de/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description,
      url: `${SITE_URL}${path}`,
      siteName: 'Patrik Přikryl',
      type: 'article',
      publishedTime: post.date,
      locale: locale === 'cs' ? 'cs_CZ' : locale === 'de' ? 'de_DE' : 'en_US',
      authors: ['Patrik Přikryl'],
      tags: post.tags,
      images: [
        {
          url: post.thumbnail || '/og-default.svg',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

function formatDate(iso, locale) {
  if (!iso) return '';
  const tag = locale === 'cs' ? 'cs-CZ' : locale === 'de' ? 'de-DE' : 'en-GB';
  try {
    return new Date(iso).toLocaleDateString(tag, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

const mdxComponents = {
  h1: (props) => (
    <h1 className="font-display font-bold text-3xl sm:text-4xl mt-12 mb-6 text-[var(--text)]" {...props} />
  ),
  h2: (props) => (
    <h2 className="font-display font-bold text-2xl sm:text-3xl mt-12 mb-5 text-[var(--text)]" {...props} />
  ),
  h3: (props) => (
    <h3 className="font-display font-semibold text-xl sm:text-2xl mt-8 mb-4 text-[var(--text)]" {...props} />
  ),
  p: (props) => (
    <p className="text-base sm:text-lg text-[var(--text)]/85 leading-[1.75] mb-5" {...props} />
  ),
  ul: (props) => (
    <ul className="list-disc pl-6 mb-5 space-y-2 text-base sm:text-lg text-[var(--text)]/85 leading-[1.75]" {...props} />
  ),
  ol: (props) => (
    <ol className="list-decimal pl-6 mb-5 space-y-2 text-base sm:text-lg text-[var(--text)]/85 leading-[1.75]" {...props} />
  ),
  li: (props) => <li className="pl-1" {...props} />,
  a: (props) => (
    <a
      className="text-[#1A56DB] underline decoration-[#1A56DB]/30 underline-offset-4 hover:decoration-[#1A56DB] transition-colors"
      target={props.href?.startsWith('http') ? '_blank' : undefined}
      rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    />
  ),
  strong: (props) => <strong className="font-semibold text-[var(--text)]" {...props} />,
  em: (props) => <em className="italic" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="border-l-4 border-[#1A56DB] pl-5 my-6 italic text-[var(--muted)]"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="px-1.5 py-0.5 rounded bg-[var(--muted)]/15 text-[#1A56DB] text-[0.92em] font-mono"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="my-6 p-5 rounded-xl bg-[#0A0A0A] dark:bg-[#000] text-[#E5E7EB] text-sm font-mono overflow-x-auto border border-[var(--border)]"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-[var(--border)]" />,
};

export default async function BlogPost({ params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'blog' });
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <NetworkCanvas />
      <main className="relative z-[1] min-h-screen text-[var(--text)]">
        <Navigation />

        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--muted)] hover:text-[#1A56DB] transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('all_posts')}
          </Link>

          <header className="mb-10">
            <div className="flex items-center gap-3 text-xs font-medium text-[var(--muted)] mb-4">
              <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
              <span aria-hidden>·</span>
              <span>{post.readingTime}</span>
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[var(--text)] leading-[1.15] mb-5">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg text-[var(--muted)] leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full bg-[#1A56DB]/10 text-[#1A56DB] text-[11px] font-semibold tracking-wide uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="prose-content">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
        </article>

        <Footer />
      </main>
    </>
  );
}
