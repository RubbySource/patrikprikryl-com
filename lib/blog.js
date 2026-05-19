import fs from 'fs';
import path from 'path';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

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

function readingTime(text) {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
}

function readPostsFromDir(dir) {
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

  return files.map((file) => {
    const slug = file.replace(/\.(mdx|md)$/, '');
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const { frontmatter, content } = parseFrontmatter(raw);

    return {
      slug,
      title: frontmatter.title || slug,
      date: frontmatter.date || '',
      excerpt: frontmatter.excerpt || '',
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      thumbnail: frontmatter.thumbnail || '',
      readingTime: readingTime(content),
      content,
    };
  });
}

export function getAllPosts() {
  const posts = readPostsFromDir(BLOG_DIR);
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllPostsForLocale(locale) {
  const localeDir = path.join(BLOG_DIR, locale);
  const localePosts = readPostsFromDir(localeDir);

  if (localePosts.length > 0) {
    return localePosts.sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  // Fallback to root-level posts (English default)
  return getAllPosts();
}

export function getPostBySlug(slug, locale) {
  if (locale) {
    return getAllPostsForLocale(locale).find((p) => p.slug === slug) || null;
  }
  return getAllPosts().find((p) => p.slug === slug) || null;
}
