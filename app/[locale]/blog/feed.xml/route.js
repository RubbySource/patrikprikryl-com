import { getAllPostsForLocale } from '@/lib/blog';

const SITE_URL = 'https://patrikprikryl.com';

const FEED_META = {
  en: {
    title: 'Patrik Přikryl — Blog',
    description: 'Notes on AI in procurement, side projects, and what I am building.',
    language: 'en',
    path: '/blog',
  },
  cs: {
    title: 'Patrik Přikryl — Blog',
    description: 'Poznámky o AI v procurement, vedlejších projektech a co stavím.',
    language: 'cs',
    path: '/cs/blog',
  },
  de: {
    title: 'Patrik Přikryl — Blog',
    description: 'Notizen zu KI im Einkauf, Nebenprojekten und was ich baue.',
    language: 'de',
    path: '/de/blog',
  },
};

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function renderItem(post, locale, blogPath) {
  const link = `${SITE_URL}${blogPath}/${post.slug}`;
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

function buildFeed(locale) {
  const meta = FEED_META[locale] ?? FEED_META.en;
  const posts = getAllPostsForLocale(locale);
  const items = posts.map((p) => renderItem(p, locale, meta.path)).join('\n');

  const lastBuildDate = (
    posts.length > 0 && posts[0].date
      ? new Date(posts[0].date)
      : new Date()
  ).toUTCString();

  const feedUrl = `${SITE_URL}${meta.path}/feed.xml`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(meta.title)}</title>
    <link>${SITE_URL}${meta.path}</link>
    <description>${escapeXml(meta.description)}</description>
    <language>${meta.language}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}

export const dynamic = 'force-static';

export async function GET(request, { params }) {
  const { locale } = await params;
  return new Response(buildFeed(locale), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
