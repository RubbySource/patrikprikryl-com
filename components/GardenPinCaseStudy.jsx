'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const TECH_STACK = [
  {
    name: 'Next.js 14',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z" />
      </svg>
    ),
  },
  {
    name: 'Canvas API',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 3v18" />
      </svg>
    ),
  },
  {
    name: 'SQLite',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-7 h-7">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
        <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" />
      </svg>
    ),
  },
  {
    name: 'Tailwind',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35C13.39 10.85 14.55 12 17 12c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C15.61 7.15 14.45 6 12 6Zm-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35C8.39 16.85 9.55 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C10.61 13.15 9.45 12 7 12Z" />
      </svg>
    ),
  },
  {
    name: 'Web Notifications',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.7 21a2 2 0 0 1-3.4 0" />
      </svg>
    ),
  },
  {
    name: 'localStorage',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M7 8h10M7 12h10M7 16h6" />
      </svg>
    ),
  },
];

const FEATURES = [
  {
    title: 'Companion-planting graph',
    body:
      '84-plant catalogue with companion / antagonist edges encoded as a 612-row sparse adjacency table. Drag-and-drop scoring picks tiles where neighbours boost growth and avoid known antagonists.',
    icon: '🌱',
  },
  {
    title: 'Hand-rolled canvas grid',
    body:
      '~140 lines of vanilla canvas: pan via pointer events, pinch-zoom around the cursor, plants render as coloured circles + emoji. No charting library, no map tiles, no SVG.',
    icon: '🎨',
  },
  {
    title: 'Offline-first by default',
    body:
      'All user data lives in localStorage. A 32-character device ID lets you opt in to single-endpoint sync. No accounts, no passwords, no third-party trackers.',
    icon: '📡',
  },
  {
    title: 'Reminders without a backend job',
    body:
      'Sowing/watering/harvest events derived from plant data on the client. Browser Notification API fires within a 24-hour window. Anything past that is recomputed at next app open.',
    icon: '⏰',
  },
];

const TIMELINE = [
  {
    when: 'Friday 19:00',
    what: 'Started with React Native + Mapbox. Three hours later: simulator certs unresolved, Mapbox demanding a credit card. Scrap.',
  },
  {
    when: 'Friday 22:30',
    what: 'Reset. Plain Next.js 14 + canvas. Drew the first bed grid in 40 minutes.',
  },
  {
    when: 'Saturday morning',
    what: 'Curated the 84-plant catalogue and the companion / antagonist relations. Detour through r/permaculture for weighting.',
  },
  {
    when: 'Saturday afternoon',
    what: 'Drag-and-drop pin placement, neighbour scoring, score visualisation on hover.',
  },
  {
    when: 'Saturday evening',
    what: 'Reminder generation from sowing dates. Web Notifications API wired up. First end-to-end run.',
  },
  {
    when: 'Sunday',
    what: 'Polish: dark mode, keyboard navigation, exporting beds as PNG, deploy to Vercel. Ship.',
  },
];

const METRICS = [
  { label: 'Hours from start to deploy', value: '48' },
  { label: 'Plants in catalogue', value: '84' },
  { label: 'Companion / antagonist edges', value: '612' },
  { label: 'Lines of canvas code', value: '~140' },
  { label: 'External map / charting libs', value: '0' },
  { label: 'Days I’ve opened the app since', value: 'every one' },
];

const LESSONS = [
  {
    title: 'Friction is the enemy of weekend builds',
    body:
      'The right stack is the one you can reach without burning a half-day on certs, billing accounts, or framework debates. I dropped React Native the second it cost me three hours.',
  },
  {
    title: 'Canvas beats charting libraries when the geometry is yours',
    body:
      "I almost installed Konva. The whole map ended up in 140 lines of vanilla canvas, and I understand every pixel. Reach for a library when you'd be re-implementing it badly — not before.",
  },
  {
    title: 'Curate data before you build the visualisation',
    body:
      "I started with the canvas and discovered halfway through Saturday that my plant data was incomplete. A weekend build doesn't have time for two passes — get the data right first, then make it pretty.",
  },
  {
    title: 'Skip backend cron jobs when client-side derivations work',
    body:
      'Reminders are deterministic functions of your plant data. I generate them in the browser and use the Notification API — no worker, no queue, no infrastructure. Hobby apps reward this kind of simplification.',
  },
];

function FadeIn({ children, delay = 0 }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function GardenPinCaseStudy() {
  return (
    <div className="space-y-20">
      {/* Header */}
      <FadeIn>
        <header>
          <span className="text-xs font-semibold tracking-widest uppercase text-[#1A56DB] mb-4 block">
            Case Study · Side Project
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-[var(--text)] leading-[1.1] mb-6">
            GardenPin
          </h1>
          <p className="text-xl text-[var(--muted)] max-w-3xl leading-relaxed">
            A weekend build — from a Moleskine sketch to a working garden-planning app with
            companion-planting recommendations, offline mode, and a hand-rolled canvas grid.
          </p>
        </header>
      </FadeIn>

      {/* Problem */}
      <FadeIn>
        <section>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#1A56DB] mb-4">
            Problem
          </h2>
          <p className="text-lg text-[var(--text)]/85 leading-relaxed max-w-3xl">
            Every spring I sketch a layout for my three raised beds in a notebook, lose it by July,
            and rebuild from memory the following year. Companion-planting matters — basil and
            tomatoes thrive together, basil and rue do not — but the rules live in a dozen
            scattered articles. There was no single tool that let me draw a bed, place plants, and
            see which neighbours would help or hurt.
          </p>
        </section>
      </FadeIn>

      {/* Solution */}
      <FadeIn>
        <section>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#1A56DB] mb-4">
            Solution
          </h2>
          <p className="text-lg text-[var(--text)]/85 leading-relaxed max-w-3xl mb-6">
            A phone-friendly, offline-first web app where each raised bed is a top-down grid. Plants
            are dragged onto tiles; a companion-planting graph scores their neighbours in
            real-time. Sowing dates trigger watering and harvest reminders via the browser&apos;s
            Notification API. No accounts, no servers, no tracking — just a 32-character device ID
            in a cookie and an opt-in sync endpoint.
          </p>
        </section>
      </FadeIn>

      {/* Tech Stack */}
      <FadeIn>
        <section>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#1A56DB] mb-6">
            Tech Stack
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {TECH_STACK.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--card)]"
              >
                <span className="text-[#1A56DB]">{t.icon}</span>
                <span className="font-medium text-[var(--text)]">{t.name}</span>
              </motion.div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* Key Features */}
      <FadeIn>
        <section>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#1A56DB] mb-6">
            Key Features
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[#1A56DB]/40 transition-colors"
              >
                <div className="text-3xl mb-3" aria-hidden>
                  {f.icon}
                </div>
                <h3 className="font-display font-semibold text-lg text-[var(--text)] mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* Timeline */}
      <FadeIn>
        <section>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#1A56DB] mb-6">
            Timeline — 48 hours, in order
          </h2>
          <ol className="relative border-l-2 border-[#1A56DB]/30 pl-6 space-y-6">
            {TIMELINE.map((t, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="relative"
              >
                <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[#1A56DB] ring-4 ring-[var(--bg)]" />
                <div className="text-xs font-mono uppercase tracking-widest text-[#1A56DB] mb-1">
                  {t.when}
                </div>
                <p className="text-base text-[var(--text)]/85 leading-relaxed">{t.what}</p>
              </motion.li>
            ))}
          </ol>
        </section>
      </FadeIn>

      {/* Metrics */}
      <FadeIn>
        <section>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#1A56DB] mb-6">
            Metrics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {METRICS.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)]"
              >
                <div className="font-display font-bold text-3xl sm:text-4xl text-[#1A56DB] mb-1">
                  {m.value}
                </div>
                <div className="text-xs uppercase tracking-wider text-[var(--muted)] font-medium">
                  {m.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* Screenshots placeholder */}
      <FadeIn>
        <section>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#1A56DB] mb-6">
            Screenshots
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: 'Bed editor — drag plants onto the grid' },
              { label: 'Companion-planting score on hover' },
              { label: 'Reminders feed — tomorrow’s tasks' },
              { label: 'Dark mode, late-night planning' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="aspect-[16/10] rounded-2xl border border-dashed border-[var(--border)] bg-gradient-to-br from-[#0D4A2A]/10 via-[#1A56DB]/5 to-transparent flex flex-col items-center justify-center text-center p-6"
              >
                <div className="text-4xl mb-3" aria-hidden>
                  📸
                </div>
                <p className="text-sm font-medium text-[var(--muted)]">{s.label}</p>
                <p className="text-xs text-[var(--muted)]/70 mt-1">
                  Screenshot coming with v1.1 release
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* Lessons */}
      <FadeIn>
        <section>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#1A56DB] mb-6">
            What I learned
          </h2>
          <div className="space-y-5">
            {LESSONS.map((l, i) => (
              <motion.div
                key={l.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="p-6 rounded-2xl border-l-4 border-[#1A56DB] bg-[var(--card)]"
              >
                <h3 className="font-display font-semibold text-lg text-[var(--text)] mb-2">
                  {l.title}
                </h3>
                <p className="text-base text-[var(--muted)] leading-relaxed">{l.body}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* CTA */}
      <FadeIn>
        <section className="text-center py-10 border-t border-[var(--border)]">
          <p className="text-base text-[var(--muted)] mb-4">
            Want the full build journal?
          </p>
          <a
            href="/blog/building-gardenpin"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A56DB] text-white font-semibold text-sm hover:bg-[#1340B0] active:scale-95 transition-all duration-200 shadow-lg shadow-blue-500/20"
          >
            Read the technical write-up
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </section>
      </FadeIn>
    </div>
  );
}
