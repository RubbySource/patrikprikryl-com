'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/* ─── Scroll reveal ──────────────────────────────────────────── */
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return [ref, v];
}

/* ─── Floating particles background ─────────────────────────── */
function Particles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: (i * 37 + 11) % 100,
    y: (i * 23 + 7) % 100,
    size: 1.5 + (i % 4) * 1,
    delay: (i * 0.4) % 6,
    dur: 8 + (i % 5) * 2,
  }));
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size, borderRadius: '50%',
          background: 'rgba(96,165,250,0.35)',
          animation: `float ${p.dur}s ease-in-out ${p.delay}s infinite alternate`,
        }} />
      ))}
      <style>{`
        @keyframes float {
          from { transform: translateY(0px) scale(1); opacity: 0.2; }
          to   { transform: translateY(-30px) scale(1.4); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

/* ─── Big statement ──────────────────────────────────────────── */
function Statement({ children, sub, delay = 0 }) {
  const [ref, v] = useReveal();
  return (
    <div ref={ref} style={{
      padding: '6rem 1.5rem', maxWidth: '900px', margin: '0 auto',
      opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(40px)',
      transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
    }}>
      <p style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#F9FAFB', marginBottom: sub ? '1.25rem' : 0 }}>
        {children}
      </p>
      {sub && <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#6B7280', lineHeight: 1.7, maxWidth: '600px' }}>{sub}</p>}
    </div>
  );
}

/* ─── Chapter ────────────────────────────────────────────────── */
function Chapter({ num, emoji, title, accent, children }) {
  const [ref, v] = useReveal();
  return (
    <section ref={ref} style={{
      padding: '5rem 1.5rem', maxWidth: '800px', margin: '0 auto',
      opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(32px)',
      transition: 'opacity 0.7s ease, transform 0.7s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        {num && <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#374151', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '99px' }}>CH {num}</span>}
        <span style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)' }}>{emoji}</span>
      </div>
      <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', color: accent ? '#60A5FA' : '#F9FAFB', marginBottom: '1.75rem' }}>{title}</h2>
      <div style={{ fontSize: 'clamp(1.05rem, 2vw, 1.2rem)', lineHeight: 1.8, color: '#9CA3AF' }}>{children}</div>
    </section>
  );
}

/* ─── Stat cards ─────────────────────────────────────────────── */
function Stats({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', margin: '2.5rem 0' }}>
      {items.map(({ v, l }) => (
        <div key={l} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '1.5rem 1rem', textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 900, letterSpacing: '-0.04em', color: '#F9FAFB' }}>{v}</div>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#4B5563', marginTop: '0.4rem' }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── Project card ───────────────────────────────────────────── */
function Project({ emoji, name, nameEn, desc, status }) {
  return (
    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.5rem', marginBottom: '1rem' }}>
      <div style={{ fontSize: '2rem', lineHeight: 1, flexShrink: 0, marginTop: '0.1rem' }}>{emoji}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#F9FAFB' }}>{name}</span>
          {nameEn && <span style={{ fontSize: '0.8rem', color: '#4B5563' }}>· {nameEn}</span>}
          <span style={{
            fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '0.2rem 0.65rem', borderRadius: '99px',
            background: status === 'live' ? 'rgba(52,211,153,0.12)' : 'rgba(96,165,250,0.12)',
            color: status === 'live' ? '#34D399' : '#60A5FA',
            border: `1px solid ${status === 'live' ? 'rgba(52,211,153,0.25)' : 'rgba(96,165,250,0.25)'}`,
          }}>{status === 'live' ? '● live' : '● building'}</span>
        </div>
        <p style={{ fontSize: '0.95rem', color: '#6B7280', lineHeight: 1.65, margin: 0 }}>{desc}</p>
      </div>
    </div>
  );
}

/* ─── Divider ────────────────────────────────────────────────── */
const Div = () => (
  <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem' }}>
    <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />
  </div>
);

/* ─── Closing ────────────────────────────────────────────────── */
function Closing() {
  const [ref, v] = useReveal();
  return (
    <section ref={ref} style={{ padding: '6rem 1.5rem 10rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center', opacity: v ? 1 : 0, transform: v ? 'none' : 'translateY(32px)', transition: 'all 0.8s ease' }}>
      <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem', animation: 'wave 2s ease-in-out infinite' }}>👋</div>
      <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#F9FAFB', lineHeight: 1.1, marginBottom: '1.5rem' }}>
        Thanks for watching<br />me scroll through<br />my life choices
      </h2>
      <p style={{ fontSize: '1.15rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '3rem', maxWidth: '480px', margin: '0 auto 3rem' }}>
        Agents, dispatch setups, autonomous workflows, or why banning kids from Minecraft is a terrible idea. Find me after the talk.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#1A56DB', color: '#fff', padding: '0.9rem 1.75rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none' }}>patrikprikryl.com →</Link>
        <a href="https://github.com/RubbySource" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.06)', color: '#9CA3AF', padding: '0.9rem 1.75rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>GitHub</a>
      </div>
      <p style={{ fontSize: '0.72rem', color: '#1F2937' }}>Built by Claude Dispatch · patrikprikryl.com/demo · Agents in Action Night Prague #3</p>
      <style>{`@keyframes wave { 0%,100%{transform:rotate(-5deg)}50%{transform:rotate(15deg)} }`}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function DemoPage() {
  const [ref, v] = useReveal(0.01);

  return (
    <div style={{ background: '#07090F', minHeight: '100vh', fontFamily: "var(--font-inter),'Inter',-apple-system,sans-serif", color: '#F9FAFB', overflowX: 'hidden' }}>

      {/* Ambient glow */}
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 100% 50% at 50% -5%, rgba(26,86,219,0.22) 0%, transparent 55%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '40%', background: 'radial-gradient(ellipse 60% 100% at 50% 100%, rgba(96,165,250,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <Particles />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ═══ HERO ═══════════════════════════════════════════════ */}
        <section ref={ref} style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '6rem 1.5rem 4rem', position: 'relative', opacity: v ? 1 : 0, transition: 'opacity 1.2s ease' }}>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(26,86,219,0.15)', border: '1px solid rgba(26,86,219,0.3)', borderRadius: '99px', padding: '0.5rem 1.25rem', marginBottom: '2.5rem', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7BA7F7', animation: 'pulse-badge 3s ease-in-out infinite' }}>
            <span>🎯</span> Agents in Action Night Prague #3 · May 20, 2026
          </div>

          <h1 style={{ fontSize: 'clamp(3.2rem, 12vw, 8rem)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.04em', marginBottom: '2rem', background: 'linear-gradient(135deg, #fff 0%, #93B4F7 50%, #60A5FA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Building<br />with AI<br /><span style={{ fontSize: '0.7em', opacity: 0.7 }}>from my phone</span>
          </h1>

          <p style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', color: '#4B5563', maxWidth: '480px', lineHeight: 1.6, marginBottom: '3rem' }}>
            AI Project Manager · Škoda Auto Procurement · VW Group
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #1A56DB, #60A5FA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>P</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#E5E7EB' }}>Patrik Přikryl</div>
              <div style={{ fontSize: '0.8rem', color: '#4B5563', lineHeight: 1.4 }}>AI Procurement Strategy · Volkswagen Group</div>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', animation: 'bounce-arrow 2s ease-in-out infinite' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
          </div>
        </section>

        <Div />

        {/* ═══ CH1: THE PROBLEM ════════════════════════════════════ */}
        <Statement
          sub="Suppliers, negotiations, VW Group procurement strategy. And three kids. Fourth on the way."
        >
          No time.<br />Too many ideas.<br /><span style={{ color: '#60A5FA' }}>Classic setup.</span>
        </Statement>

        <Div />

        {/* ═══ CH2: THE IDEA ═══════════════════════════════════════ */}
        <Chapter num="1" emoji="💡" title="What if the agent just… ran?">
          <p>Tried Claude Code. Loved it. But I had to be at my computer.</p>
          <p style={{ marginTop: '1.25rem', fontSize: '1.4rem', color: '#E5E7EB', fontWeight: 700, lineHeight: 1.4 }}>
            &ldquo;What if it ran on a server at home, and I just texted it tasks from my phone?&rdquo;
          </p>
        </Chapter>

        <Div />

        {/* ═══ CH3: THE MACHINE ════════════════════════════════════ */}
        <Chapter num="2" emoji="🖥️" title="The Machine">
          <p>Bought a <strong style={{ color: '#E5E7EB' }}>Dell OptiPlex 5090 Micro</strong>. Always-on home server. WSL2, Git, Node.js, the works.</p>
          <Stats items={[{ v: '24/7', l: 'Uptime' }, { v: '0', l: 'Confirm dialogs' }, { v: '100%', l: 'Phone deployable' }]} />
        </Chapter>

        <Div />

        {/* ═══ CH4: DISPATCH ═══════════════════════════════════════ */}
        <Chapter num="3" emoji="🤝" title="Claude Dispatch" accent>
          <p>After the last meetup I landed on <strong style={{ color: '#60A5FA' }}>Claude Dispatch</strong> — Anthropic&apos;s agentic system inside the Claude desktop app.</p>
          <p style={{ marginTop: '1.25rem' }}>Git worktrees. Scheduled tasks. Mobile chat interface. Pro → MAX. Removed every confirmation dialog. It just ships.</p>
        </Chapter>

        <Div />

        {/* ═══ FAMILY ══════════════════════════════════════════════ */}
        <Chapter num={null} emoji="🎮" title="The Plot Twist">
          <div style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.18)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <p style={{ color: '#FCD34D', fontWeight: 700, marginBottom: '0.4rem' }}>⚠️ Parenting Achievement Unlocked</p>
            <p>I banned my son from playing Minecraft.</p>
          </div>
          <p>He found my Claude MAX subscription. <em style={{ color: '#D1D5DB' }}>&ldquo;Dad, can I use this to build my own Minecraft?&rdquo;</em></p>
          <p style={{ marginTop: '1rem' }}>Reader, I let him. He&apos;s 9 years old and now developing a Minecraft-inspired game with Claude as his dev team.</p>
          <p style={{ marginTop: '1rem', color: '#4B5563' }}>Two active users on MAX in this household. Send help (or a family plan).</p>
        </Chapter>

        <Div />

        {/* ═══ PROJECTS ════════════════════════════════════════════ */}
        <Chapter num="4" emoji="🌱" title="The Projects">
          <p style={{ marginBottom: '2rem' }}>All running in parallel. All dispatched from my phone.</p>
          <Project emoji="📌" name="GardenPin" desc="Garden planning tracker for seasonal tasks — prune, repot, fertilize. Full-stack React + Express + SQLite. iOS-style redesign requested from a commute." status="building" />
          <Project emoji="🩺" name="Zdravotní Analyzátor" nameEn="Health Analyzer" desc="Private offline health tracker. Upload lab results, local AI (Ollama on the Dell) explains what's outside normal range. No cloud. No data leaks." status="building" />
          <Project emoji="📱" name="QR Jídelníček" nameEn="QR Menu" desc="Digital QR menu platform for restaurants. Scan → see the menu. Admin dashboard, analytics, Stripe payments for premium tier." status="building" />
          <Project emoji="🌐" name="patrikprikryl.com" desc="This website. Built, redesigned, and maintained entirely by Claude. Including this page — created the night before this demo." status="live" />
          <div style={{ marginTop: '1rem', background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.12)', borderRadius: '20px', padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '1.75rem' }}>🍎</span>
            <div>
              <div style={{ fontWeight: 800, color: '#F9FAFB', marginBottom: '0.25rem' }}>iOS App Store <span style={{ fontSize: '0.7rem', color: '#F59E0B', fontWeight: 700, padding: '0.15rem 0.5rem', background: 'rgba(245,158,11,0.15)', borderRadius: '99px', border: '1px solid rgba(245,158,11,0.2)', marginLeft: '0.5rem' }}>NEXT</span></div>
              <p style={{ fontSize: '0.9rem', color: '#6B7280', margin: 0 }}>One of these projects — probably GardenPin — goes to the App Store. First native iOS release.</p>
            </div>
          </div>
        </Chapter>

        <Div />

        {/* ═══ NEVER ENDING LOOP ═══════════════════════════════════ */}
        <Chapter num="5" emoji="♾️" title="The Never-Ending Loop" accent>
          <p style={{ fontSize: '1.3rem', color: '#E5E7EB', fontWeight: 600, lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Right now I&apos;m building the agent that builds the agents.
          </p>
          <p>A dispatch agent that runs 24/7 — reads project goals, invents its own tasks, validates them, assigns them to code sessions, and loops back without ever stopping or asking for permission.</p>
          <div style={{ marginTop: '1.75rem', display: 'flex', gap: '0', flexDirection: 'column' }}>
            {[
              { icon: '📋', label: 'Read BACKLOG + goals' },
              { icon: '🧠', label: 'Invent next best task' },
              { icon: '✅', label: 'Self-validate priority' },
              { icon: '🚀', label: 'Dispatch code session' },
              { icon: '♾️', label: 'Loop forever' },
            ].map(({ icon, label }, i, arr) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{icon}</div>
                  {i < arr.length - 1 && <div style={{ width: '1px', height: '24px', background: 'rgba(96,165,250,0.2)', margin: '2px 0' }} />}
                </div>
                <span style={{ fontSize: '1rem', color: '#9CA3AF', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </Chapter>

        <Div />

        {/* ═══ THE DEMO IS THE DEMO ════════════════════════════════ */}
        <Statement sub="No Figma. No design sprints. No CSS at 2am. Just a message and a commit notification.">
          <span style={{ color: '#60A5FA' }}>You&apos;re looking<br />at the demo.</span>
        </Statement>

        <Div />

        {/* ═══ PROPHECY ════════════════════════════════════════════ */}
        <Chapter num="6" emoji="🔮" title="The Prophecy" accent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { icon: '🏭', text: "Agents enter enterprises — not as tools, as colleagues with tasks, deadlines, and accountability." },
              { icon: '🚗', text: "Škoda Auto. VW Group. 40,000 people. Millions of procurement decisions. This is where it pays off at scale." },
              { icon: '🔐', text: "The bottleneck won't be the AI — it'll be getting legal to sign off on the first agentic workflow. I'm working on that too." },
              { icon: '⏳', text: "The people who learn to work with agents now will design those corporate workflows in 3 years." },
            ].map(({ icon, text }) => (
              <div key={icon} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'rgba(96,165,250,0.04)', border: '1px solid rgba(96,165,250,0.1)', borderRadius: '14px', padding: '1.1rem 1.25rem' }}>
                <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{icon}</span>
                <p style={{ color: '#9CA3AF', lineHeight: 1.65, margin: 0 }}>{text}</p>
              </div>
            ))}
          </div>
        </Chapter>

        <Div />
        <Closing />
      </div>

      <style>{`
        * { margin: 0; box-sizing: border-box; }
        @keyframes bounce-arrow { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(10px)} }
        @keyframes pulse-badge  { 0%,100%{box-shadow:0 0 0 0 rgba(26,86,219,0)} 50%{box-shadow:0 0 0 6px rgba(26,86,219,0.15)} }
        strong { color: #E5E7EB; }
        em { font-style: italic; }
      `}</style>
    </div>
  );
}
