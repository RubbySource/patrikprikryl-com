# Claude Design Audit + Návrh redesignu — patrikprikryl.com

> Vypracoval: Claude (autonomní design audit)
> Datum: 2026-06-06
> Status: **EXPERIMENT** — Patrik vybírá, co implementovat
> Související: [REDESIGN_STRATEGY.md](../REDESIGN_STRATEGY.md), [BACKLOG.md](../BACKLOG.md)

---

## TL;DR (30 sekund)

Web má **silnou content vrstvu** (3 jazyky, blog, case studies, newsletter, animace) a **rozhojněnou vizuální vrstvu**. Hlavní problém: **16 sekcí na homepage, 3 nezávislé palety (blue / emerald / gold)** a **nejednotná hustota informací**. Story-driven cíl (REDESIGN_STRATEGY) říká „za 10 vteřin pochopit, kdo je Patrik" — současně každý scroll přepíná čtenáře mezi paletami a hierarchiemi.

**Návrh:** Sjednotit pod **jednu accent paletu** s emocionálními micro-akcenty (gold = ocenění, emerald = newsletter — ale jako *tonal layer*, ne dominantní barva). Zkrátit homepage z 16 sekcí na **9 logických bloků** se „chapter break" patterns. Posílit typografickou hierarchii ve prospěch jednoho display fontu. Zavést „spatial system" (4/8/16/24 px rytmus) místo ad-hoc spacing.

Žádný velký rewrite. **80 % je tooling** (CSS tokeny + utility), **20 % JSX úpravy** (přesun sekcí, sloučení dvou kontaktních bloků).

---

## 1. Co současný web dělá dobře (zachovat)

| Co | Proč zachovat |
|---|---|
| **Plně lokalizováno cs/en/de přes next-intl** | Strategická výhoda, kterou málokdo má. Tohle je core asset. |
| **Hero split-text + scale-in foto** | Profesionální entrance, settle-in místo jumpy. (Hero.jsx:31–55) |
| **Tmavý charcoal `#0A0A0A` v dark modu** | Funguje s `#1A56DB` accentem, nepoužívá generický „GitHub modrý". |
| **Project cards s left-border accent + lift hover** | Lépe odlišují projekty než generické tile. (globals.css:162) |
| **Awards card system: trophy = gold, finalist = blue badge** | Sémantický kód — barva nese informaci, ne dekoraci. |
| **LazyMotion + lazy lenis** | First Load JS 171 kB je velmi dobrý baseline. Neztratit. |
| **MediaMentions auto-hide když prázdné** | Skvělý vzor — nepřetékat na produkci placeholdery. **Rozšířit** na Testimonials, Speaking, Timeline. |
| **Custom 404 + 500 s HelpfulLinks** | Polish, který málokdo dělá. |
| **Newsletter forest-green „organic" identita** | Funguje jako sub-brand pro newsletter — *ale použít konzistentněji* (viz §3.3). |

---

## 2. Top 8 problémů (seřazeno dle dopadu)

### 🔴 P1 — Homepage má 16 sekcí, žádný „chapter break"

```
Hero → StatsBar → MediaMentions → Projects → Awards → Timeline → Speaking
  → Beliefs → Skills → CoCreators → Testimonials → Contact → GetInTouch
  → CurrentlyBuilding → Newsletter → Footer
```

**Problém:** Cizí návštěvník nemá v hlavě „mentální mapu". Každá sekce je sólo nárazník. Sekce se i obsahově překrývají:
- **Contact** vs **GetInTouch** — dvě CTAs na kontakt (zbytečně duplicitní)
- **Beliefs** vs **About sekce** v Hero/Skills — filozofie je rozsekaná
- **Skills** vs **CoCreators** — obě sekce „co děláš/s kým"
- **CurrentlyBuilding** uprostřed mezi Contact a Newsletter — divně umístěné

**Návrh struktury (9 bloků se 3 „kapitolami"):**

```
═══ KAPITOLA 1: Kdo jsem ═══
  1. Hero (jméno, claim, foto, CTA)
  2. StatsBar + MediaMentions (důvěryhodnost v 1 lince)
  3. About + Timeline (sloučené — příběh + dráha)

═══ KAPITOLA 2: Co dělám ═══
  4. Projects (case studies + side projekty)
  5. Currently Building (live signál)
  6. Awards + Speaking (uznání)

═══ KAPITOLA 3: Pojď do toho ═══
  7. Testimonials (social proof těsně před CTA)
  8. Contact (jeden blok: form + LinkedIn + GitHub)
  9. Newsletter (jako P.S.)
  → Footer
```

**Chapter break** = vizuální oddělovač: horizontální stěna textu („01 / Kdo jsem") + thin rule + extra `py-32`. Vidí se to v top portfoliích (Brittany Chiang, Adham Dannaway).

---

### 🔴 P1 — Tři nezávislé barevné jazyky se navzájem ruší

| Sekce | Dominantní paleta |
|---|---|
| Hero, Projects, Awards (finalist), Footer | **Blue `#1A56DB`** |
| Hero badge „building", Newsletter, Currently Building | **Emerald `#10B981` / `#059669`** |
| Awards (trophy) | **Gold `#B8962E`** |
| Tagy, muted text | Šedá `#6B7280` |

**Problém:** Ze 16 sekcí jich 5 používá blue jako accent, 3 emerald, 1 gold, zbytek šedá. Návštěvník se učí nový vizuální jazyk **na každé sekci**.

**Návrh — sémantický color system:**

```css
/* Jeden primary accent — ne tři */
--accent: #1A56DB;          /* hero CTA, links, nav, projects */
--accent-soft: rgba(26,86,219,0.08);

/* Sémantické akcenty — jen tam, kde nesou význam */
--success: #059669;         /* newsletter, „building" badge, success states */
--gold: #B8962E;             /* JEN trophy awards */

/* Žádné další barvy bez sémantického důvodu */
```

**Pravidlo:** Pokud sekce není o oceněních nebo newsletteru, **nesmí používat gold ani emerald jako dominantní barvu**. Hero „building" badge zůstává emerald (sémantika: live signál). Newsletter zůstává „forest" tematizovaný (sémantika: organické pěstování publika). Vše ostatní → `--accent`.

---

### 🟠 P2 — Typografická hierarchie kolísá mezi 3 fonty

```
body            → Inter
h1–h6           → Sora (display)
hero <h1> name  → Plus Jakarta Sans  ← outlier
```

**Problém:** Hero jméno je největší element na stránce **a používá jiný font než zbytek nadpisů**. Působí to jako návrh udělaný ve 3 různých dnech.

**Návrh:**
- **Body: Inter** ✓
- **Display: Sora** ✓ (pro VŠE) — odstranit Plus Jakarta Sans z Hero
- Tlačítka a UI labely: Inter 600
- Code/mono (terminal, blog code): JetBrains Mono

Úspora: 1 webfont méně (cca 28 kB), font-loading FOIT také méně viditelný.

---

### 🟠 P2 — Hero CTA hierarchie je nejasná (3 tlačítka v jednom řádku)

```
[Zobrazit projekty] [🎯 Live Demo] [LinkedIn]
   filled blue        filled black     outline
```

**Problém:**
- **3 primární CTAs** → eye-tracking studie: 0 z nich pak není „primary"
- „Live Demo" má emoji 🎯 — narušuje typografický rytmus
- Filled black + filled blue se hádají

**Návrh — jeden primary, jeden secondary, jeden tertiary:**

```
[Podívej se na projekty →]   [Propojme se na LinkedIn]   Live Demo
    PRIMARY filled              SECONDARY outline           text link
```

Live Demo přesunout do Projects sekce jako součást jejich CTA — tam patří kontextově.

---

### 🟠 P2 — StatsBar a MediaMentions visí v limbo mezi Hero a Projects

Obě jsou „důvěryhodnost" sekce, ale jsou rozdělené, mají různý spacing a žádný společný „trust band" rámec.

**Návrh:** Sloučit do jednoho **„Trust Strip"** komponentu se 3 stripes:
1. KPI čísla (10+ let, 2500+ followers, ...)
2. „As seen in" media logos (současný marquee)
3. „Top 1% LinkedIn" badge / hodnocení (volitelný 3. řádek)

Vizuálně oddělené hairline rules, ale **jeden** `section` s konzistentním vertical rhythm.

---

### 🟡 P3 — `--text` / `--muted` proměnné se používají nekonzistentně

Grep ukazuje, že polovina komponent používá CSS proměnné z `globals.css` (`var(--text)`), polovina hard-coded tailwind (`text-[#111111] dark:text-[#F0F0F0]`).

**Problém:** Když Patrik bude chtít přebarvit text, musí to udělat na **dvou** místech.

**Návrh:** Migrovat **vše** na CSS proměnné. Definovat semantický scale:

```css
--text-primary:   #111;          /* hlavní text */
--text-secondary: #4B5563;       /* body, popisy */
--text-tertiary:  #6B7280;       /* eyebrows, labely, captions */
--text-inverse:   #fff;          /* na dark CTA */
```

A v Tailwindu přidat utility:
```js
// tailwind.config.js
textColor: {
  primary: 'var(--text-primary)',
  secondary: 'var(--text-secondary)',
  tertiary: 'var(--text-tertiary)',
}
```

Pak v JSX: `text-primary` místo `text-[#111111] dark:text-[#F0F0F0]`. Méně hluku, dark mode zdarma.

---

### 🟡 P3 — Spacing rhythm je ad-hoc

`mb-4`, `mb-5`, `mb-6`, `mb-8`, `mb-10` se střídají bez zjevné logiky. `section-padding` je `py-20 md:py-28`, ale Newsletter má `py-16 md:py-20` a Hero `pt-20`.

**Návrh — 4-step vertical scale:**

```css
--space-section:  6rem (96px)   /* mezi sekcemi */
--space-block:    3rem (48px)   /* mezi bloky v sekci */
--space-component: 1.5rem (24px) /* mezi komponenty */
--space-element:   0.75rem (12px) /* mezi řádky textu */
```

Tailwind utility (přidat do `tailwind.config.js` `spacing` extend):
```js
spacing: { 'section': '6rem', 'block': '3rem' }
```

Pak `mb-block` místo `mb-10` — čte se to lépe a všude stejně.

---

### 🟢 P4 — Navigation je při scrollu „glass-nav", ale nemá scroll progress indicator

Top portfolia (Stripe, Linear, Brittany Chiang) mají **1-2 px progress bar** na vrchu nav během scrollu. Drobný detail, výrazný „premium" pocit.

**Návrh:**

```jsx
// V Navigation komponentě
<div className="absolute bottom-0 left-0 h-px bg-accent origin-left scale-x-0
                transition-transform duration-150"
     style={{ transform: `scaleX(${scrollProgress})` }} />
```

(scroll progress = `window.scrollY / (document.body.scrollHeight - window.innerHeight)`)

---

## 3. HTML mockupy — 4 klíčové sekce

> Mockupy jsou self-contained HTML/Tailwind snippety. Patrik je může otevřít přímo v prohlížeči (Tailwind CDN) nebo zkopírovat třídy do existujících komponent.

### 3.1 Hero — cleaner CTA hierarchy + unified font

```html
<!-- Pure HTML mockup — Tailwind CDN -->
<section class="relative min-h-screen flex items-center bg-[#FAFAFA] dark:bg-[#0A0A0A] overflow-hidden">
  <!-- Gradient mesh background (zachováno) -->
  <div class="absolute inset-0 pointer-events-none"
       style="background:
         radial-gradient(ellipse at 20% 50%, rgba(26,86,219,0.08), transparent 50%),
         radial-gradient(ellipse at 80% 20%, rgba(26,86,219,0.06), transparent 50%);"></div>

  <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-20">
    <div class="grid lg:grid-cols-[1.1fr_1fr] gap-16 items-center">

      <!-- Text column -->
      <div>
        <!-- Eyebrow + live badge IN ONE ROW (úspora vertical space) -->
        <div class="flex items-center gap-3 mb-6">
          <span class="text-xs font-semibold tracking-widest uppercase text-[#1A56DB]">
            patrikprikryl.com
          </span>
          <span class="h-3 w-px bg-gray-300"></span>
          <span class="inline-flex items-center gap-2 text-xs font-medium text-emerald-600">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Právě stavím AI-asistované workflowy
          </span>
        </div>

        <!-- Name — Sora font (ne Plus Jakarta) -->
        <h1 class="font-display font-bold text-[clamp(3rem,8vw,7rem)] leading-[0.9]
                   tracking-[-0.03em] text-[#111111] dark:text-[#F0F0F0] mb-6">
          <span class="block">Patrik</span>
          <span class="block text-[#1A56DB]">Přikryl</span>
        </h1>

        <!-- Tagline -->
        <p class="text-lg font-medium tracking-wide text-[#6B7280] dark:text-gray-400 mb-4">
          Procurement Lead · AI Builder · Storyteller
        </p>

        <!-- Social proof badge (zachováno) -->
        <div class="inline-flex items-center gap-2 text-sm font-medium text-[#4B5563] dark:text-gray-300
                    bg-[#1A56DB]/5 border border-[#1A56DB]/15 px-3.5 py-1.5 rounded-full mb-8">
          <svg class="w-4 h-4 text-[#1A56DB]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l2.95 5.98 6.6.96-4.77 4.65 1.13 6.56L12 17.02l-5.91 3.11 1.13-6.56L2.45 8.94l6.6-.96L12 2z"/>
          </svg>
          TOP 1% LinkedIn Automotive · 2 500+ sledujících
        </div>

        <!-- Bio -->
        <p class="text-base sm:text-lg text-[#4B5563] dark:text-gray-400 leading-relaxed max-w-xl mb-10">
          Dvanáct let v nákupu na nejnáročnějších automotive projektech.
          Posledních pět let stavím AI nástroje, které dělají nudnou práci za nás.
        </p>

        <!-- CTAs — JEDEN primary, JEDEN secondary, „demo" jako tertiary text link -->
        <div class="flex flex-wrap items-center gap-4">
          <a href="#projects"
             class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A56DB] text-white
                    font-semibold text-sm hover:bg-[#1340B0] transition shadow-lg shadow-blue-500/20">
            Podívej se na projekty
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/patrikprikryl"
             class="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#111]
                    dark:border-[#F0F0F0] font-semibold text-sm hover:bg-[#111] hover:text-white transition">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/>
            </svg>
            Propojme se
          </a>
          <a href="/demo" class="text-sm font-medium text-[#6B7280] hover:text-[#1A56DB] underline-offset-4 hover:underline">
            Nebo zkus live demo →
          </a>
        </div>
      </div>

      <!-- Photo column (zachováno) -->
      <div class="flex justify-center lg:justify-end">
        <div class="relative w-full max-w-sm aspect-[4/5] rounded-2xl overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-[#1A56DB]/10 to-transparent z-10 rounded-2xl"></div>
          <img src="/patrik.jpg" alt="Patrik Přikryl" class="w-full h-full object-cover rounded-2xl"/>
          <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 dark:ring-white/5 z-20"></div>
        </div>
      </div>
    </div>
  </div>
</section>
```

**Klíčové změny vs. současný Hero:**
- Eyebrow + building badge **na jednom řádku** (úspora `mb-5`)
- Jméno používá **font-display (Sora)** — ne Plus Jakarta
- **2 tlačítka + 1 text link** místo 3 tlačítek
- Live Demo jako tertiary („Nebo zkus live demo →"), ne primary

---

### 3.2 Chapter Break — nový pattern mezi kapitolami

```html
<!-- Vkládá se mezi: Trust Strip → Projects, Awards → Testimonials, atd. -->
<div class="relative max-w-7xl mx-auto px-6 lg:px-8 py-24">
  <div class="flex items-center gap-6">
    <span class="font-display text-sm font-bold tracking-[0.3em] text-[#1A56DB]">
      02
    </span>
    <span class="flex-1 h-px bg-gradient-to-r from-[#1A56DB]/30 to-transparent"></span>
    <span class="font-display text-2xl sm:text-3xl font-bold text-[#111] dark:text-[#F0F0F0]">
      Co dělám
    </span>
  </div>
</div>
```

**Proč to funguje:** Velký bílý prostor + jedna typografická kotva = signál „nová kapitola". Lepší než další H2 nadpis stejné velikosti jako u sekcí pod ním.

---

### 3.3 Trust Strip — sloučený StatsBar + MediaMentions

```html
<section class="border-y border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-[#0E0E0E]">
  <div class="max-w-7xl mx-auto px-6 lg:px-8 divide-y divide-gray-200 dark:divide-gray-800">

    <!-- Row 1: KPIs -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
      <div>
        <div class="font-display text-3xl font-bold text-[#111] dark:text-[#F0F0F0]">12+</div>
        <div class="text-sm text-[#6B7280] mt-1">let v automotive nákupu</div>
      </div>
      <div>
        <div class="font-display text-3xl font-bold text-[#111] dark:text-[#F0F0F0]">2 500+</div>
        <div class="text-sm text-[#6B7280] mt-1">sledujících na LinkedInu</div>
      </div>
      <div>
        <div class="font-display text-3xl font-bold text-[#111] dark:text-[#F0F0F0]">8</div>
        <div class="text-sm text-[#6B7280] mt-1">side projektů od nuly</div>
      </div>
      <div>
        <div class="font-display text-3xl font-bold text-[#111] dark:text-[#F0F0F0]">3</div>
        <div class="text-sm text-[#6B7280] mt-1">jazyky (CS · EN · DE)</div>
      </div>
    </div>

    <!-- Row 2: Media mentions (současný marquee) -->
    <div class="py-8 overflow-hidden">
      <div class="flex items-center gap-3 mb-4">
        <span class="text-xs font-semibold tracking-widest uppercase text-[#6B7280]">
          Mluví o mně
        </span>
        <span class="flex-1 h-px bg-gray-200 dark:bg-gray-800"></span>
      </div>
      <div class="flex gap-12 items-center opacity-60">
        <span class="font-medium text-[#6B7280]">Forbes Česko</span>
        <span class="font-medium text-[#6B7280]">Lupa.cz</span>
        <span class="font-medium text-[#6B7280]">CzechCrunch</span>
        <span class="font-medium text-[#6B7280]">Procurement Insights</span>
      </div>
    </div>
  </div>
</section>
```

**Proč jeden section místo dvou:** Návštěvník vidí **jeden trust block**, ne dva oddělené. Vertikální rytmus konzistentní (10 + 8 = 18 jednotek `divide-y`). KPI čísla mají stejnou váhu (font-display 3xl).

---

### 3.4 Contact — sloučení Contact + GetInTouch + LinkedIn CTA

Současně existují **3 různé "kontaktuj mě" pattern** na homepage. Návrh: **jeden** Contact block s formulářem + side CTA panel.

```html
<section class="py-section relative">
  <div class="max-w-6xl mx-auto px-6 lg:px-8">

    <!-- Eyebrow + title -->
    <div class="text-center mb-block">
      <span class="text-xs font-semibold tracking-widest uppercase text-[#1A56DB] mb-3 block">
        Pojď do toho
      </span>
      <h2 class="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#111] dark:text-[#F0F0F0]">
        Něco postavíme společně?
      </h2>
    </div>

    <div class="grid lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-12 items-start">

      <!-- Form (primary) -->
      <form class="bg-white dark:bg-[#1A1A1A] rounded-3xl border border-gray-200
                   dark:border-gray-800 p-8 sm:p-10 shadow-sm">
        <div class="grid sm:grid-cols-2 gap-4 mb-4">
          <input type="text" placeholder="Tvé jméno"
                 class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#0E0E0E]
                        border border-gray-200 dark:border-gray-800 focus:border-[#1A56DB]
                        focus:ring-2 focus:ring-[#1A56DB]/20 outline-none transition"/>
          <input type="email" placeholder="E-mail"
                 class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#0E0E0E]
                        border border-gray-200 dark:border-gray-800 focus:border-[#1A56DB]
                        focus:ring-2 focus:ring-[#1A56DB]/20 outline-none transition"/>
        </div>
        <textarea placeholder="Co stavíš? Jak ti můžu pomoct?" rows="5"
                  class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#0E0E0E]
                         border border-gray-200 dark:border-gray-800 focus:border-[#1A56DB]
                         focus:ring-2 focus:ring-[#1A56DB]/20 outline-none transition mb-4"></textarea>
        <button class="w-full sm:w-auto px-6 py-3 rounded-full bg-[#1A56DB] text-white
                       font-semibold hover:bg-[#1340B0] transition">
          Odeslat zprávu
        </button>
        <p class="text-xs text-[#6B7280] mt-3">
          Odpovídám do 24 hodin · Žádný spam, žádné automatické sekvence.
        </p>
      </form>

      <!-- Side CTA — LinkedIn + GitHub jako equal-weight alternativy -->
      <div class="space-y-3">
        <a href="https://www.linkedin.com/in/patrikprikryl"
           class="flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-200
                  dark:border-gray-800 hover:border-[#1A56DB] hover:bg-[#1A56DB]/5 transition group">
          <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0077B5]/10 text-[#0077B5]">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><!-- LinkedIn icon --></svg>
          </span>
          <span class="flex-1">
            <span class="block font-semibold text-[#111] dark:text-[#F0F0F0]">LinkedIn</span>
            <span class="block text-sm text-[#6B7280]">Tady je nejvíc obsahu o procurement + AI</span>
          </span>
          <svg class="w-5 h-5 text-[#6B7280] group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </a>

        <a href="https://github.com/your-handle"
           class="flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-200
                  dark:border-gray-800 hover:border-[#1A56DB] hover:bg-[#1A56DB]/5 transition group">
          <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900/10 text-gray-900 dark:text-gray-100">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><!-- GitHub icon --></svg>
          </span>
          <span class="flex-1">
            <span class="block font-semibold text-[#111] dark:text-[#F0F0F0]">GitHub</span>
            <span class="block text-sm text-[#6B7280]">Side projekty, tenhle web, autonomous agents</span>
          </span>
          <svg class="w-5 h-5 text-[#6B7280] group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </a>

        <!-- Reply time pledge -->
        <div class="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40">
          <div class="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Odpovídám rychle
          </div>
          <p class="text-xs text-emerald-900/80 dark:text-emerald-200/80">
            Většinou do 24 hodin, vždy do 3 pracovních dnů.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
```

**Co mizí:** GetInTouch komponenta (duplicitní), separátní LinkedIn CTA v Hero. **Co přibývá:** Jeden Contact block, který říká „tady je form, tady jsou alternativy, takhle rychle odpovídám". Žádný zmatek pro návštěvníka.

---

## 4. Implementační roadmapa (rozsekané pro Patrika)

> Každá položka je samostatný BACKLOG-ready ticket. Patrik vybere, co dává smysl.

### Track A — Quick wins (< 2 hod každý)

- [ ] **A1: Sjednocení font display na Sora** — odstranit `Plus Jakarta Sans` z Hero (Hero.jsx:99). Estimovaný impact: −28 kB woff2, méně FOIT.
- [ ] **A2: Hero CTA hierarchy fix** — Live Demo přesunout do Projects sekce, ne na Hero. (Hero.jsx:140–146)
- [ ] **A3: Eyebrow + building badge na jeden řádek** — úspora `mb-5` (cca 20 px vertical), kompaktnější above-the-fold.
- [ ] **A4: Scroll progress indicator v Navigation** — 1px bar, scroll-y derived, ~20 řádků kódu.
- [ ] **A5: CSS color tokens (`--text-primary/secondary/tertiary`)** — definovat v `globals.css`, přidat do `tailwind.config.js`. Migrace komponent postupná.

### Track B — Struktura homepage (1 odpoledne)

- [ ] **B1: Sloučit Contact + GetInTouch** — odstranit GetInTouch z `app/[locale]/page.js`, přepsat Contact dle mockupu §3.4.
- [ ] **B2: Sloučit StatsBar + MediaMentions** do `TrustStrip` komponenty (§3.3). Jeden `<section>`, 2 stripes s `divide-y`.
- [ ] **B3: ChapterBreak komponenta** — vložit 3× mezi kapitoly (§3.2). Auto-numbered (01/02/03).
- [ ] **B4: Přesunout CurrentlyBuilding mezi Projects a Awards** — kontextově sedí líp (live signál hned po projektech).

### Track C — Větší design upgrade (1-2 dny)

- [ ] **C1: Migrovat všechny komponenty na CSS color tokens** (řešení P3 problému).
- [ ] **C2: Spacing scale** — `--space-section/block/component/element` + tailwind utility. Postupná migrace.
- [ ] **C3: Sloučit Beliefs + About do jednoho „Story" bloku** — místo dvou krátkých sekcí jedna delší se silnou narrative arc.
- [ ] **C4: Audit barevné palety per sekci** — vynutit pravidlo: jen `accent`, `success`, `gold` (sémanticky), žádné ad-hoc barvy.

### Track D — Experimenty (může čekat)

- [ ] **D1: Hero variant A/B test** — split-text vs. simple fade-in. Lighthouse + scroll-depth tracking.
- [ ] **D2: Dark mode jako default** (REDESIGN_STRATEGY §7) — vyžaduje nový SSR pattern, zhodnotit.
- [ ] **D3: Hero cursor glow** (à la Brittany Chiang) — drobná interakce, ale zvyšuje wow-factor.

---

## 5. Co NEDĚLAT (anti-patterns identifikované v auditu)

- ❌ **Nepřidávat další font** — máme Inter + Sora, to stačí.
- ❌ **Neměnit `--accent` z `#1A56DB`** — modrá je teď konzistentní napříč Hero/Projects/Awards. Změna by si vyžádala přepsat half codebase.
- ❌ **Nezavádět glassmorphism mimo nav** — současný čistý card style (`bg-white dark:bg-[#1A1A1A]`) lépe sedí k „serious procurement expert" pozici než trendy glass.
- ❌ **Nepřidávat parallax/scrollytelling efekty** — narušilo by Lighthouse score (171 kB First Load JS je hard-earned).
- ❌ **Nepřepisovat Awards** — sekce už byla redesignovaná, gold/blue badge sémantika funguje.
- ❌ **Nepřidávat „Hire me" sticky CTA** — wannabe-startup feel, ne profi expertise.

---

## 6. Doporučená sekvence (kdyby Patrik schválil všechno)

```
Týden 1: Track A (quick wins) — měřitelný impact, žádné riziko
Týden 2: Track B (homepage restructure) — největší UX impact
Týden 3: Track C (design upgrade) — když je týden 1+2 stabilní
Track D: backlog, ne sprint
```

**Minimum-impact MVP** (kdyby čas dotekl):
1. A1 (font cleanup)
2. A2 + A3 (Hero CTA + spacing fix)
3. B1 (sloučit Contact)
4. B3 (ChapterBreak — vizuální oddělovače)

Tyhle 4 položky dají **80 % vizuálního upgradu za 20 % práce**.

---

## 7. Otevřené otázky pro Patrika

1. **Souhlasíš s redukcí na 9 sekcí?** Pokud ano, které z (Beliefs / Skills / CoCreators) je největší kandidát na sloučení? Já bych Skills sloučil do About, CoCreators do Currently Building.
2. **Live Demo — schovat nebo nechat na Hero?** Argumentuju za schovat, ale ty znáš metriky kliků.
3. **Chapter break style** — preferuješ velký „02" / numeric jako mockup §3.2, nebo by sis představoval slovní („Chapter Two")?
4. **Dark mode default** — chceš pustit jako experiment, nebo držet system-preference?
5. **Newsletter forest-green** — pravidlo „jen newsletter má emerald" stačí, nebo bys preferoval i Newsletter sladit s `--accent` blue?

---

## 8. Co se zachová z REDESIGN_STRATEGY.md

Tento dokument **rozšiřuje** REDESIGN_STRATEGY, nenahrazuje. Konkrétně:

| REDESIGN_STRATEGY říká | Tento audit | Status |
|---|---|---|
| Hero split-text reveal | ✓ implementováno | Zachovat |
| Foto fade-in s scale 1.05→1.0 | ✓ implementováno | Zachovat |
| Inter body + Syne/Sora display | ✓ částečně (Sora) | **Sjednotit pouze Sora** |
| Dark charcoal `#0d1117` | ✓ použito `#0A0A0A` | Zachovat |
| Accent jemná amber nebo teal | ✗ použito `#1A56DB` modrá | **Drž blue — je etablovaná** |
| Cards: subtle border | ✓ implementováno | Zachovat |
| Scroll reveal fade-up | ✓ implementováno (ScrollReveal) | Zachovat |
| Hero card lift hover | ✓ implementováno | Zachovat |
| Page transitions: subtle fade | ✗ neimplementováno | Track D experiment |

---

## Závěr

Web má **silný engineering základ** (i18n, perf, SEO, accessibility) a **dobrý hrubý vizuální směr**. Hlavní deltový upgrade je **konsolidace** — méně sekcí, méně palety, jednotná typografie, jednotný spacing rytmus. Žádný „flashy redesign" — to by zničilo důvěryhodnost, kterou Patrik buduje.

**Patrik, vyber Track A + 2-3 B položky a uvidíš transformaci za týden.** Nebo řekni „status quo je dobrý" a já to chápu — REDESIGN_STRATEGY není špatně, tahle iterace je jen jemnější.
