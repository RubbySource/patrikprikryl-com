# Newsletter — content strategy & welcome series

> Companion to [`NEWSLETTER_SETUP.md`](./NEWSLETTER_SETUP.md) (the *how to wire it up*).
> This doc is the *what to send & why*.

---

## 1. Who it's for

Three overlapping circles, roughly in priority order:

1. **Procurement professionals** curious about AI — buyers, category managers, CPOs who
   keep hearing "AI will change procurement" and want concrete, honest takes from someone
   who actually ships.
2. **AI early adopters / builders** — people who like reading how a real product gets
   built (GardenPin, the autonomous PO agent, local AI health analyzer).
3. **Czech tech community** — peers who follow the personal-brand story, often via
   LinkedIn first.

The newsletter is the **owned channel** that LinkedIn can't take away. LinkedIn is the
top of the funnel; the list is where the relationship deepens.

## 2. Frequency

**Roughly monthly. Quality over cadence.** No fixed "every Tuesday" promise — that's a
treadmill that produces filler. Ship when there's something real: a new article, a
shipped feature, a lesson worth one page.

Target: **1 email / month**, occasionally 2 if there's genuine news. Never zero for more
than ~6 weeks (silence kills a list).

## 3. Format

A **digest + insight hybrid**, not a pure RSS dump:

- **Lead**: one short, personal insight (3–6 sentences) — what I learned / shipped /
  changed my mind about this month. This is the part nobody else can copy.
- **New article(s)**: title + one-line excerpt + link, per locale.
- **One small thing**: a tool, a snippet, a link worth their time.
- **Reply CTA**: always end by inviting a reply. Replies train the gut and build
  relationships; they also improve deliverability.

Plain, near-text HTML. No heavy templates, no stock images. It should feel like an email
from a person, because it is.

## 4. Tone

- Personal, first-person, short paragraphs.
- Honest about trade-offs and failures — the GardenPin / PO-agent posts set the bar.
- Concrete: numbers, code, real decisions over abstractions.
- Bilingual reality: CS subscribers get CS, EN/DE get EN-flavored content (DE links fall
  back to root posts until DE content exists — see §6).
- Sign off as "— Patrik". Never "The Team".

## 5. Welcome series (implemented)

Fires automatically on signup **when `NEWSLETTER_WELCOME_SERIES=on`** is set (default:
off, so nothing auto-sends until the From domain is verified and Patrik flips the switch
— see `NEWSLETTER_SETUP.md`). Implemented in [`lib/welcome-series.js`](../lib/welcome-series.js),
scheduled via Resend `scheduledAt` at the moment of signup (no cron / no queue — robust
on Vercel's read-only FS). A manual trigger lives at
`POST /api/newsletter/welcome-series` for testing.

| # | When | Subject (EN) | Goal |
|---|------|--------------|------|
| 1 | immediately | *Welcome — first article coming soon 🌱* | Confirm, set expectations. (Already sent by the main signup route.) |
| 2 | +2 days | *3 things worth reading first* | Deliver value fast — the must-read posts. |
| 3 | +5 days | *What are you working on?* | Open a 1:1 conversation, invite a reply. |

All three are localized **cs / en / de**. Locale is captured at signup (the form sends the
active `next-intl` locale) and stored with the subscriber; the series and must-read links
follow it.

### Editing the series

- Copy & subjects: `lib/welcome-series.js` → `SERIES` (per-locale content blocks).
- Must-read posts: same file → `MUST_READ` (per-locale `[ { slug, title } ]`). Keep slugs
  in sync with `content/blog/{cs,en}/`; DE uses root-level posts via the blog fallback.
- Timing: `SERIES[*].delayDays`.

## 6. Backlog / future

- **Auto-digest on new post** — ✅ implemented. GitHub Action (template:
  [`blog-digest.workflow.yml`](./blog-digest.workflow.yml), Patrik copies it into
  `.github/workflows/`) + [`scripts/send-blog-digest.js`](../scripts/send-blog-digest.js) send a digest via Resend
  Broadcasts when a post is added to `content/blog/` on main. Per-locale audiences when
  configured, single-audience fallback otherwise; gated by `BLOG_DIGEST_ENABLED`. Setup +
  test: `NEWSLETTER_SETUP.md` §7. The monthly insight (§3 lead) stays manual.
- **DE content** — until German posts exist, DE must-read links point at root-level
  (English) posts. Add `content/blog/de/` to close the gap.
- **Segmentation** — once the list grows, split procurement vs. builder interests via
  Resend audience tags.
