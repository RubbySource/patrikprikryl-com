import fs from 'fs';
import path from 'path';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const LOCALES = ['en', 'cs', 'de'];
const DEFAULT_LOCALE = 'en';

function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content: raw };

  const fm = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    } else if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    }
    fm[key] = value;
  }

  return { frontmatter: fm, content: match[2] };
}

function readingTime(text, locale = 'en') {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  const suffix = locale === 'cs' ? 'min čtení' : locale === 'de' ? 'Min. Lesezeit' : 'min read';
  return `${minutes} ${suffix}`;
}

function readPostsFromDir(dir, locale) {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.(mdx|md)$/, '');
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      const { frontmatter, content } = parseFrontmatter(raw);

      return {
        slug,
        locale,
        title: frontmatter.title || slug,
        date: frontmatter.date || '',
        excerpt: frontmatter.excerpt || '',
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        thumbnail: frontmatter.thumbnail || '',
        readingTime: readingTime(content, locale),
        content,
      };
    });
}

/**
 * Returns posts for a specific locale.
 * Lookup order:
 *  1. content/blog/<locale>/<slug>.mdx
 *  2. content/blog/<DEFAULT_LOCALE>/<slug>.mdx (fallback for missing translations)
 *  3. content/blog/<slug>.mdx (legacy flat-root fallback)
 */
export function getAllPosts(locale = DEFAULT_LOCALE) {
  const localized = readPostsFromDir(path.join(BLOG_DIR, locale), locale);

  const fallbackDefault =
    locale === DEFAULT_LOCALE
      ? []
      : readPostsFromDir(path.join(BLOG_DIR, DEFAULT_LOCALE), DEFAULT_LOCALE);
  const flat = readPostsFromDir(BLOG_DIR, DEFAULT_LOCALE);

  const seen = new Set(localized.map((p) => p.slug));
  const merged = [...localized];

  for (const post of fallbackDefault) {
    if (!seen.has(post.slug)) {
      merged.push(post);
      seen.add(post.slug);
    }
  }
  for (const post of flat) {
    if (!seen.has(post.slug)) {
      merged.push(post);
      seen.add(post.slug);
    }
  }

  return merged.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug, locale = DEFAULT_LOCALE) {
  return getAllPosts(locale).find((p) => p.slug === slug) || null;
}

/**
 * Every (locale, slug) pair that should be statically generated.
 */
export function getAllStaticParams() {
  const slugs = new Set();
  for (const locale of LOCALES) {
    for (const post of getAllPosts(locale)) slugs.add(post.slug);
  }
  return LOCALES.flatMap((locale) =>
    [...slugs].map((slug) => ({ locale, slug }))
  );
}
