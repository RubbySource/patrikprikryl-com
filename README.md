# patrikprikryl.com

Personal website of Patrik Přikryl – AI Project Manager at Škoda Auto.

Built with **Next.js 14**, **Tailwind CSS**, **Framer Motion**, and **next-intl**.

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How to Update Content

All editable content lives in `/data/` – edit these files, never the components.

### Add or edit a project → `/data/projects.js`

```js
{
  title: "Project Name",
  description: "Short description of the project.",
  tag: "Category · Type",
  url: "https://link-or-null",   // null = shows "Internal Project" label
  featured: false,               // true = large highlighted card
}
```

### Edit stats → `/data/stats.js`

```js
{ value: "11+", label: "Years at Škoda Auto" }
```

The values animate on scroll. Use strings like `"11+"`, `"2×"`, `"TOP 1%"`.

### Edit "What I Believe" → `/data/beliefs.js`

```js
{ number: "01", text: "Your bold statement here." }
```

### Edit co-creators → `/data/cocreators.js`

Two arrays: `collaborators` and `universityCollaborators`. Each entry:

```js
{
  initials: "AB",
  name: "Full Name",
  description: "Short bio / relationship.",
  linkedin: "https://www.linkedin.com/in/username",
}
```

### Edit awards → `/data/awards.js`

### Replace the profile photo → `/public/patrik.jpg`

Just overwrite the file. Recommended: portrait orientation, minimum 800×1000px, JPG or WebP.

---

## Add or Edit Translations

Three locale files in `/locales/`:

- `en.json` – English (default)
- `cs.json` – Czech
- `de.json` – German

Edit the JSON files to change any text on the site. Structure must match across all files.

To add a new language:
1. Create `/locales/xx.json` (copy from `en.json`)
2. Add `'xx'` to the `locales` array in `middleware.js` and `app/[locale]/layout.js`
3. Add the language button in `components/Navigation.jsx`

---

## Google Analytics 4

1. Go to [analytics.google.com](https://analytics.google.com) → Create Property → Web Stream
2. Copy the Measurement ID (format: `G-XXXXXXXXXX`)
3. Create a `.env.local` file based on `.env.local.example`:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
4. In Netlify dashboard: Site Settings → Environment Variables → add `NEXT_PUBLIC_GA_ID`

Analytics only loads after the user accepts cookies.

---

## Netlify Forms (Contact)

The contact form uses [Netlify Forms](https://docs.netlify.com/forms/setup/) – no backend needed.

To receive email notifications:
1. Deploy the site to Netlify
2. Go to Netlify Dashboard → Your Site → Forms
3. Click on the `contact` form
4. Go to **Form notifications** → Add notification → **Email notification**
5. Enter your email address

Your email address is **never** visible in the code or on the website.

---

## Deploy to Netlify

### Option 1: GitHub + Netlify (recommended)

1. Push code to a GitHub repository
2. Go to [netlify.com](https://www.netlify.com) → Add new site → Import from Git
3. Select your repository
4. Build settings are auto-detected from `netlify.toml`
5. Click **Deploy**

### Option 2: Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

---

## Connect Domain patrikprikryl.com

### DNS via Netlify Nameservers (recommended)

1. In Netlify: Site Settings → Domain management → Add custom domain → `patrikprikryl.com`
2. Netlify shows you 4 nameservers, e.g.:
   ```
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net
   ```
3. Log in to your domain registrar (where you bought patrikprikryl.com)
4. Replace the existing nameservers with Netlify's nameservers
5. Wait 24–48 hours for DNS propagation
6. Netlify automatically provisions an SSL certificate (HTTPS)

### DNS via CNAME (alternative)

If you want to keep your current DNS provider:
1. In Netlify: Site Settings → Domain management → Add custom domain
2. Choose "Use DNS provider" option
3. Add a CNAME record: `www` → `your-site-name.netlify.app`
4. For apex domain, add an A record pointing to Netlify's load balancer IP

---

## Local Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Then edit .env.local with your values

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm start
```

---

## Project Structure

```
├── app/
│   ├── [locale]/
│   │   ├── layout.js      # Per-locale layout (ThemeProvider, i18n)
│   │   └── page.js        # Main page (all sections)
│   ├── globals.css        # Global styles, CSS variables
│   └── layout.js          # Root layout (metadata)
├── components/
│   ├── Navigation.jsx     # Sticky nav, language switcher, dark mode
│   ├── Hero.jsx           # Hero section with photo
│   ├── StatsBar.jsx       # Animated stats
│   ├── About.jsx          # About section with tags
│   ├── Projects.jsx       # Project cards grid
│   ├── Awards.jsx         # Awards cards
│   ├── Beliefs.jsx        # "What I Believe" section
│   ├── CoCreators.jsx     # Co-creators grid
│   ├── Contact.jsx        # Contact form (Netlify Forms)
│   ├── Footer.jsx         # Footer
│   ├── CookieBanner.jsx   # Cookie consent banner
│   ├── BackToTop.jsx      # Back to top button
│   └── GoogleAnalytics.jsx # GA4 (loads after consent)
├── data/                  # ← EDIT THESE FILES to update content
│   ├── projects.js
│   ├── stats.js
│   ├── beliefs.js
│   ├── cocreators.js
│   └── awards.js
├── locales/               # ← EDIT for translations
│   ├── en.json
│   ├── cs.json
│   └── de.json
├── i18n/
│   └── request.js         # next-intl config
├── public/
│   └── patrik.jpg         # ← REPLACE with your photo
├── middleware.js           # i18n routing
├── next.config.js
├── tailwind.config.js
└── netlify.toml
```
