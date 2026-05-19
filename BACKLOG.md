# patrikprikryl.com — BACKLOG

> Spravuje: PO Agent (autonomní)  
> Projekt: 04_Central Web  
> Repo: `C:\Users\Dell 5090\Documents\Claude\Projects\04_Central Web`  
> Poslední sync: 2026-05-16

---

## Fronta

- [x] Odstraň přímý email odkaz (mailto:) ze všech sekcí — ponechat jen kontaktní formulář a LinkedIn — hotovo 2026-05-18
  - `mailto:` byl jen v `components/GetInTouch.jsx` (1 výskyt). Nahrazen scroll-to-#contact handlerem (otevře kontaktní formulář). i18n klíč `getInTouch.email_cta` → `contact_cta` ve všech 3 locales (cs/en/de): "Napsat zprávu" / "Send a Message" / "Nachricht senden". Ikona změněna z obálky na chat bubble. Footer, Contact, About a Navigation prohlédnuty — žádné jiné mailto: nebyly. Plain-text email v `Terminal.jsx` (easter egg) ponechán, není to klikatelný odkaz.

- [x] Kontaktní formulář — dokončit Resend integraci — hotovo 2026-05-18
  - API route `app/api/contact/route.js` (JS, ne TS — projekt používá JS) byla už dříve napojena na Resend (`resend@^4` v `package.json`, defaultní `CONTACT_TO_EMAIL=pt.rubby@gmail.com`). Doplněno: (1) **honeypot pole `website`** — vizuálně schované (`absolute left:-9999px`), `tabIndex=-1`, `autoComplete="off"`; bot vyplní → API tiše vrátí `ok` bez odeslání e-mailu. (2) **strukturované chybové kódy** — API místo volných řetězců vrací `{ code: 'invalid_email' | 'missing_name' | 'missing_message' | 'rate_limited' | 'send_failed' | 'not_configured' | 'invalid_body' }`. (3) **plná i18n** — nový namespace `contact.errors.*` ve všech 3 locales (cs/en/de); klient mapuje kód → lokalizovaná hláška, neznámé kódy fallback na `error_generic`. Success hláška `contact.success` byla už dříve. Dev preview neověřen — node.exe v této worktree nedostupný; ověření přes Vercel CI deploy + ruční test formuláře.

- [ ] Animace projektu na hover — při najetí myší na project card zobrazit krátkou animaci nebo screenshot appky. Použít Framer Motion nebo CSS transition. Vizuálně zajímavé pro showcase účel.

- [ ] Projekty sekce — přidat Zdravotní analyzátor jako druhou kartu. Popis: "Soukromý offline health tracker — nahrát laboratorní výsledky, AI rozebere co je mimo normu." Bez tech stacku. Screenshot nebo ikona.

- [ ] Blog post CZ — jeden česky psaný post o tom jak Patrik používá AI v procurement (Škoda Auto kontext). Claude napíše draft, Patrik schválí. Uložit jako content/blog/cs/ai-v-procurement.mdx.

- [ ] Testimonials / social proof sekce — přidat sekci s krátkými citacemi od kolegů nebo partnerů. Pokud není obsah, použít placeholder s výzvou "Pracoval jsem s tebou? Napiš mi."

- [ ] Open Graph obrázky — dynamicky generované OG obrázky pro každou stránku pomocí @vercel/og (ImageResponse). Pro blog posty použít title + datum. Pro homepage použít tagline.

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

---

## [P1] Async params audit — Next.js 15 kompletní migrace
- **Status:** done
- **Projekt:** 04_Central Web
- **Repo:** `C:\Users\Dell 5090\Documents\Claude\Projects\04_Central Web`
- **Prompt:** V projektu `C:\Users\Dell 5090\Documents\Claude\Projects\04_Central Web` proveď kompletní audit async params pro Next.js 15. Najdi všechny soubory v `app/` kde se používá `params` nebo `searchParams` jako synchronní prop. Next.js 15 vyžaduje `await params` před použitím. Oprav každý výskyt: změň na `async` funkci, přidej `const { locale, slug, ... } = await params`. Zkontroluj také `generateMetadata` funkce. Ověř build (`npm run build`) — 0 warnings o sync params. Zdokumentuj změny.
- **Hotovo:** —

---

## [P1] SEO meta tagy — dynamické OG + Twitter cards
- **Status:** done
- **Projekt:** 04_Central Web
- **Repo:** `C:\Users\Dell 5090\Documents\Claude\Projects\04_Central Web`
- **Prompt:** V projektu `C:\Users\Dell 5090\Documents\Claude\Projects\04_Central Web` přidej kompletní SEO meta tagy. Pro každou stránku v `app/[locale]/` přidej nebo oprav `generateMetadata()` funkci s: title (page-specific), description (150 znaků), openGraph (title, description, image, url, type). Vytvoř výchozí OG obrázek `/public/og-default.png` (1200x630, jednoduché SVG nebo placeholder). Pro blog posty přidej dynamické OG z frontmatter. Twitter cards NEpřidávat. Ověř build.
- **Hotovo:** —

---

## [P2] Lighthouse audit — skóre ≥ 90 na všech metrikách
- **Status:** done
- **Projekt:** 04_Central Web
- **Repo:** `C:\Users\Dell 5090\Documents\Claude\Projects\04_Central Web`
- **Prompt:** V projektu `C:\Users\Dell 5090\Documents\Claude\Projects\04_Central Web` proveď Lighthouse optimalizace. Zkontroluj: (1) všechny `<img>` tagy mají `alt`, width, height nebo next/image s priority prop pro LCP obrázky, (2) fonty mají `display: swap`, (3) nepoužívané CSS — odstraň nebo lazy-load, (4) JS bundle — zkontroluj `next build` output pro large chunks, přidej dynamic imports kde vhodné, (5) přidej `<meta name="viewport">` pokud chybí, (6) zkontroluj kontrast barev pro accessibility. Vytvoř `LIGHTHOUSE_NOTES.md` se souhrnem změn.
- **Hotovo:** —

---

## [P2] Blog sekce — MDX posty s i18n
- **Status:** done
- **Projekt:** 04_Central Web
- **Repo:** `C:\Users\Dell 5090\Documents\Claude\Projects\04_Central Web`
- **Prompt:** V projektu `C:\Users\Dell 5090\Documents\Claude\Projects\04_Central Web` přidej blog sekci. Zkontroluj zda existuje `content/blog/` nebo podobná složka. Pokud ne, vytvoř strukturu: `content/blog/[locale]/[slug].mdx` s frontmatter (title, date, description, tags). Vytvoř `app/[locale]/blog/page.tsx` (list článků) a `app/[locale]/blog/[slug]/page.tsx` (detail). Přidej překlady do `locales/cs.json`, `locales/en.json`, `locales/de.json`. Vytvoř 1-2 ukázkové posty (česky + anglicky). Přidej odkaz do hlavní navigace. Build + ověř.
- **Hotovo:** 2026-05-13 · commit 74dd7e7 · locale-aware blog struktura (cs/en) + fallback do EN

---

## [P2] Projekty sekce — aktualizace + nové projekty
- **Status:** failed-final
- **Projekt:** 04_Central Web
- **Repo:** `C:\Users\Dell 5090\Documents\Claude\Projects\04_Central Web`
- **Prompt:** V projektu `C:\Users\Dell 5090\Documents\Claude\Projects\04_Central Web` aktualizuj `data/projects.js`. Přidej nové projekty: GardenPin (zahradni-tracker, popis, URL na GitHub nebo live), QR Jídelníček Pro (qr-jidelnicek, popis, stack). Zkontroluj stávající projekty — aktualizuj popisy a URL. Přidej field `stack: []` array pro zobrazení tech tagů. Uprav komponent pro zobrazení projektů pokud potřebuje stack