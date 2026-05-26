// Speaking — keynotes, conference talks, podcast appearances, interviews.
// Rendered by components/Speaking.jsx as a card grid. The section auto-hides
// while this array is empty, so it's safe to ship as-is — nothing shows until
// there's a real talk to show (no invented stages on the live site).
//
// Newest-first ordering is automatic (the component sorts by `date`
// descending), so you can list entries in any order here.
//
// Schema for each entry:
// {
//   type: 'keynote' | 'conference' | 'podcast' | 'interview',  // drives chip color + icon
//   title:       { en: '', cs: '', de: '' },   // talk / episode title (required)
//   event:       'Procurement Summit',          // string (or { en, cs, de }) — host event / show
//   date:        '2025-03',                      // 'YYYY', 'YYYY-MM' or 'YYYY-MM-DD' — auto-formatted per locale
//   location:    'Prague, CZ',                   // optional — string or { en, cs, de }
//   description: { en: '', cs: '', de: '' },    // optional — 1–2 sentence summary
//   videoUrl:    'https://youtu.be/…',           // optional — YouTube or Spotify URL; rendered as an inline embed
//   link:        'https://…',                    // optional — external "watch/listen" link when there's no embed
//   image:       '/speaking/talk.jpg',           // optional — thumbnail (used when there's no videoUrl)
// }
//
// ⚠️ Patrik: add real speaking engagements here once you have them — keynotes,
// panels, podcast episodes, interviews. Paste a YouTube or Spotify link into
// `videoUrl` and it embeds inline; otherwise add a `link` (and optionally an
// `image` in public/speaking/) so visitors can click through.

export const speaking = [];
