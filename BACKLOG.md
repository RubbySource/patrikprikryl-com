# patrikprikryl.com — BACKLOG

> Spravuje: PO Runner (autonomní, viz Projects/po-runner.ps1)
> Projekt: 04_Central Web
> Repo: `C:\Users\Dell 5090\Documents\Claude\Projects\04_Central Web`
> Poslední sync: 2026-05-24

---

## Vize / cíl

**Personal brand portfolio** pro procurement / AI expertise. **Primární prodejní nástroj** — kdokoli kdo Patrika najde, musí za 10 vteřin pochopit: kdo je, proč je výjimečný, co umí a jak ho kontaktovat.

**Story-driven, ne project-driven.** LinkedIn jako největší asset — web ho absorbuje a rozšiřuje. 3 jazyky: **cs / en / de**.

**Stack:** Next.js 15 App Router, JS (NE TypeScript), `next-intl` pro i18n, Vercel auto-deploy z main.

Plný context: viz [REDESIGN_STRATEGY.md](./REDESIGN_STRATEGY.md).

---

## Fronta

### Fáze 1 — Newsletter rozjet (PRIORITA, hlavní akce teď)

- [~] **Newsletter — dokončit setup a end-to-end test** — ⚠️ **čeká: Patrik vytvoří Audience v Resend dashboardu + ověří doménu `patrikprikryl.com` (DNS SPF/DKIM) + doplní Vercel env vars** (`RESEND_AUDIENCE_ID` ad.). Krok-za-krokem návod + e2e checklist + troubleshooting hotové: [`docs/NEWSLETTER_SETUP.md`](./docs/NEWSLETTER_SETUP.md). Kód auditován (odolný vůči chybějícím env vars; pozor: Vercel read-only FS → `subscribers.json` na produkci nepersistuje, Audience = zdroj pravdy), `.env.local.example` doplněn o `NEWSLETTER_ADMIN_EMAIL`. Po splnění manuálních kroků → spustit e2e test dle návodu a označit `[x]`. _Původní kontext:_ Newsletter je z 80 % hotový (frontend `Newsletter.jsx`, API route s Resend + welcome email + admin notif + subscribers.json fallback, `RESEND_API_KEY` nastavený). Chybí: (1) vytvořit Resend Audience v Resend dashboardu a doplnit `RESEND_AUDIENCE_ID` do `.env.local` (Patrik manuálně) + Vercel env vars (Patrik). (2) Otestovat end-to-end signup flow lokálně (`npm run dev`, otevřít homepage, submit form, ověřit: welcome email přijde, admin notif přijde na pt.rubby@gmail.com, `data/subscribers.json` se zapíše). (3) Otestovat na produkci (patrikprikryl.com) — ověřit Vercel env, ověřit že From email `newsletter@patrikprikryl.com` funguje (DNS records SPF/DKIM v Resend). (4) Opravit cokoli co padá. Pokud Resend Audience setup vyžaduje akci Patrika, vytvoř `docs/NEWSLETTER_SETUP.md` s návodem a v BACKLOG napiš `⚠️ čeká: Patrik vytvoří Audience v Resend dashboardu`.

- [ ] **Newsletter content strategy + welcome series** — definovat co a kdy posílat. Výstup `docs/NEWSLETTER_STRATEGY.md` s odpovědmi: (1) frekvence (týdně/měsíčně), (2) formát (digest nových blog postů / standalone insights / mix), (3) cílovka (procurement profesionálové, AI early adopters, Czech tech komunita), (4) tón (osobní, krátké odstavce, code/tech examples). Plus implementovat **welcome series**: 2-3 navazující emaily v sekvenci po signup (uvítací + must-read posty + výzva k odpovědi). Resend `emails.send` se scheduled delay nebo manuální triggery v `app/api/newsletter/welcome-series/route.js`.

- [ ] **Newsletter auto-digest při novém blog postu** — když Patrik publikuje nový post (commit do `content/blog/{cs,en}/`), automaticky odeslat digest všem subscribers via Resend Broadcasts API (nebo `emails.send` v batch). Trigger: GitHub Actions workflow na push do main + change v `content/blog/`. Template: blog title + excerpt + link, subject `🌱 Nový článek: <title>`. Per-locale (CS subscribers dostanou cs post, EN dostanou en). Implementace: `.github/workflows/blog-digest.yml` + `scripts/send-blog-digest.js` který detekuje nově přidaný post a pošle.

### Fáze 2 — Personal brand assets (vyžadují Patrika k naplnění)

- [ ] **About — Timeline kariéry komponent (skeleton)** ⚠️ Patrik doplní data — postavit `components/Timeline.jsx` jako iOS-style vertikální timeline (tečka + čára + card per milestone, sticky year header, scroll reveal animace). Data v `data/timeline.js` jako prázdná struktura `[{ year, role, company, location, description, type: 'work'|'education'|'project'|'award' }]` s 1-2 example entries (např. první role, founding GardenPin). Plná i18n cs/en/de v `locales/*.json` namespace `timeline`. Po implementaci do `app/[locale]/about/page.jsx`, Patrik doplní milestones ručně.

- [ ] **Testimonials — naplnit reálnými citáty** ⚠️ Patrik vloží — `components/Testimonials.jsx` + `data/testimonials.js` už existují jako placeholder (zobrazí friendly empty state). Po vložení 2-3 reálných testimonials (jméno, role, firma, LinkedIn URL, foto/inicály, quote per locale) se sekce auto-přepne na grid layout. Akce: claude přidá do BACKLOGu instrukci `Patrik vlož reálné testimonials do data/testimonials.js dle existujícího schématu`. Pak commit.

- [ ] **"As seen in" / "Mentioned in" lišta médií** ⚠️ Patrik dodá logos — pokud Patrik má články/zmínky v médiích (Forbes, e15, ihned.cz, podcasty, konference), postavit `components/MediaMentions.jsx` jako horizontal scrolling logo strip pod Hero sekcí. Skeleton komponent + `data/mediaMentions.js` schema `[{ name, logoUrl, articleUrl, date }]`. Logos jako PNG/SVG v `public/media/`. Plus instrukci v BACKLOGu pro Patrika co dodat.

- [ ] **Speaking sekce — keynotes/podcasts/conferences** ⚠️ Patrik dodá data — pokud Patrik někde mluví, samostatná sekce nebo subpage `/speaking` s kartami: event/podcast název, datum, místo, popis, video embed (YouTube/Spotify), fotka. Skeleton `components/Speaking.jsx` + `data/speaking.js`. Plná i18n.

### Fáze 3 — Polish + redesign experiment

- [ ] **Performance optimalizace — LazyMotion + lenis lazy** — dle PERF_NOTES.md: nahradit `import { motion } from 'framer-motion'` za `LazyMotion + domAnimation` (~25 kB úspora), lazy-load lenis smooth scroll (~10 kB úspora). Audit `next-intl` client boundaries (možná zbytečně velký client bundle). Ověř Lighthouse score před/po. Cíl: Performance ≥ 90, Accessibility ≥ 95, FCP < 1.5 s. Push na main.

- [ ] **Hero redesign dle REDESIGN_STRATEGY** — implementovat doporučení: dark hero variant (toggle nebo system preference), split-text reveal animace pro jméno (Framer Motion stagger), velká fotka s fade-in + scale 1.05→1.0, social proof badge ("500+ connections · Top Voice in Procurement"), primary CTA LinkedIn (ne mailto), scroll indicator (animated arrow). Inspirace: Brittany Chiang, Josh Comeau.

- [ ] **Claude Design audit + návrh redesignu webu** ⚠️ EXPERIMENT — pustit `frontend-design` skill na celý web (Hero, About, Projects, Awards, Testimonials, Newsletter, Contact, Blog, Footer). Výstup `docs/CLAUDE_DESIGN_PROPOSAL.md` s návrhem ucelené nové vizuální identity + HTML mockupy. Patrik schválí / odmítne / vybere části. Pokud good → implementační položky se přidají do BACKLOGu. Pokud ne → status quo (současný design je dobrý dle REDESIGN_STRATEGY).

### Fáze 4 — Drobnosti & maintenance

- [ ] **Bundle size monitoring** — přidat GitHub Action která po každém PR spustí `npm run analyze` a okomentuje do PR jak se změnil bundle size (Δ per route). Prevence regressí. Použít existing `@next/bundle-analyzer` setup.

- [ ] **404 + 500 stránky polish** — stránky existují (`not-found.jsx`, `error.jsx`), ale možná postrádají osobní touch (humor, ASCII art, "co dělat dál" linky). Upgrade na zapamatovatelné error pages — bonus brand point.

---

## Hotovo (chronologicky, nejnovější dole)

- [x] **Odstraň přímý email odkaz (mailto:)** — ponechat jen kontaktní formulář a LinkedIn — hotovo 2026-05-18
  - `mailto:` byl jen v `components/GetInTouch.jsx` (1 výskyt). Nahrazen scroll-to-#contact handlerem. i18n klíč `getInTouch.email_cta` → `contact_cta` ve všech 3 locales: "Napsat zprávu" / "Send a Message" / "Nachricht senden". Ikona změněna z obálky na chat bubble.

- [x] **Kontaktní formulář — Resend integrace** — hotovo 2026-05-18
  - API route `app/api/contact/route.js` napojena na Resend, honeypot, strukturované chybové kódy, plná i18n cs/en/de.

- [x] **Animace projektu na hover** — hotovo 2026-05-22
  - `components/Projects.jsx`: ProjectCard + HobbyProjectCard hover efekty (scale, lift, glow). GPU-friendly.

- [x] **Projekty sekce — Zdravotní analyzátor jako druhá karta** — hotovo 2026-05-22

- [x] **Blog post 1 (CZ) — GardenPin** — hotovo 2026-05-23
  - `content/blog/cs/jak-jsem-postavil-gardenpin.mdx` + EN překlad.

- [x] **Testimonials / social proof sekce (placeholder)** — hotovo 2026-05-23
  - Komponent + data file (prázdný array), friendly empty state. Připravený na naplnění reálnými testimonials.

- [x] **Open Graph obrázky** — hotovo 2026-05-23
  - Dynamický endpoint `app/api/og/route.jsx` (edge runtime), 1200×630 PNG, zapojeno do `generateMetadata` všech stránek.

- [x] **Case study — GardenPin** — hotovo 2026-05-23
  - `/[locale]/projects/gardenpin` s plnou i18n cs/en/de, link z hobby project card.

- [x] **[P1] RSS feed pro blog** — hotovo 2026-05-18
  - Per-locale RSS: `/blog/feed.xml`, `/cs/blog/feed.xml`, `/de/blog/feed.xml`.

- [x] **[P1] Hreflang tagy + canonical URL** — hotovo 2026-05-18
  - `alternates: { canonical, languages: {...} }` na všech stránkách.

- [x] **[P2] Custom 404 + 500 stránky** — done 2026-05-16

- [x] **[P2] CV / About sekce — strukturovaná data** — done 2026-05-16
  - Person + WebSite JSON-LD přes `components/seo/StructuredData.jsx`.

- [x] **[P3] Performance budget — bundle analyzer report** — done 2026-05-16
  - `@next/bundle-analyzer` + `npm run analyze` + PERF_NOTES.md s baseline a kandidáty na zmenšení.

- [x] **Blog post 3 — "Jak jsem postavil autonomního PO agenta"** — hotovo 2026-05-23
  - cs + en verze (~750 / 700 slov), osobní tón.

- [x] **Kontaktní stránka /contact** — hotovo 2026-05-24
  - Samostatná stránka s ContactPoint JSON-LD, formulářem (reuse komponenta), LinkedIn + GitHub, plná i18n.

- [x] **Case study — Zdravotní analyzátor** — hotovo 2026-05-24
