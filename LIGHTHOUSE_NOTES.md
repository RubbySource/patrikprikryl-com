# Lighthouse Optimizations — 2026-05-01

Pass over the codebase against Lighthouse Performance and Accessibility audits. All changes verified with `next build` (passes) and a smoke test against the dev server (page renders, viewport meta present, fonts resolved, no console errors).

## 1. Images — `<img>` / `next/image`

**Audit result:** clean. No raw `<img>` tags; all images use `next/image`.

| File | Image | `alt` | `priority` | Sizing |
|---|---|---|---|---|
| `components/Hero.jsx` | `/patrik.jpg` | "Patrik Přikryl" | ✓ (LCP candidate) | `fill` + `sizes="(max-width: 1024px) 100vw, 50vw"` |
| `components/CoCreators.jsx` | `person.image` | `person.name` | — | `width=48 height=48` |
| `components/Projects.jsx` | `project.image` | localized title | — (below the fold) | `fill` + `sizes="100vw"` |

No changes needed for images themselves. Added in `next.config.js`:

```js
images: { formats: ['image/avif', 'image/webp'] }
```

So Next now serves AVIF where supported (≈30–50 % smaller than WebP).

## 2. Fonts — `display: swap`

**Before:** fonts loaded via two redundant paths
- `<link>` in `app/layout.js` for Sora + Inter (with `&display=swap`)
- `@import` in `app/globals.css` for Sora + Inter + Plus Jakarta Sans (with `&display=swap`)

The `@import` in CSS is **render-blocking** and adds a serial roundtrip after CSS parses. Sora/Inter were also fetched twice.

**After:** migrated all three families to `next/font/google` (`app/layout.js`), which:

- Self-hosts the font files (zero requests to `fonts.gstatic.com` at runtime)
- Sets `display: swap` automatically
- Generates `<link rel="preload" as="font">` in production builds
- Eliminates the render-blocking `@import` in `globals.css`
- Wires CSS variables (`--font-inter`, `--font-sora`, `--font-plus-jakarta-sans`) on `<html>`, consumed by Tailwind config (`fontFamily.body` / `fontFamily.display`), `body` / heading rules in `globals.css`, and the inline `style` on the Hero `<h1>`.

## 3. Unused CSS / lazy-load

Tailwind already purges unused utilities. Custom CSS in `app/globals.css` is small (~250 lines) and all used. The `@import` removed above was the only render-blocking CSS request.

The universal `*, *::before, *::after { transition: ... }` for theme transitions is heavy across many elements but is gated by user theme switches and scoped by the `.no-theme-transition` escape hatch — left in place; it's a stylistic choice, not unused CSS.

## 4. JS bundle — `next build` output & dynamic imports

### Final bundle (production)

```
Route (app)                                 Size  First Load JS
┌ ○ /_not-found                            134 B         102 kB
├ ● /[locale]                            33.8 kB         196 kB
├ ● /[locale]/blog                         128 B         165 kB
├ ● /[locale]/blog/[slug]                  128 B         165 kB
├ ● /[locale]/projects/gardenpin         8.08 kB         170 kB
├ ● /[locale]/terminal                   2.71 kB         121 kB
└ ƒ /api/newsletter                        134 B         102 kB

+ First Load JS shared by all             102 kB
  ├ chunks/255-….js                      45.9 kB
  ├ chunks/4bd1b696-….js                 54.2 kB
  └ other shared chunks (total)          2.08 kB
```

196 kB First Load JS for the home page is in Lighthouse's "good" range (< 300 kB). Shared 102 kB is React/runtime/next-intl core.

### Dynamic imports

Created `components/DeferredOverlays.jsx` — a thin client wrapper that loads four non-critical components via `next/dynamic({ ssr: false })`:

- `NetworkCanvas` — decorative `<canvas>` background, `useEffect`-only logic, no SSR value
- `CookieBanner` — appears on first visit only
- `BackToTop` — only shown after scroll
- `ScrollNav` — section pip nav, only useful after scroll

These now load as a separate chunk after hydration rather than blocking the initial JS for above-the-fold content. The home page (`app/[locale]/page.js`) was simplified to a single `<DeferredOverlays />` line in place of the four direct imports.

`Terminal` is already lazy via routing (`/terminal` is a separate route, not bundled into the home page). `TerminalShortcut` is a tiny keypress listener (no JSX, just a `useEffect`) — left as-is.

### Compiler tweak

```js
compiler: {
  removeConsole: process.env.NODE_ENV === 'production'
    ? { exclude: ['error', 'warn'] }
    : false,
}
```

Strips `console.log` from production builds (preserves `error` / `warn`).

## 5. Viewport meta

**Before:** missing — Next.js 15 doesn't auto-inject `<meta name="viewport">`; it requires an explicit `viewport` export.

**After:** added to `app/layout.js`:

```js
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAFA' },
    { media: '(prefers-color-scheme: dark)',  color: '#0A0A0A' },
  ],
};
```

Verified at runtime: `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` is now in the rendered `<head>`. Bonus: `theme-color` matches the actual `--bg` for each scheme, so the mobile address-bar colour matches the page.

## 6. Color contrast

Audited every `text-gray-*` usage. Most pair `text-[#6B7280]` (Tailwind gray-500, 4.6 : 1 on white — passes AA) with `dark:text-gray-400` (`#9CA3AF` on dark background, ≈ 6 : 1 — passes AA). Two issues found and fixed:

| File | Before | After | Reason |
|---|---|---|---|
| `components/Newsletter.jsx:87` | `placeholder:text-gray-400` | `placeholder:text-gray-500 dark:placeholder:text-gray-400` | gray-400 on white = 2.85 : 1 (fail AA) |
| `components/Contact.jsx` (3 inputs) | `placeholder-gray-400` | `placeholder-gray-500 dark:placeholder-gray-400` | same as above |

`StatsBar.jsx` uses bare `text-gray-400` but the surrounding background is hardcoded dark (`bg-[#111111]` / `bg-[#141414]`) in both schemes, so it sits at ≈ 6 : 1 — passes AA. Left alone.

## 7. Build verification

```
✓ Compiled successfully in 22.6s
✓ Generating static pages (25/25)
```

No type errors, no lint failures, all 25 static pages (3 locales × routes) generated cleanly.

Smoke-tested in dev: page renders, hero shows "Patrik Přikryl", body uses `Inter` (next/font), heading uses `Plus Jakarta Sans` (next/font), `NetworkCanvas` mounts via the deferred wrapper, no browser console errors.

## Files changed

```
app/layout.js                    next/font + viewport export, removed Google Fonts <link>
app/globals.css                  removed @import, swapped font-family to var(--font-*)
app/[locale]/page.js             use <DeferredOverlays /> instead of 4 direct imports
components/DeferredOverlays.jsx  NEW — dynamic({ ssr:false }) for non-critical overlays
components/Hero.jsx              fontFamily inline style → CSS var
components/Newsletter.jsx        placeholder contrast fix
components/Contact.jsx           placeholder contrast fix (3 inputs)
tailwind.config.js               fontFamily uses next/font CSS vars
next.config.js                   AVIF/WebP, removeConsole, outputFileTracingRoot
```

## Future opportunities (not done in this pass)

- **framer-motion** — large fraction of the 33.8 kB page bundle. `LazyMotion` + `domAnimation` feature subset would cut ~25 kB. Invasive (requires wrapping the tree in `<LazyMotion>` and using `m.*` instead of `motion.*`).
- **patrik.jpg** — 847 KB original; `next/image` already handles resizing, but a pre-optimised source would speed up cold cache further.
- **lenis** smooth-scroll library is bundled into the root client tree; could be lazy-loaded on first scroll.
