// "As seen in" / media mentions strip.
// Rendered by components/MediaMentions.jsx as a horizontal logo strip under
// the hero. The section auto-hides while this array is empty, so it's safe to
// ship as-is — nothing shows until there's something real to show.
//
// Schema for each entry:
// {
//   name: 'Forbes',                       // publication / event / podcast name (required)
//   logoUrl: '/media/forbes.svg',         // optional — PNG or SVG in public/media/.
//                                          //   If omitted, the name renders as a text wordmark.
//   articleUrl: 'https://...',            // optional — makes the logo a link (opens in new tab)
//   date: '2025-03',                      // optional — 'YYYY' or 'YYYY-MM', shown as a tooltip
// }
//
// ⚠️ Patrik: drop real media mentions here once you have them — articles,
// podcast appearances, conference talks, interviews. For each, add a logo
// (PNG/SVG) to public/media/ and reference it via `logoUrl`; if you don't have
// a logo yet, just give the `name` and it renders as a clean text wordmark.
// Add the source link via `articleUrl` so visitors can click through.

export const mediaMentions = [];
