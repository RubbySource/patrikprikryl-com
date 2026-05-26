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

### Fáze 2 — Personal brand assets (vyžadují Patrika k naplnění)

- [ ] **Testimonials — naplnit reálnými citáty** ⚠️ Patrik vloží — `components/Testimonials.jsx` + `data/testimonials.js` už existují jako placeholder (zobrazí friendly empty state). Po vložení 2-3 reálných testimonials (jméno, role, firma, LinkedIn URL, foto/inicály, quote per locale) se sekce auto-přepne na grid layout. Akce: claude přidá do BACKLOGu instrukci `Patrik vlož reálné testimonials do data/testimonials.js dle existujícího schématu`. Pak commit.

### Fáze 3 — Polish + redesign experiment

- [ ] **Claude Design audit + návrh redesignu webu** ⚠️ EXPERIMENT — pustit `frontend-design` skill na celý web (Hero, About, Projects, Awards, Testimonials, Newsletter, Contact, Blog, Footer). Výstup `docs/CLAUDE_DESIGN_PROPOSAL.md` s návrhem ucelené nové vizuální identity + HTML mockupy. Patrik schválí / odmítne / vybere části. Pokud good → implementační položky se přidají do BACKLOGu. Pokud ne → status quo (současný design je dobrý dle REDESIGN_STRATEGY).

### Fáze 4 — Drobnosti & maintenance

- [x] **Bundle size monitoring** — hotovo 2026-05-26
  - `scripts/bundle-size-report.js` (self-contained, jen Node builtins) parsuje **First Load JS** tabulku z `next build` výstupu → snapshot JSON; `compare` mód dělá per-route Δ Markdown tabulku (🔺 regrese / 🟢 zlepšení / 🆕 nová / 🗑️ smazaná route, + budget warning). Budget + threshold v `package.json` → `nextBundleAnalysis` (350 kB / 1 kB). Lokální test: `npm run bundle:report`.
  - **Proč parsovat build tabulku** místo sumování `.next` manifestů: gzip suma z manifestů běžela 20–40 kB vysoko a chyba byla route-závislá (`/demo` +41 kB — async chunky se počítají v manifestu, ne ve First Load). Parsování dává čísla **identická s build logy / Vercelem**. Ověřeno proti reálnému buildu (171/136/146/115/139/121 kB sedí na 1 kB).
  - Workflow `docs/bundle-size.workflow.yml` (PR k main): buildne base i head v jednom jobu → žádná cross-run artifact logika, žádný "první PR nemá baseline" edge case; jen first-party actions (checkout/setup-node/github-script), sticky PR comment. ⚠️ **Patrik:** runner token nemá `workflow` scope → zkopíruj `docs/bundle-size.workflow.yml` → `.github/workflows/bundle-size.yml` (návod v `PERF_NOTES.md` § "Bundle-size CI monitor"). Žádné secrets potřeba.

- [~] **404 + 500 stránky polish** — stránky existují (`not-found.jsx`, `error.jsx`), ale možná postrádají osobní touch (humor, ASCII art, "co dělat dál" linky). Upgrade na zapamatovatelné error pages — bonus brand point.

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

- [x] **Newsletter auto-digest při novém blog postu** — hotovo 2026-05-26
  - `scripts/send-blog-digest.js` (self-contained CommonJS, jen `resend`) detekuje nově přidané `content/blog/{cs,en,de}/*.mdx` a pošle digest přes Resend **Broadcasts** (auto unsubscribe), subject `🌱 Nový článek/New post/Neuer Beitrag: <title>`, plně lokalizováno cs/en/de. Trigger workflow + diff logika hotové.
  - Per-locale doručení přes `RESEND_AUDIENCE_ID_{CS,EN,DE}`; fallback na jednu `RESEND_AUDIENCE_ID` (1 digest/článek v `BLOG_DIGEST_PRIMARY_LOCALE`, default en — smíšený seznam nedostane duplicitu). Gated `BLOG_DIGEST_ENABLED=on` (default off → merge je bezpečný). `workflow_dispatch` + `BLOG_DIGEST_DRY_RUN` pro test bez rozeslání.
  - ⚠️ Patrik: (1) zkopíruj `docs/blog-digest.workflow.yml` → `.github/workflows/blog-digest.yml` (runner token nemá `workflow` scope); (2) v GitHub Actions Secrets/Variables doplň klíče + zapni `BLOG_DIGEST_ENABLED` (až po ověření domény). Návod: `docs/NEWSLETTER_SETUP.md` §7.

- [x] **Newsletter content strategy + welcome series** — hotovo 2026-05-25
  - `docs/NEWSLETTER_STRATEGY.md`: audience (procurement / AI builders / CZ tech), ~měsíční frekvence, digest+insight formát, osobní tón.
  - Welcome series `lib/welcome-series.js`: 2 navazující emaily (must-read posty +2 dny, reply CTA +5 dní), plně lokalizované cs/en/de, plánované přes Resend `scheduledAt` (bez cronu — robustní na Vercel). Locale se zachytí při signupu (`Newsletter.jsx` → API).
  - Gated env `NEWSLETTER_WELCOME_SERIES=on` (default off — nic se neodešle dokud Patrik neověří From doménu). Manuální test trigger `POST /api/newsletter/welcome-series` (chráněno `NEWSLETTER_ADMIN_SECRET`).

- [x] **"As seen in" / media mentions lišta (skeleton)** — hotovo 2026-05-26
  - `components/MediaMentions.jsx` (horizontal logo strip pod StatsBar, id-less trust band s border-y) + `data/mediaMentions.js` se schématem `{ name, logoUrl?, articleUrl?, date? }`. Logo s grayscale→barva hoverem; když `logoUrl` chybí, vykreslí se jméno jako textový wordmark (nepadá na chybějící obrázek). `articleUrl` udělá z loga odkaz (nový tab).
  - >6 položek → seamless auto-scroll marquee (duplikovaná stopa, `translateX -50%`, pauza na hover, vypnuto pod `prefers-reduced-motion` přes `motion-safe:`); ≤6 → vycentrovaný flex-wrap. Nová `marquee` keyframe v `tailwind.config.js`. Plná i18n cs/en/de (namespace `mediaMentions`: label "Mluví o mně/As seen in/Bekannt aus").
  - **Pozn.:** sekce se auto-skryje když je `data/mediaMentions.js` prázdné — žádné falešné mediální claimy na živém webu. ⚠️ **Patrik:** doplň reálné zmínky (články, podcasty, konference) do `data/mediaMentions.js`; logo dej jako PNG/SVG do `public/media/` (nebo nech jen `name` → wordmark) a přidej `articleUrl` pro proklik.

- [x] **About — Timeline kariéry komponent (skeleton)** — hotovo 2026-05-26
  - `components/Timeline.jsx` (iOS-style vertikální rail: barevná tečka per typ, sticky rok, scroll-reveal přes framer-motion) + `data/timeline.js` se schématem `{ year, role, company, location, description, type, current }` a 2 example entries. Typy work/education/project/award mají vlastní barvu + ikonu; `current: true` přidá pulzující "Teď" badge. Plná i18n cs/en/de (namespace `timeline` + `nav.journey`).
  - **Pozn.:** `/about` route neexistuje (web je single-page, story-driven), takže sekce je zapojená do homepage `app/[locale]/page.js` za Awards (id `#journey`) + nový nav link "Cesta/Journey/Werdegang". Sekce se auto-skryje když je `data/timeline.js` prázdné. ⚠️ **Patrik:** přepiš 2 example milestones reálnou kariérní historií (role, vzdělání, ocenění) dle schématu v `data/timeline.js`.

- [x] **Performance optimalizace — LazyMotion + lazy lenis** — hotovo 2026-05-26
  - `components/MotionProvider.jsx` (`<LazyMotion features={domAnimation} strict>` v root `app/layout.js`) + všech 23 animovaných komponent převedeno z `motion.*` na lightweight `m.*`. `domAnimation` stačí (nikde `drag`/`layout`). lenis lazy-loadovaný přes dynamický `import()` v `SmoothScroll.jsx` `useEffect` (mimo First Load) + přeskočen pod `prefers-reduced-motion`.
  - **First Load JS:** home 196 → **171 kB** (−25 kB), blog 165 → 136 kB, gardenpin 170 → 139 kB. Sdílené chunky beze změny → úspora per-route. Detaily + před/po tabulka v `PERF_NOTES.md` §"Pass 2".
  - **Pozn.:** rename `motion`→`m` koliduje s lokálními proměnnými `m` — case studies měly `metrics.map((m,i)=> <m.div/>)`, kde param `m` stínil import → `undefined` element → SSR prerender fail jen na `/projects/*`. Opraveno přejmenováním na `metric`. `strict` tohle nechytí (hlídá jen těžký `motion.*`). Build čistý (43/43 stránek).

- [x] **Hero redesign dle REDESIGN_STRATEGY** — hotovo 2026-05-26
  - `components/Hero.jsx`: **split-text reveal** jména — `Patrik` + příjmení rozsekané na písmena, per-letter Framer Motion stagger (`y` + `rotateX` z `[perspective:600px]`, `staggerChildren` 0.04). Přístupné: `<h1>` má `aria-label` s celým jménem, písmenkové spany `aria-hidden` → čtečka přečte jméno jednou, ne po písmenech. Fotka teď **scale 1.05→1.0** (settle-in místo původního 0.96→1.0).
  - **Social-proof badge** pod taglinou (nový i18n klíč `hero.social_proof`, cs/en/de) — claimy zrcadlí pravdivé údaje z StatsBaru ("TOP 1% LinkedIn Automotive · 2 500+ sledujících"), žádné vymyšlené "Top Voice" tvrzení. Dark hero variant + scroll indicator už existovaly (dark: třídy, animovaná myš) → ponechány.
  - **Pozn.:** CTA hierarchie ponechána (filled primary = "Zobrazit projekty", LinkedIn jako outline; žádné mailto — splňuje "ne mailto"). Pozor na lekci `m`-shadowing: split helper používá `char`/`i`, nikde ne `m`. Build čistý (Compiled successfully, home First Load JS 171 kB beze změny).

- [x] **Speaking sekce — keynotes/podcasts/conferences (skeleton)** — hotovo 2026-05-26
  - `components/Speaking.jsx` (card grid `sm:grid-cols-2`, scroll-reveal přes framer-motion, dark mode, sort newest-first dle `date`) + `data/speaking.js` se schématem `{ type, title, event, date, location, description, videoUrl?, link?, image? }`. Typy keynote/conference/podcast/interview mají vlastní chip (barva + ikona). `date` ('YYYY' | 'YYYY-MM' | 'YYYY-MM-DD') se lokalizuje přes `Intl.DateTimeFormat`.
  - **Video embed:** `videoUrl` umí YouTube (`watch?v=` / `youtu.be` / `/embed/` / `/shorts/`) → 16:9 iframe, i Spotify (`episode`/`show`/…) → kompaktní 152px přehrávač; jinak fallback na `image` thumbnail nebo externí "Přehrát/Poslechnout" odkaz (`link`). Plná i18n cs/en/de (namespace `speaking`).
  - Zapojeno do homepage `app/[locale]/page.js` za Timeline (id `#speaking`). Sekce se auto-skryje když je `data/speaking.js` prázdné (žádné vymyšlené talky na živém webu) → bez nav linku, dokud není obsah. ⚠️ **Patrik:** doplň reálná vystoupení do `data/speaking.js` (keynoty, panely, podcasty, rozhovory); stačí vložit YouTube/Spotify link do `videoUrl` a embedne se inline.
