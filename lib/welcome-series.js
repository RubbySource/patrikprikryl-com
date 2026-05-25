// Welcome series — the 2 follow-up emails sent after the immediate welcome email.
//
// Scheduled via Resend `scheduledAt` at the moment of signup, so there is no cron job
// and no queue to maintain (robust on Vercel's read-only filesystem). All copy is
// localized cs / en / de; must-read links follow the subscriber's locale.
//
// Activation: only runs when NEWSLETTER_WELCOME_SERIES=on (default off — nothing
// auto-sends until the From domain is verified). See docs/NEWSLETTER_STRATEGY.md.

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://patrikprikryl.com').replace(/\/$/, '');
const SUPPORTED = ['en', 'cs', 'de'];

export function isWelcomeSeriesEnabled() {
  return process.env.NEWSLETTER_WELCOME_SERIES === 'on';
}

function normalizeLocale(locale) {
  return SUPPORTED.includes(locale) ? locale : 'en';
}

function blogUrl(locale, slug) {
  // next-intl localePrefix 'as-needed': EN at root, others prefixed.
  return locale === 'en' ? `${SITE_URL}/blog/${slug}` : `${SITE_URL}/${locale}/blog/${slug}`;
}

// Curated must-read posts per locale. Slugs must exist in content/blog/{cs,en}/;
// DE has no dedicated posts yet, so it points at root-level (English) posts via the
// blog fallback (see lib/blog.js getAllPostsForLocale).
const MUST_READ = {
  en: [
    { slug: 'autonomous-po-agent', title: 'How I built an autonomous PO agent' },
    { slug: 'how-i-built-gardenpin', title: 'How I built GardenPin — a garden tracker just for me' },
    { slug: 'local-ai-health', title: 'Why I built a local health analyzer instead of paying for an API' },
  ],
  cs: [
    { slug: 'autonomni-po-agent', title: 'Jak jsem postavil autonomního PO agenta' },
    { slug: 'jak-jsem-postavil-gardenpin', title: 'Jak jsem postavil GardenPin — zahradní tracker na míru' },
    { slug: 'local-ai-health', title: 'Proč jsem postavil lokální analyzátor zdraví místo placení za API' },
  ],
  de: [
    { slug: 'claude-dispatch-autonomous-phone', title: 'How I Set Up Claude Dispatch to Work Autonomously From My Phone' },
    { slug: 'building-gardenpin', title: 'Building GardenPin: a weekend garden-planning app' },
    { slug: 'local-ai-health', title: 'Why I built a local health analyzer instead of paying for an API' },
  ],
};

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Shared email shell — matches the immediate welcome email aesthetic (forest green,
// rounded white card). `bodyHtml` is trusted, pre-built HTML.
function layout({ badge, heading, bodyHtml }) {
  return `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f7f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,0.04);">
            <tr>
              <td style="padding:40px 40px 8px 40px;">
                <div style="display:inline-block;padding:6px 12px;border-radius:999px;background:#ECFDF5;color:#047857;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">${escapeHtml(badge)}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 40px 8px 40px;">
                <h1 style="margin:0;font-size:26px;line-height:1.25;color:#111827;font-weight:700;letter-spacing:-0.02em;">${escapeHtml(heading)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 40px 40px 40px;">${bodyHtml}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function paragraph(text) {
  return `<p style="margin:0 0 16px 0;font-size:16px;line-height:1.65;color:#4B5563;">${text}</p>`;
}

function signoff() {
  return `<p style="margin:24px 0 0 0;font-size:16px;line-height:1.65;color:#4B5563;">— Patrik</p>`;
}

function postLinks(locale) {
  const items = (MUST_READ[locale] || MUST_READ.en)
    .map(
      (p) =>
        `<li style="margin:0 0 12px 0;">
          <a href="${blogUrl(locale, p.slug)}" style="color:#047857;text-decoration:none;font-weight:600;font-size:16px;line-height:1.5;">${escapeHtml(p.title)} →</a>
        </li>`,
    )
    .join('');
  return `<ul style="margin:0 0 8px 0;padding:0 0 0 18px;color:#4B5563;">${items}</ul>`;
}

// Per-locale series definition. Email #1 (immediate welcome) lives in the main signup
// route; this file owns the two follow-ups.
const SERIES = {
  en: [
    {
      delayDays: 2,
      subject: '3 things worth reading first',
      build: (locale) =>
        layout({
          badge: 'Worth your time',
          heading: 'Where to start',
          bodyHtml:
            paragraph("Now that you're on the list, here are the three pieces I'd hand a new reader first — honest write-ups of things I actually shipped:") +
            postLinks(locale) +
            paragraph("If one of them sparks a question, just hit reply. I read everything.") +
            signoff(),
        }),
    },
    {
      delayDays: 5,
      subject: 'What are you working on?',
      build: () =>
        layout({
          badge: 'One question',
          heading: 'Quick question for you',
          bodyHtml:
            paragraph("I write this newsletter to think out loud about AI, procurement, and building things — but I learn the most from the people reading it.") +
            paragraph("So: <strong>what are you working on right now?</strong> A project, a problem, a thing you're stuck on. Reply to this email — it comes straight to me, and I answer.") +
            signoff(),
        }),
    },
  ],
  cs: [
    {
      delayDays: 2,
      subject: '3 věci, které stojí za přečtení jako první',
      build: (locale) =>
        layout({
          badge: 'Stojí to za čas',
          heading: 'Kde začít',
          bodyHtml:
            paragraph('Teď když jsi na seznamu, tady jsou tři věci, které bych dal novému čtenáři jako první — upřímné zápisky o věcech, které jsem opravdu postavil:') +
            postLinks(locale) +
            paragraph('Pokud tě něco napadne, prostě odpověz na tenhle email. Čtu všechno.') +
            signoff(),
        }),
    },
    {
      delayDays: 5,
      subject: 'Na čem zrovna pracuješ?',
      build: () =>
        layout({
          badge: 'Jedna otázka',
          heading: 'Krátká otázka pro tebe',
          bodyHtml:
            paragraph('Tenhle newsletter píšu, abych nahlas přemýšlel o AI, nákupu a stavění věcí — ale nejvíc se naučím od lidí, co ho čtou.') +
            paragraph('Tak tedy: <strong>na čem zrovna pracuješ?</strong> Projekt, problém, něco, na čem jsi zaseknutý. Odpověz na tenhle email — chodí přímo ke mně a odpovídám.') +
            signoff(),
        }),
    },
  ],
  de: [
    {
      delayDays: 2,
      subject: '3 Dinge, die du zuerst lesen solltest',
      build: (locale) =>
        layout({
          badge: 'Lohnt sich',
          heading: 'Wo du anfangen kannst',
          bodyHtml:
            paragraph('Jetzt, wo du auf der Liste bist, hier die drei Texte, die ich einem neuen Leser zuerst geben würde — ehrliche Berichte über Dinge, die ich wirklich gebaut habe (aktuell auf Englisch):') +
            postLinks(locale) +
            paragraph('Wenn dir dabei eine Frage kommt, antworte einfach auf diese E-Mail. Ich lese alles.') +
            signoff(),
        }),
    },
    {
      delayDays: 5,
      subject: 'Woran arbeitest du gerade?',
      build: () =>
        layout({
          badge: 'Eine Frage',
          heading: 'Kurze Frage an dich',
          bodyHtml:
            paragraph('Diesen Newsletter schreibe ich, um laut über KI, Einkauf und das Bauen von Dingen nachzudenken — aber am meisten lerne ich von den Menschen, die ihn lesen.') +
            paragraph('Also: <strong>woran arbeitest du gerade?</strong> Ein Projekt, ein Problem, etwas, bei dem du feststeckst. Antworte auf diese E-Mail — sie kommt direkt zu mir, und ich antworte.') +
            signoff(),
        }),
    },
  ],
};

/**
 * Schedule the welcome-series follow-up emails for one subscriber.
 * Returns { scheduled, errors }. Never throws — each email is sent independently.
 *
 * @param {import('resend').Resend} resend  initialized Resend client
 * @param {{ email: string, locale?: string, from: string }} opts
 */
export async function scheduleWelcomeSeries(resend, { email, locale, from }) {
  const loc = normalizeLocale(locale);
  const series = SERIES[loc] || SERIES.en;
  let scheduled = 0;
  const errors = [];

  for (const step of series) {
    const scheduledAt = new Date(Date.now() + step.delayDays * 24 * 60 * 60 * 1000).toISOString();
    try {
      const { error } = await resend.emails.send({
        from,
        to: email,
        subject: step.subject,
        html: step.build(loc),
        scheduledAt,
      });
      if (error) {
        errors.push(error.message || String(error));
      } else {
        scheduled += 1;
      }
    } catch (err) {
      errors.push(err?.message || String(err));
    }
  }

  return { scheduled, errors };
}
