# Newsletter — setup & end-to-end test

> Návod pro dokončení newsletteru. Frontend (`components/Newsletter.jsx`) i backend
> (`app/api/newsletter/route.js`) jsou hotové. Zbývá **manuální konfigurace v Resend
> dashboardu + Vercelu**, kterou kód sám udělat nemůže. Po dokončení kroků níže je
> newsletter plně funkční.
>
> Poslední aktualizace: 2026-05-25

---

## 1. Jak to funguje (architektura)

Signup flow (`POST /api/newsletter`, tělo `{ email }`):

1. **Validace** e-mailu (regex). Nevalidní → `400`.
2. **Resend Audience** — pokud je nastaven `RESEND_AUDIENCE_ID`, přidá kontakt přes
   `resend.contacts.create()`. Duplicitní kontakt (`already exists`) se tiše ignoruje.
3. **`data/subscribers.json`** — lokální fallback seznam (dedupe podle e-mailu).
4. **Welcome e-mail** subscriberovi z `RESEND_FROM_EMAIL`
   (`newsletter@patrikprikryl.com`).
5. **Admin notifikace** na `NEWSLETTER_ADMIN_EMAIL` (default `pt.rubby@gmail.com`)
   s tabulkou všech subscriberů. Odesílatel: `onboarding@resend.dev`.
6. Vrátí `{ ok: true, welcomeEmailSent }`.

> **Důležité:** Kód je odolný — pokud `RESEND_API_KEY` chybí, subscriber se uloží jen
> lokálně a e-maily se přeskočí (jen warning v logu). Signup z pohledu uživatele
> **vždy uspěje** (`ok: true`), i když welcome e-mail selže. To je záměr (UX), ale
> znamená to, že **selhání e-mailů nepoznáš z UI — jen z logů**. Proto je e2e test níže nutný.

---

## 2. Env proměnné

| Proměnná | Povinná? | Kde nastavit | Účel |
|---|---|---|---|
| `RESEND_API_KEY` | **ano** | `.env.local` + Vercel | Bez ní se neodesílají žádné e-maily |
| `RESEND_AUDIENCE_ID` | **ano pro produkci** | `.env.local` + Vercel | Trvalé úložiště subscriberů (viz ⚠️ níže) |
| `RESEND_FROM_EMAIL` | volitelná | `.env.local` + Vercel | Default `Patrik Přikryl <newsletter@patrikprikryl.com>` — vyžaduje ověřenou doménu |
| `NEWSLETTER_ADMIN_EMAIL` | volitelná | `.env.local` + Vercel | Kam chodí notifikace o novém subscriberovi (default `pt.rubby@gmail.com`) |

Šablona: `.env.local.example`.

---

## 3. Kroky setupu (manuální — dělá Patrik)

### Krok 1 — API key
- [ ] V <https://resend.com/api-keys> vytvoř API key (scope: *Sending access* stačí pro e-maily; pro Audience potřebuje *Full access*).
- [ ] Vlož do `.env.local` jako `RESEND_API_KEY=re_...` (už by mělo být nastaveno).

### Krok 2 — Ověření domény (KRITICKÉ pro welcome e-maily)
Welcome e-mail se posílá z `newsletter@patrikprikryl.com`. Bez ověřené domény Resend
odesílání **odmítne** a subscriber welcome e-mail nedostane.

- [ ] V <https://resend.com/domains> přidej doménu `patrikprikryl.com`.
- [ ] Přidej zobrazené DNS záznamy (SPF, DKIM, příp. DMARC) k DNS poskytovateli domény.
- [ ] Počkej na ověření (zelený *Verified* status, propagace DNS bývá min. — hodiny).

### Krok 3 — Audience
- [ ] V <https://resend.com/audiences> vytvoř Audience (např. „patrikprikryl.com newsletter").
- [ ] Zkopíruj její ID a vlož do `.env.local` jako `RESEND_AUDIENCE_ID=...`.

### Krok 4 — Vercel env vars
- [ ] Ve Vercel projektu → Settings → Environment Variables přidej (pro **Production** i **Preview**):
      `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, `RESEND_FROM_EMAIL`, `NEWSLETTER_ADMIN_EMAIL`.
- [ ] Redeploy (Vercel nepoužije nové env vars bez nového deploye).

---

## ⚠️ Produkce: `subscribers.json` NEPERSISTUJE na Vercelu

Vercel serverless filesystém je **read-only**. `writeSubscribers()` na produkci
vyhodí chybu (zachycenou, jen log) — `data/subscribers.json` se **na produkci nikdy
nezapíše**. Proto je na produkci **`RESEND_AUDIENCE_ID` zdroj pravdy** o subscriberech;
lokální JSON je jen dev fallback. → Krok 3 není volitelný pro produkci.

> **PII pozn.:** Lokálně (`npm run dev`) se reálné e-maily DO `data/subscribers.json`
> zapisují. Necommituj soubor s reálnými adresami do gitu (v repu má zůstat `[]`).

---

## 4. End-to-end test — lokálně

> Node není ve Windows PATH — buildy/dev přes WSL: `wsl -e bash -lc "npm run dev"`.

- [ ] `wsl -e bash -lc "npm run dev"`, otevři <http://localhost:3000>.
- [ ] Scrollni na sekci newsletter (`#newsletter`), zadej testovací e-mail (svůj), odešli.
- [ ] UI ukáže ✅ success stav.
- [ ] **Welcome e-mail** dorazil na zadanou adresu (subject „Welcome — first article coming soon 🌱").
- [ ] **Admin notifikace** dorazila na `pt.rubby@gmail.com` (subject „Nový subscriber: …") s tabulkou.
- [ ] `data/subscribers.json` obsahuje nový záznam `{ email, name, subscribedAt }`.
- [ ] V Resend → Audiences je kontakt přidán.
- [ ] Zkontroluj terminál — žádné `[newsletter] … failed` logy.

## 5. End-to-end test — produkce (patrikprikryl.com)

- [ ] Po deployi otevři <https://patrikprikryl.com>, odešli signup s reálnou adresou.
- [ ] Welcome + admin e-mail dorazily (z **ověřené** domény, ne ze sandboxu).
- [ ] Kontakt je v Resend Audience (na prod je to jediné úložiště — JSON nepersistuje).
- [ ] Ve Vercel → Logs ověř funkci `/api/newsletter` bez chyb.

---

## 6. Troubleshooting

| Příznak | Příčina | Řešení |
|---|---|---|
| Signup OK, ale welcome e-mail nedorazí | Doména neověřená / `RESEND_FROM_EMAIL` z neověřené domény | Dokonči Krok 2; do ověření lze dočasně použít `RESEND_FROM_EMAIL=onboarding@resend.dev` |
| Admin notifikace nedorazí | `onboarding@resend.dev` v test módu doručuje jen na e-mail majitele Resend účtu | Ověř doménu a změň odesílatele admin notifu, nebo používej účet vlastněný `pt.rubby@gmail.com` |
| Kontakt není v Audience | `RESEND_AUDIENCE_ID` chybí, nebo API key nemá *Full access* | Doplň ID (Krok 3) + použij Full-access key |
| Na produkci se „ztrácejí" subscribeři | Read-only FS — JSON nepersistuje | Spoléhej na Audience (Krok 3); JSON je jen dev |
| `RESEND_API_KEY is not set` warning | Env var chybí v daném prostředí | Doplň do `.env.local` (dev) i Vercelu (prod) + redeploy |

---

## 7. Auto-digest při novém blog postu

Když do `content/blog/{cs,en,de}/` přibude nový `.mdx` článek a změna se dostane na
`main`, GitHub Action spustí
[`scripts/send-blog-digest.js`](../scripts/send-blog-digest.js), který subscriberům pošle
digest přes **Resend Broadcasts** (subject `🌱 Nový článek: …` / `New post:` / `Neuer Beitrag:`).
Broadcasts řeší unsubscribe link automaticky. Měsíční „insight" mail (viz
`NEWSLETTER_STRATEGY.md` §3) zůstává ruční — tohle je jen lehká notifikace o článku.

**Bezpečnostní pojistka:** script neodešle nic, dokud není repo variable
`BLOG_DIGEST_ENABLED=on`. Workflow se tak může bez obav mergnout — do zapnutí je každý
běh no-op (jen log).

### Per-locale doručení

- **Preferováno:** vytvoř 3 Audience (CS/EN/DE) a do GitHub Secrets dej
  `RESEND_AUDIENCE_ID_CS/_EN/_DE`. CS článek pak dostanou jen CS subscribeři atd.
- **Fallback (1 Audience):** nastav jen `RESEND_AUDIENCE_ID`. Script pak pošle **jeden**
  digest na článek v primárním jazyce (`BLOG_DIGEST_PRIMARY_LOCALE`, default `en`), aby
  smíšený seznam nedostal stejný článek vícekrát. (Root-level `content/blog/*.mdx` se
  ignorují — kanonická je verze v `en/`.)

### Setup (Patrik, v GitHubu — ne ve Vercelu)

**Krok 0 — zkopíruj workflow** (autonomní runner ho commitnout nemůže — jeho GitHub token
nemá `workflow` scope, proto je uložený jako šablona v `docs/`):

```bash
mkdir -p .github/workflows
cp docs/blog-digest.workflow.yml .github/workflows/blog-digest.yml
git add .github/workflows/blog-digest.yml && git commit -m "ci: add blog-digest workflow" && git push
```

Repo → **Settings → Secrets and variables → Actions**:

- [ ] **Secrets:** `RESEND_API_KEY` (Full access), a buď `RESEND_AUDIENCE_ID`, nebo
      `RESEND_AUDIENCE_ID_CS/_EN/_DE`. Volitelně `RESEND_FROM_EMAIL`, `RESEND_REPLY_TO`.
- [ ] **Variables:** `BLOG_DIGEST_ENABLED=on` (až po ověření domény!), volitelně
      `NEXT_PUBLIC_SITE_URL`, `BLOG_DIGEST_PRIMARY_LOCALE`.

### Test bez rozeslání

Actions → **Blog digest** → *Run workflow* → vyplň `files`
(`content/blog/en/<slug>.mdx`), nech `dry_run` zaškrtnuté. Log ukáže subject + velikost
e-mailu, ale nic neodešle. Lokálně: `BLOG_DIGEST_DRY_RUN=1 RESEND_AUDIENCE_ID=x node
scripts/send-blog-digest.js content/blog/en/<slug>.mdx`.

---

## Stav

- ✅ Frontend + backend hotové, kód odolný vůči chybějícím env vars.
- ✅ `.env.local.example` obsahuje všechny 4 proměnné.
- ⏳ **Čeká na Patrika:** Krok 2 (ověření domény), Krok 3 (Audience + ID), Krok 4 (Vercel env),
  pak e2e test (kroky 4–5). Bez ověřené domény + Audience newsletter na produkci
  neodešle e-maily ani trvale neuloží subscribery.
