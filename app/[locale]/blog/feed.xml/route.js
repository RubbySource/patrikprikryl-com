import { getAllPostsForLocale } from '@/lib/blog';

const SITE_URL = 'https://patrikprikryl.com';
const LOCALES = ['en', 'cs', 'de'];

const LANG_TAG = { en: 'en-US', cs: 'cs-CZ', de: 'de-DE' };

const TITLES = {
  en: 'Patrik Přikryl — Blog',
  cs: 'Patrik Přikryl — Blog',
  de: 'Patrik Přikryl — Blog',
};

const DESCRIPTIONS = {
  en: 'Notes on AI in procurement, side projects, and what I am building.',
  cs: 'Poznámky o AI v nákupu, vedlejších projektech a tom, co stavím.',
  de: 'Notizen zu KI im Einkauf, Nebenprojekten und dem, was ich baue.',
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function renderItem(post, locale) {
  const link = `${SITE_URL}/${locale}/blog/${post.slug}`;
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
  const posts = getAllPostsForLocale(locale);
  const items = posts.map((p) => renderItem(p, locale)).join('\n');

  const lastBuildDate = (
    posts.length > 0 && posts[0].date
      ? new Date(posts[0].date)
      : new Date()
  ).toUTCString();

  const feedUrl = `${SITE_URL}/${locale}/blog/feed.xml`;
  const channelLink = `${SITE_URL}/${locale}/blog`;
  const title = TITLES[locale] || TITLES.en;
  const description = DESCRIPTIONS[locale] || DESCRIPTIONS.en;
  const language = LANG_TAG[locale] || 'en-US';

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${channelLink}</link>
    <description>${escapeXml(description)}</description>
    <language>${language}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}

export const dynamic = 'force-static';

export async function GET(_request, { params }) {
  const { locale } = await params;
  if (!LOCALES.includes(locale)) {
    return new Response('Not found', { status: 404 });
  }
  return new Response(buildFeed(locale), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
