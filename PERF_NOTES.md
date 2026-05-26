# Performance Budget & Bundle Analyzer — 2026-05-16

Setup pass for `@next/bundle-analyzer`. Adds tooling + records the current baseline. The actual analyzer HTML reports are generated locally (or in CI) by running `npm run analyze` — this note captures the methodology and the optimization candidates surfaced from the existing build output.

## Setup

| Change | File |
|---|---|
| `@next/bundle-analyzer` as devDependency | `package.json` |
| `analyze` npm script (cross-platform via Node wrapper) | `package.json` + `scripts/analyze.js` |
| Lazy-loaded `withBundleAnalyzer` wrap (no-op unless `ANALYZE=true`) | `next.config.js` |

The wrap is lazy on purpose: the `require('@next/bundle-analyzer')` only runs when `ANALYZE=true`, so production builds never touch the package. That keeps build trees lean and means the package can stay a devDependency even if the host doesn't install devDeps for some reason.

### How to run

```bash
npm install            # picks up @next/bundle-analyzer
npm run analyze        # emits .next/analyze/client.html (+ edge / nodejs)
```

The HTML reports open as treemaps. Look for: (a) chunks > 50 kB gz, (b) duplicated copies of a library across chunks, (c) anything that shouldn't be in the client bundle (server-only modules).

## Baseline — `next build` output (from `LIGHTHOUSE_NOTES.md`, 2026-05-01)

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

196 kB First Load JS on `/[locale]` is in Lighthouse's "good" range (< 300 kB). The home route's 33.8 kB route-specific bundle is the headline number to chip away at.

## Candidates > 50 kB (top 3 — surfaced before analyzer run)

These are derived from the shared-chunks output above plus a code-level review. The analyzer report will refine numbers, but the candidates and remediations don't change.

### 1. `chunks/4bd1b696-….js` — 54.2 kB (shared)

This is the React + Next.js runtime + next-intl client core. Largely non-negotiable: it's the framework. No remediation expected without dropping `next-intl` or migrating to App Router server components for the affected boundaries.

**Remediation candidate (minor):** audit each `'use client'` directive. Any component that doesn't actually need client interactivity can move to a server component, shrinking the boundary that pulls next-intl client runtime. Likely wins are small (< 5 kB) — track in a follow-up.

### 2. `framer-motion` — packed inside `/[locale]` route-specific (~25–30 kB of the 33.8 kB)

Used on `Hero.jsx`, `StatsBar`, `Projects`, etc. for entry animations. The full `motion` API ships its event/gesture/layout subsystems whether or not we use them.

**Remediation:** swap `motion.*` for `m.*` and wrap the tree in `<LazyMotion features={domAnimation} strict>`. Cuts the framer-motion footprint by ~25 kB on this route. Already flagged in `LIGHTHOUSE_NOTES.md` § "Future opportunities" — not done because it touches every animated component (Hero, StatsBar, Projects, Awards, Beliefs, Skills, CoCreators, Contact). Invasive but mechanical.

### 3. `lenis` — smooth-scroll, bundled into root client tree

The `lenis` library is initialized in `<SmoothScroll>` (root layout). It's not huge (~10 kB) but it's loaded eagerly for every page, including `/terminal` (which doesn't need it).

**Remediation:** lazy-load on first scroll event, or scope the `<SmoothScroll>` wrap to routes that actually benefit (home, blog list/detail, gardenpin case study) and leave `/terminal` and API routes unwrapped. Estimated save: ~10 kB on `/terminal` First Load.

## Out of scope here

- Image bundle. `patrik.jpg` (847 kB) is an image weight problem, not a JS bundle problem — covered in `LIGHTHOUSE_NOTES.md`.
- `next-mdx-remote` — used only on `/[locale]/blog/*`; doesn't appear on the home route's First Load. Acceptable.
- `resend` — server-only, doesn't ship to the client.

## Next steps

1. Run `npm run analyze` locally or in CI and commit the resulting `.next/analyze/*.html` snapshots to a doc artifact branch (or upload to an S3/Vercel preview) — not to `main`.
2. Pick one candidate (recommend: `LazyMotion` swap, biggest single saving).
3. Re-run `npm run analyze`, diff against baseline, append a "Pass 2" section to this file with the numbers.

## Pass 2 — LazyMotion + lazy lenis (2026-05-26)

Implemented candidates #2 (LazyMotion) and #3 (lazy lenis). Verified via `next build`.

### Changes

| Change | File |
|---|---|
| `<LazyMotion features={domAnimation} strict>` wrapping the whole tree | `components/MotionProvider.jsx` (new) + `app/layout.js` |
| All 23 animated components `motion.*` → `m.*` (lightweight) | `components/*.jsx` |
| `lenis` dynamic-imported in `useEffect` (out of First Load) + skipped under `prefers-reduced-motion` | `components/SmoothScroll.jsx` |

`domAnimation` (not `domMax`) is enough — no component uses `drag`/`pan`/`layout`.

### Before → after (First Load JS)

| Route | Baseline | Pass 2 | Δ |
|---|---|---|---|
| `/[locale]` (home) | 196 kB | **171 kB** | **−25 kB** |
| `/[locale]/blog` | 165 kB | 136 kB | −29 kB |
| `/[locale]/projects/gardenpin` | 170 kB | 139 kB | −31 kB |

Shared chunks unchanged (45.9 + 54.2 kB) — framer-motion's full feature set was route-specific, so the win lands per-route. The `domAnimation` bundle + the now-async `lenis` chunk load after hydration.

### ⚠️ Gotcha hit during this pass

The mechanical `motion.*` → `m.*` rename collides with **local variables named `m`**. The case studies had `metrics.map((m, i) => <m.div .../>)` — after the rename, the `m` param shadowed the framer-motion `m`, so `<m.div>` resolved to `undefined` → `Error: Element type is invalid … got: undefined` at SSR prerender (only on the two `/projects/*` pages; home was unaffected). Fixed by renaming the param to `metric`. `LazyMotion strict` does **not** catch this (it only guards against the heavy `motion.*`). Any future `motion`→`m` work must scan for `m` shadowing.

## Why this pass stopped at setup

Running `next build` requires Node.js, which isn't available in the current agent worktree (`node.exe` not on PATH). Setup + methodology + candidates are committable now; the analyzer-report HTML is reproducible by anyone with Node who runs `npm run analyze`. Verification of the new dep + config will happen on the next Vercel CI deploy.
