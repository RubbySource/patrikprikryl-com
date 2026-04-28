import { getAllPosts } from '@/lib/blog';

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

function renderItem(post) {
  const link = `${SITE_URL}/${DEFAULT_LOCALE}/blog/${post.slug}`;
  const title = escapeXml(post.title);
  const description = escapeXml(post.excerpt || '');
  const pubDate = post.date
    ? new Date(post.date).toUTCString()
    : new Date().toUTCString();
  return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
    </item>`;
}

function buildFeed() {
  const posts = getAllPosts();
  const items = posts.map(renderItem).join('\n');

  const lastBuildDate = (
    posts.length > 0 && posts[0].date
      ? new Date(posts[0].date)
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
