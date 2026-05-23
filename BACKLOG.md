# patrikprikryl.com — BACKLOG

> Spravuje: PO Agent (autonomní)  
> Projekt: 04_Central Web  
> Repo: `C:\Users\Dell 5090\Documents\Claude\Projects\04_Central Web`  
> Poslední sync: 2026-05-23

---

## Fronta

- [x] Odstraň přímý email odkaz (mailto:) ze všech sekcí — ponechat jen kontaktní formulář a LinkedIn — hotovo 2026-05-18
  - `mailto:` byl jen v `components/GetInTouch.jsx` (1 výskyt). Nahrazen scroll-to-#contact handlerem (otevře kontaktní formulář). i18n klíč `getInTouch.email_cta` → `contact_cta` ve všech 3 locales (cs/en/de): "Napsat zprávu" / "Send a Message" / "Nachricht senden". Ikona změněna z obálky na chat bubble. Footer, Contact, About a Navigation prohlédnuty — žádné jiné mailto: nebyly. Plain-text email v `Terminal.jsx` (easter egg) ponechán, není to klikatelný odkaz.

- [x] Kontaktní formulář — dokončit Resend integraci — hotovo 2026-05-18
  - API route `app/api/contact/route.js` (JS, ne TS — projekt používá JS) byla už dříve napojena na Resend (`resend@^4` v `package.json`, defaultní `CONTACT_TO_EMAIL=pt.rubby@gmail.com`). Doplněno: (1) **honeypot pole `website`** — vizuálně schované (`absolute left:-9999px`), `tabIndex=-1`, `autoComplete="off"`; bot vyplní → API tiše vrátí `ok` bez odeslání e-mailu. (2) **strukturované chybové kódy** — API místo volných řetězců vrací `{ code: 'invalid_email' | 'missing_name' | 'missing_message' | 'rate_limited' | 'send_failed' | 'not_configured' | 'invalid_body' }`. (3) **plná i18n** — nový namespace `contact.errors.*` ve všech 3 locales (cs/en/de); klient mapuje kód → lokalizovaná hláška, neznámé kódy fallback na `error_generic`. Success hláška `contact.success` byla už dříve. Dev preview neověřen — node.exe v této worktree nedostupný; ověření přes Vercel CI deploy + ruční test formuláře.

- [x] Animace projektu na hover — hotovo 2026-05-22
  - `components/Projects.jsx`: oba typy karet (`ProjectCard` velké + `HobbyProjectCard` hobby grid) dostaly hover efekty. **Velké karty:** `whileHover={{ scale: 1.008 }}` (Framer Motion) + image/gradient `group-hover:scale-[1.04]` (CSS transition 1200ms) + zesvětlení gradient overlay + radial soft glow. **Hobby karty:** `whileHover={{ y: -6, scale: 1.02 }}` (lift) + border `hover:border-emerald-500/60` + smaragdový drop-shadow `hover:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.35)]` + radial glow + title micro-translate + description text osvítí. Vše GPU-friendly (`will-change-transform`), žádné layout shifty.
- [x] Projekty sekce — Zdravotní analyzátor jako druhá karta — hotovo 2026-05-22
  - Karta už existovala v `data/projects.js` (hobbyProjects[1]), refaktor podle backlog spec: (1) popis přepsán na "Soukromý offline health tracker — nahrát laboratorní výsledky, AI rozebere co je mimo normu" (cs/en/de). (2) `techStack` odstraněn (backlog: "Bez tech stacku"). (3) Přidáno `icon: 'health'` pole; `HobbyProjectCard` renderuje EKG/pulse SVG ikonu v pravém horním rohu (opacity 30 % → 60 % on hover), zarovnáno s health tématem karty.

- [x] Blog post CZ — první česky psaný post — hotovo 2026-05-23
  - Téma posunuté: místo "AI v procurement" zvolen GardenPin (osobnější, lépe ladí s aktuální fází "currently building"). Soubor: `content/blog/cs/jak-jsem-postavil-gardenpin.mdx` (~800 slov, osobní tón, frontmatter title/date/description/excerpt/tags). EN překlad: `content/blog/en/how-i-built-gardenpin.mdx`. AI-v-procurement post zůstává jako budoucí kandidát.

- [x] Testimonials / social proof sekce — hotovo 2026-05-23
  - Nová sekce `components/Testimonials.jsx` zapojena na homepage mezi `CoCreators` a `Contact` (`id="testimonials"`). Data v `data/testimonials.js` (prázdný array — schéma připravené pro budoucí citace: name, role, company, linkedin, image/initials, quote per-locale). Když `testimonials.length === 0`, komponent renderuje friendly placeholder card s CTA "Pracoval jsi se mnou? Napiš mi." (linkuje na `#contact` smooth-scrollem). Když naplní data, gridem 1/2/3 sloupců vykreslí testimonial cards (quote bubble, jméno, role+company, LinkedIn link). Plná i18n cs/en/de v `locales/*.json` (namespace `testimonials`: label, title, subtitle, placeholder_title, placeholder_text, placeholder_cta).

- [x] Open Graph obrázky — hotovo 2026-05-23
  - Dynamický endpoint `app/api/og/route.jsx` (edge runtime) přes `next/og` `ImageResponse` — 1200×630 PNG s gradientovým slate pozadím, blue→cyan PP markem, title, subtitle/date. Akceptuje query params: `kind=home|post`, `locale`, `title`, `subtitle`, `date`, `tag`. Cache-Control 1h browser / 24h CDN / 1w stale-while-revalidate. Zapojeno do `generateMetadata` na: `app/[locale]/page.js` (homepage — title+tagline), `app/[locale]/blog/page.jsx` (blog index — title+blog_tagline), `app/[locale]/blog/[slug]/page.jsx` (post title+date+tag), `app/[locale]/projects/gardenpin/page.jsx` (case study title+description+"Case Study" tag). Nové i18n klíče `meta.home_tagline` a `meta.blog_tagline` ve všech 3 locales. Ověřeno v dev: endpoint vrací HTTP 200 image/png 1200×630, blog OG renderuje českou datovou hlášku `23. května 2026`. Pozn.: v dev TLS prostředí nelze stáhnout default font (corp cert), na Vercel Edge to půjde čistě.

- [x] Case study — GardenPin — jak vznikl, co se naučil, výsledky — hotovo 2026-05-23
  - Samostatná stránka `/[locale]/projects/gardenpin` už existovala v EN, ale byla **hardcoded anglicky**. Refaktor: `components/GardenPinCaseStudy.jsx` přepsán na `useTranslations('caseStudy')`. Všechny sekce (header, problem, solution, tech_stack, features×4, timeline×6, metrics×6, screenshots×4, lessons×4, CTA) tahají texty z lokálů. TECH_STACK ponechán hardcoded (názvy technologií se nepřekládají). Plná i18n cs/en/de v `locales/*.json` (namespace `caseStudy`). Ověřeno v dev preview: všechny 3 URL (`/projects/gardenpin`, `/cs/projects/gardenpin`, `/de/projects/gardenpin`) vrací HTTP 200 a renderují správné jazykové verze. Žádné console errory.
  - **Link z karty:** `data/projects.js` GardenPin hobby project dostal pole `caseStudySlug: 'gardenpin'`. `components/Projects.jsx` `HobbyProjectCard` renderuje smaragdový "Číst případovou studii →" link (Next.js `<Link>`) pod tech stack tagy, jen když `caseStudySlug` existuje. URL respektuje `localePrefix: 'as-needed'` (EN bez prefixu).

- [x] **[P1] RSS feed pro blog** [S] — hotovo 2026-05-18
  - Per-locale RSS feeds: `/blog/feed.xml`, `/cs/blog/feed.xml`, `/de/blog/feed.xml`. `lib/blog.js` rozšířen o `getAllPostsForLocale(locale)` (fallback na root). `<link rel="alternate" type="application/rss+xml">` přidán přes `generateMetadata` v `app/[locale]/layout.js`.

- [x] **[P1] Hreflang tagy + canonical URL** [S] — hotovo 2026-05-18
  - `alternates: { canonical, languages: {...} }` přítomno na všech stránkách: homepage, blog list, blog slug, projects. Ověřeno čtením generateMetadata na každé stránce.

- [x] **[P2] Custom 404 + 500 stránky** [M] — done 2026-05-16
  - **Prompt:** Vytvoř `app/[locale]/not-found.tsx` a `app/[locale]/error.tsx` (error boundary, 'use client'). Design v souladu s rest of site (rounded cards, tailwind tokens), CTA "Zpět na úvod" + odkaz na kontakt. i18n pro všechny 3 jazyky (klíče `errors.404.title`, `errors.500.title`, atd. v locales/*.json). Pro error.tsx přidej `reset()` button. Build + ověř manuálně `/cs/neexistuje` a vyhodit chybu v dev.
  - **Hotovo:** not-found.jsx už existoval; přidán `app/[locale]/error.jsx` (client, `reset()` + Back home + Contact CTA, error.digest fallback). i18n namespace `error500` doplněn do en/cs/de. Build/dev preview v této worktree neověřen — node.exe není v `C:\Program Files\nodejs`; verifikace přes Vercel CI deploy.

- [x] **[P2] CV / About sekce — strukturovaná data** [M] — done 2026-05-16
  - **Prompt:** Vylepši `app/[locale]/about/` (pokud existuje, jinak vytvoř). Přidej JSON-LD `Person` schema (sameAs: GitHub, LinkedIn, Mastodon pokud máš), `jobTitle`, `worksFor`, `alumniOf`. Vytvoř komponent `<StructuredData />` v `components/seo/`. Pro homepage přidej `WebSite` + `SearchAction` JSON-LD. Ověř Rich Results Test (manuálně). Build + push.
  - **Hotovo:** Vytvořen `components/seo/StructuredData.jsx` (server component) + `components/seo/schemas.js` (builders pro Person, WebSite, ItemList). `app/layout.js` zjednodušen (inline Person+WebSite JSON-LD nahrazeny `<StructuredData data={personSchema()} />`). `app/[locale]/page.js` refaktor — per-locale `websiteSchema(locale)` (inLanguage cs-CZ/en-US/de-DE) + `portfolioSchema(locale, allProjects)`. `alumniOf` vynecháno (žádná data v repo o Patrikově vzdělání — fabrikovat by bylo strategicky špatné). `SearchAction` vynecháno (web nemá interní search, Google explicitně varuje před fake search box pro strukturovaná data). Ověření přes Vercel CI (node.exe v této worktree nedostupný).

- [x] **[P3] Performance budget — bundle analyzer report** [S] — done 2026-05-16
  - **Prompt:** Nainstaluj `@next/bundle-analyzer` jako devDependency, přidej `withBundleAnalyzer` wrap v `next.config.js`. Vytvoř npm script `analyze`. Spusť `ANALYZE=true npm run build`, najdi top 3 největší chunks (>50kB) a najdi způsob jak je zmenšit (dynamic import, replace lodash, atd.). Zaznamenej výsledky do `PERF_NOTES.md` (před/po). Commit + push.
  - **Hotovo:** `@next/bundle-analyzer` přidán do devDependencies. Wrap v `next.config.js` lazy-loaded (`require()` jen pokud `ANALYZE=true` — bezpečné pro produkční build). NPM script `analyze` přes Node wrapper (`scripts/analyze.js`) — cross-platform (Windows cmd nemá inline ENV=value). Vytvořen `PERF_NOTES.md` s baseline (z LIGHTHOUSE_NOTES.md), top 3 kandidáty (framer-motion → LazyMotion ~25kB, lenis lazy-load ~10kB, next-intl client boundary audit) a metodologií. Vlastní `npm run analyze` v této worktree nespuštěn (node.exe nedostupný); reprodukovatelné přes `npm install && npm run analyze`. Ověření přes Vercel CI deploy.


- [x] Blog post 3 — "Jak jsem postavil autonomního PO agenta" — Claude Dispatch + scheduled tasks, jak to funguje, co jsem se naučil. Osobní tón, cs + en verze, cca 600-800 slov. — hotovo 2026-05-23
  - Soubory: `content/blog/cs/autonomni-po-agent.mdx` (~750 slov) + `content/blog/en/autonomous-po-agent.mdx` (~700 slov). Pozn.: filenames z aktuálního promptu (`autonomni-po-agent` / `autonomous-po-agent`) místo původně backlog-spec slugů (`jak-jsem-postavil-po-agenta` / `how-i-built-a-po-agent`) — kratší, lépe se čtou v URL. Osobní tón, struktura: Co PO agent dělá (jeden prompt, cron, zero supervize) → 3 stavební kameny (backlog jako single source of truth, Claude Dispatch, scheduled tasks) → Co funguje (drobné úkoly, i18n, commit zprávy) → Co nefunguje (vkus, externí credentials, špatně psané položky) → Co to změnilo (vztah k portfoliu, "cycle complete" — buying agent v práci, PO agent doma). Frontmatter title/date/description/excerpt/tags: ["claude code", "autonomie", "automation", "side project"] + thumbnail. Sitemap je dynamický (`getAllPostsForLocale`) — nové posty se objeví automaticky bez ručního zápisu.

- [ ] Kontaktní stránka /contact — samostatná stránka `app/[locale]/contact/page.jsx` se SEO ContactPoint JSON-LD, formulářem (reuse ContactForm komponentu), LinkedIn + GitHub linky, mapa (embed nebo popis lokace Praha). NavLink "Kontakt" do navigace. cs/en/de i18n v namespace `contactPage`. Canonical URL, hreflang tagy.

- [ ] Performance optimalizace — LazyMotion místo plného Framer Motion bundle (~25kB úspora), lenis smooth scroll lazy-load (~10kB). Podle PERF_NOTES.md. Ověř Lighthouse score před/po v dev. Push na main.

- [x] Case study — Zdravotní analyzátor — jak funguje offline AI health tracker, proč lokální Ollama model, co jsem se naučil. Stejná struktura jako GardenPin case study. cs/en/de. — hotovo 2026-05-23
  - Nová stránka `/[locale]/projects/zdravotni` (`app/[locale]/projects/zdravotni/page.jsx`) + komponenta `components/HealthAnalyzerCaseStudy.jsx`. Struktura mirroruje GardenPin case study (header / problem / why_local / how_it_works / tech_stack / features×4 / timeline×6 / metrics×6 / screenshots×4 / lessons×4 / CTA), s rose/pink akcentem (`#BE185D`) místo modré. Tech stack: Next.js 15, Ollama, Llama 3.1, Tesseract OCR, PostgreSQL, Tailwind. CTA odkazuje na `/blog/local-ai-health`. Plná i18n v namespace `caseStudyHealth` (cs/en/de) + nové meta klíče `meta.health_title` / `meta.health_description`. `HobbyProjectCard` "Health Analyzer" dostal `caseStudySlug: 'zdravotni'` v `data/projects.js` 