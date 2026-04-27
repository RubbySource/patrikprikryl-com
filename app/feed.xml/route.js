import { blogPosts } from '@/data/blog';

const SITE_URL = 'https://patrikprikryl.com';
const FEED_TITLE = 'Patrik Přikryl — Blog';
const FEED_DESCRIPTION =
  'Notes on AI in procurement, side projects, and what I am building.';
const DEFAULT_LOCALE = 'en';

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function pick(field, locale) {
  if (!field) return '';
  if (typeof field === 'string') return field;
  return field[locale] ?? field[DEFAULT_LOCALE] ?? '';
}

function renderItem(post) {
  const locale = DEFAULT_LOCALE;
  const link = `${SITE_URL}/${locale}/blog/${post.slug}`;
  const title = escapeXml(pick(post.title, locale));
  const description = escapeXml(pick(post.description, locale));
  const pubDate = new Date(post.date).toUTCString();
  return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
    </item>`;
}

function buildFeed() {
  const items = [...blogPosts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(renderItem)
    .join('\n');

  const lastBuildDate = (
    blogPosts.length > 0
      ? new Date(Math.max(...blogPosts.map((p) => new Date(p.date).getTime())))
      : new Date()
  ).toUTCString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}

export const dynamic = 'force-static';

export async function GET() {
  return new Response(buildFeed(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
