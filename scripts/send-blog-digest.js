/**
 * send-blog-digest.js — send a "new post" digest to the newsletter audience when a
 * blog article is published.
 *
 * Runs in CI (see .github/workflows/blog-digest.yml) on push to main that adds files
 * under content/blog/. Self-contained CommonJS (only depends on `resend`) so it stays
 * decoupled from the Next runtime — it does NOT import lib/ (those are ESM + use the
 * `@/` bundler alias).
 *
 * Safety: nothing is sent unless BLOG_DIGEST_ENABLED=on (mirrors the welcome-series
 * gate — keeps the list quiet until the From domain is verified). Use
 * BLOG_DIGEST_DRY_RUN=1 to build + log without calling Resend.
 *
 * Per-locale delivery: if per-locale audiences exist (RESEND_AUDIENCE_ID_CS / _EN / _DE)
 * each localized post goes to its own audience. Otherwise it falls back to the single
 * RESEND_AUDIENCE_ID and sends one broadcast per article (deduped by slug) in
 * BLOG_DIGEST_PRIMARY_LOCALE (default "en").
 *
 * Input files: passed as CLI args or via BLOG_DIGEST_FILES (newline/space separated).
 *
 * See docs/NEWSLETTER_STRATEGY.md §6.
 */

const fs = require('fs');
const path = require('path');

const SUPPORTED = ['en', 'cs', 'de'];
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://patrikprikryl.com').replace(/\/$/, '');
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Patrik Přikryl <newsletter@patrikprikryl.com>';
const REPLY_TO = process.env.RESEND_REPLY_TO || undefined;
const PRIMARY_LOCALE = SUPPORTED.includes(process.env.BLOG_DIGEST_PRIMARY_LOCALE)
  ? process.env.BLOG_DIGEST_PRIMARY_LOCALE
  : 'en';
const DRY_RUN = /^(1|true|yes)$/i.test(process.env.BLOG_DIGEST_DRY_RUN || '');
const ENABLED = process.env.BLOG_DIGEST_ENABLED === 'on';

// --- localized copy -------------------------------------------------------------------

const COPY = {
  en: {
    badge: 'New post',
    subject: (title) => `🌱 New post: ${title}`,
    lead: "I just published a new article. If the topic is up your alley, give it a read:",
    cta: 'Read the article →',
    reply: 'Got a question or your own take? Just hit reply — I read everything.',
    unsubscribe: 'Unsubscribe',
    signedUp: 'You receive this because you subscribed at',
  },
  cs: {
    badge: 'Nový článek',
    subject: (title) => `🌱 Nový článek: ${title}`,
    lead: 'Právě jsem publikoval nový článek. Pokud tě téma zajímá, mrkni na něj:',
    cta: 'Číst článek →',
    reply: 'Máš k tomu otázku nebo vlastní zkušenost? Stačí odpovědět na tenhle email — čtu všechno.',
    unsubscribe: 'Odhlásit odběr',
    signedUp: 'Tenhle email dostáváš, protože ses přihlásil/a na',
  },
  de: {
    badge: 'Neuer Beitrag',
    subject: (title) => `🌱 Neuer Beitrag: ${title}`,
    lead: 'Ich habe gerade einen neuen Artikel veröffentlicht. Wenn dich das Thema interessiert, schau rein:',
    cta: 'Artikel lesen →',
    reply: 'Hast du eine Frage oder eigene Erfahrungen? Antworte einfach auf diese E-Mail — ich lese alles.',
    unsubscribe: 'Abmelden',
    signedUp: 'Du erhältst diese E-Mail, weil du dich angemeldet hast auf',
  },
};

// --- helpers --------------------------------------------------------------------------

function normalizeLocale(locale) {
  return SUPPORTED.includes(locale) ? locale : 'en';
}

function blogUrl(locale, slug) {
  // next-intl localePrefix 'as-needed': EN at root, others prefixed.
  return locale === 'en' ? `${SITE_URL}/blog/${slug}` : `${SITE_URL}/${locale}/blog/${slug}`;
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Minimal frontmatter parser — mirrors lib/blog.js so titles/excerpts match the site.
function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return {};
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
    }
    fm[key] = value;
  }
  return fm;
}

// content/blog/<locale>/<slug>.mdx → { locale, slug }. Root-level posts (the English
// fallback layer) are intentionally ignored: the en/ copy is canonical for the digest.
function parseBlogPath(file) {
  const norm = file.replace(/\\/g, '/');
  const m = norm.match(/(?:^|\/)content\/blog\/(cs|en|de)\/([^/]+)\.(?:mdx|md)$/);
  if (!m) return null;
  return { locale: m[1], slug: m[2] };
}

function readPost(file) {
  const meta = parseBlogPath(file);
  if (!meta) return null;
  const abs = path.isAbsolute(file) ? file : path.join(process.cwd(), file);
  if (!fs.existsSync(abs)) {
    console.warn(`[blog-digest] file not found, skipping: ${file}`);
    return null;
  }
  const fm = parseFrontmatter(fs.readFileSync(abs, 'utf8'));
  return {
    locale: meta.locale,
    slug: meta.slug,
    title: fm.title || meta.slug,
    excerpt: fm.excerpt || fm.description || '',
    url: blogUrl(meta.locale, meta.slug),
  };
}

function buildEmail({ locale, title, excerpt, url }) {
  const t = COPY[normalizeLocale(locale)];
  const excerptHtml = excerpt
    ? `<p style="margin:0 0 24px 0;font-size:16px;line-height:1.65;color:#4B5563;">${escapeHtml(excerpt)}</p>`
    : '';
  const html = `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f7f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,0.04);">
            <tr>
              <td style="padding:40px 40px 8px 40px;">
                <div style="display:inline-block;padding:6px 12px;border-radius:999px;background:#ECFDF5;color:#047857;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">${escapeHtml(t.badge)}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 40px 8px 40px;">
                <p style="margin:0 0 16px 0;font-size:16px;line-height:1.65;color:#4B5563;">${escapeHtml(t.lead)}</p>
                <h1 style="margin:0;font-size:26px;line-height:1.25;color:#111827;font-weight:700;letter-spacing:-0.02em;">
                  <a href="${url}" style="color:#111827;text-decoration:none;">${escapeHtml(title)}</a>
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 40px 8px 40px;">
                ${excerptHtml}
                <a href="${url}" style="display:inline-block;padding:12px 22px;border-radius:10px;background:#047857;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;">${escapeHtml(t.cta)}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 40px 8px 40px;">
                <p style="margin:0;font-size:16px;line-height:1.65;color:#4B5563;">${escapeHtml(t.reply)}</p>
                <p style="margin:24px 0 0 0;font-size:16px;line-height:1.65;color:#4B5563;">— Patrik</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 40px 40px 40px;border-top:1px solid #F3F4F6;">
                <p style="margin:16px 0 0 0;font-size:13px;line-height:1.5;color:#9CA3AF;">
                  ${escapeHtml(t.signedUp)} <a href="${SITE_URL}" style="color:#1A56DB;text-decoration:none;">patrikprikryl.com</a>.
                  <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#9CA3AF;text-decoration:underline;">${escapeHtml(t.unsubscribe)}</a>.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
  return {
    subject: t.subject(title),
    html,
    previewText: excerpt ? excerpt.slice(0, 140) : '',
  };
}

function audienceForLocale(locale) {
  const perLocale = process.env[`RESEND_AUDIENCE_ID_${locale.toUpperCase()}`];
  return perLocale || process.env.RESEND_AUDIENCE_ID || null;
}

function hasPerLocaleAudiences() {
  return SUPPORTED.some((l) => process.env[`RESEND_AUDIENCE_ID_${l.toUpperCase()}`]);
}

// Resolve which (locale, audience) broadcasts to send from the set of new posts.
function planSends(posts) {
  const perLocale = hasPerLocaleAudiences();
  const jobs = [];
  const seen = new Set();

  if (perLocale) {
    // One broadcast per localized post, each to its own audience.
    for (const post of posts) {
      const audienceId = audienceForLocale(post.locale);
      if (!audienceId) {
        console.warn(`[blog-digest] no audience for locale "${post.locale}" (post ${post.slug}), skipping.`);
        continue;
      }
      const key = `${audienceId}:${post.locale}:${post.slug}`;
      if (seen.has(key)) continue;
      seen.add(key);
      jobs.push({ post, locale: post.locale, audienceId });
    }
  } else {
    // Single mixed-locale audience (no segmentation): send in ONE representative locale
    // so subscribers don't get the same article in every language. cs/en versions of an
    // article carry different slugs here (e.g. autonomni-po-agent / autonomous-po-agent),
    // so we pick a locale rather than dedup by slug. Distinct articles in that locale each
    // still go out.
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (!audienceId) return jobs;
    const repLocale = posts.some((p) => p.locale === PRIMARY_LOCALE) ? PRIMARY_LOCALE : posts[0].locale;
    for (const post of posts) {
      if (post.locale !== repLocale) continue;
      const key = `${audienceId}:${post.locale}:${post.slug}`;
      if (seen.has(key)) continue;
      seen.add(key);
      jobs.push({ post, locale: post.locale, audienceId });
    }
  }
  return jobs;
}

function collectFiles() {
  const fromArgs = process.argv.slice(2);
  const fromEnv = (process.env.BLOG_DIGEST_FILES || '').split(/[\s,]+/);
  return [...fromArgs, ...fromEnv].map((f) => f.trim()).filter(Boolean);
}

async function main() {
  const files = collectFiles();
  const posts = files.map(readPost).filter(Boolean);

  if (posts.length === 0) {
    console.log('[blog-digest] no newly added blog posts detected — nothing to send.');
    return;
  }

  console.log(`[blog-digest] detected ${posts.length} new post file(s):`);
  for (const p of posts) console.log(`  - [${p.locale}] ${p.slug} — "${p.title}"`);

  const jobs = planSends(posts);
  if (jobs.length === 0) {
    console.warn('[blog-digest] no audience configured (RESEND_AUDIENCE_ID[_CS|_EN|_DE]) — nothing sent.');
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!ENABLED && !DRY_RUN) {
    console.warn('[blog-digest] BLOG_DIGEST_ENABLED is not "on" — skipping send (set it to enable). Planned:');
    for (const j of jobs) console.warn(`  - broadcast [${j.locale}] "${j.post.title}" → audience ${j.audienceId}`);
    return;
  }

  if (DRY_RUN) {
    console.log('[blog-digest] DRY RUN — building emails, not sending:');
    for (const j of jobs) {
      const email = buildEmail(j.post);
      console.log(`  - [${j.locale}] audience ${j.audienceId}`);
      console.log(`      subject: ${email.subject}`);
      console.log(`      html bytes: ${email.html.length}`);
    }
    return;
  }

  if (!apiKey) {
    console.error('[blog-digest] RESEND_API_KEY is missing — cannot send.');
    process.exitCode = 1;
    return;
  }

  const { Resend } = require('resend');
  const resend = new Resend(apiKey);

  let sent = 0;
  for (const job of jobs) {
    const email = buildEmail(job.post);
    try {
      const created = await resend.broadcasts.create({
        audienceId: job.audienceId,
        from: FROM_EMAIL,
        subject: email.subject,
        html: email.html,
        name: `Blog digest — ${job.post.slug} (${job.locale})`,
        previewText: email.previewText || undefined,
        replyTo: REPLY_TO,
      });
      if (created.error || !created.data?.id) {
        console.error(`[blog-digest] create failed [${job.locale}] ${job.post.slug}:`, created.error);
        process.exitCode = 1;
        continue;
      }
      const result = await resend.broadcasts.send(created.data.id);
      if (result.error) {
        console.error(`[blog-digest] send failed [${job.locale}] ${job.post.slug}:`, result.error);
        process.exitCode = 1;
        continue;
      }
      sent += 1;
      console.log(`[blog-digest] sent broadcast [${job.locale}] "${job.post.title}" → audience ${job.audienceId} (id ${created.data.id}).`);
    } catch (err) {
      console.error(`[blog-digest] threw for [${job.locale}] ${job.post.slug}:`, err?.message || err);
      process.exitCode = 1;
    }
  }

  console.log(`[blog-digest] done — ${sent}/${jobs.length} broadcast(s) sent.`);
}

main().catch((err) => {
  console.error('[blog-digest] fatal:', err);
  process.exitCode = 1;
});
