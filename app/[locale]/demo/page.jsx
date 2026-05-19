'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';

/* ─── Perf-safe reveal: only opacity + transform, GPU-accelerated ─ */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, v];
}

/* ─── Count-up on enter ──────────────────────────────────────────── */
function CountUp({ target, suffix = '', duration = 1400 }) {
  const [val, setVal] = useState(0);
  const [ref, v] = useReveal(0.3);
  useEffect(() => {
    if (!v) return;
    if (target === '∞') { setVal('∞'); return; }
    const n = parseInt(target, 10);
    if (isNaN(n)) { setVal(target); return; }
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * p * n));
      if (p < 1) requestAnimationFrame(step);
      else setVal(n);
    };
    requestAnimationFrame(step);
  }, [v, target, duration]);
  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 'clamp(4rem, 14vw, 9rem)', fontWeight: 900, letterSpacing: '-0.05em', color: '#F9FAFB', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
        {val}{suffix}
      </div>
    </div>
  );
}

/* ─── Typewriter ─────────────────────────────────────────────────── */
function Typewriter({ lines, speed = 28 }) {
  const [ref, v] = useReveal(0.2);
  const [text, setText] = useState('');
  const full = lines.join('\n');
  useEffect(() => {
    if (!v) return;
    let i = 0;
    const id = setInterval(() => {
      setText(full.slice(0, i + 1));
      i++;
      if (i >= full.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [v, full, speed]);
  return (
    <div ref={ref} style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: 'clamp(0.8rem, 1.8vw, 1rem)', lineHeight: 1.8, color: '#34D399', background: '#0a0f0a', borderRadius: '12px', padding: '1.5rem 2rem', border: '1px solid rgba(52,211,153,0.2)', whiteSpace: 'pre', overflowX: 'auto' }}>
      <span style={{ color: '#4B5563' }}>$ </span>{text}<span style={{ animation: 'blink 1s step-end infinite', color: '#34D399' }}>▋</span>
    </div>
  );
}

/* ─── Fade section wrapper ───────────────────────────────────────── */
function Scene({ children, center = false, style = {} }) {
  const [ref, v] = useReveal(0.08);
  return (
    <section ref={ref} style={{
      padding: '7rem 1.5rem',
      maxWidth: '900px',
      margin: '0 auto',
      opacity: v ? 1 : 0,
      transform: v ? 'translateY(0)' : 'translateY(28px)',
      transition: 'opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)',
      textAlign: center ? 'center' : 'left',
      ...style,
    }}>
      {children}
    </section>
  );
}

/* ─── Full bleed photo section ───────────────────────────────────── */
function PhotoReveal({ src, alt, caption, subcaption, overlay = 'rgba(0,0,0,0.55)' }) {
  const [ref, v] = useReveal(0.05);
  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', minHeight: '70vh', maxHeight: '90vh', overflow: 'hidden', opacity: v ? 1 : 0, transform: v ? 'scale(1)' : 'scale(1.03)', transition: 'opacity 1.1s ease, transform 1.1s ease' }}>
      <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', minHeight: '70vh', maxHeight: '90vh' }} loading="lazy" />
      <div style={{ position: 'absolute', inset: 0, background: overlay }} />
      {caption && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2.5rem 2rem', background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 100%)' }}>
          <p style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900, color: '#F9FAFB', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: subcaption ? '0.5rem' : 0 }}>{caption}</p>
          {subcaption && <p style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{subcaption}</p>}
        </div>
      )}
    </div>
  );
}

/* ─── Divider ────────────────────────────────────────────────────── */
const Rule = () => (
  <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent 100%)' }} />
);

/* ─── Project card ───────────────────────────────────────────────── */
function ProjectCard({ emoji, name, nameEn, desc, status }) {
  return (
    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', padding: '1.25rem 1.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: '0.875rem' }}>
      <span style={{ fontSize: '1.75rem', flexShrink: 0, lineHeight: 1, marginTop: '0.1rem' }}>{emoji}</span>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#F9FAFB' }}>{name}</span>
          {nameEn && <span style={{ fontSize: '0.78rem', color: '#374151' }}>{nameEn}</span>}
          <span style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.18rem 0.6rem', borderRadius: '99px', background: status === 'live' ? 'rgba(52,211,153,0.1)' : 'rgba(96,165,250,0.1)', color: status === 'live' ? '#34D399' : '#60A5FA', border: `1px solid ${status === 'live' ? 'rgba(52,211,153,0.22)' : 'rgba(96,165,250,0.22)'}` }}>
            {status === 'live' ? '● live' : '● building'}
          </span>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>{desc}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════ */
export default function DemoPage() {
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ background: '#07080D', minHeight: '100vh', fontFamily: "var(--font-inter),'Inter',-apple-system,sans-serif", color: '#F9FAFB', overflowX: 'hidden' }}>

      {/* Static gradient — no animation, no lag */}
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 120% 45% at 50% 0%, rgba(20,50,180,0.16) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ═══ HERO ══════════════════════════════════════════════════ */}
        <section style={{
          minHeight: '100svh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          padding: '6rem 1.5rem 5rem', position: 'relative',
          opacity: heroVisible ? 1 : 0,
          transition: 'opacity 1.4s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(26,86,219,0.12)', border: '1px solid rgba(26,86,219,0.28)', borderRadius: '99px', padding: '0.45rem 1.1rem', marginBottom: '2.5rem', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#7BA7F7' }}>
            🎯 Agents in Action Night Prague #3 · May 20, 2026
          </div>

          <h1 style={{ fontSize: 'clamp(3.5rem, 13vw, 8.5rem)', fontWeight: 900, lineHeight: 0.92, letterSpacing: '-0.045em', marginBottom: '2.5rem', background: 'linear-gradient(160deg, #ffffff 0%, #b3c6ff 50%, #60A5FA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Building<br /><span style={{ fontSize: '0.68em', opacity: 0.85 }}>with an AI dev</span><br /><span style={{ fontSize: '0.5em', opacity: 0.6 }}>from my phone</span>
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.12)', flexShrink: 0 }}>
              <img src="/patrik.jpg" alt="Patrik" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#E5E7EB' }}>Patrik Přikryl</div>
              <div style={{ fontSize: '0.78rem', color: '#4B5563', lineHeight: 1.45 }}>AI Project Manager · Škoda Auto Procurement<br />covering AI strategy for Volkswagen Group</div>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', opacity: 0.3 }}>
            <div style={{ animation: 'scrollHint 2s ease-in-out infinite' }}>
              <svg width="20" height="32" viewBox="0 0 20 32" fill="none"><rect x="1" y="1" width="18" height="30" rx="9" stroke="white" strokeWidth="1.5"/><circle cx="10" cy="9" r="3" fill="white"><animate attributeName="cy" values="9;18;9" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite"/></circle></svg>
            </div>
          </div>
        </section>

        <Rule />

        {/* ═══ MEETUP ROOM — context ════════════════════════════════ */}
        <PhotoReveal
          src="/demo/meetup-room.jpg"
          alt="Previous meetup"
          caption="You've been to this room before."
          subcaption="Last time someone asked: which framework are you using? I didn't have a good answer yet."
          overlay="linear-gradient(to bottom, rgba(7,8,13,0.3) 0%, rgba(7,8,13,0.15) 40%, rgba(7,8,13,0.75) 100%)"
        />

        <Rule />

        {/* ═══ THE HONEST NUMBERS ═══════════════════════════════════ */}
        <Scene center>
          <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#374151', marginBottom: '4rem' }}>The situation</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem 2rem', maxWidth: '680px', margin: '0 auto' }}>
            <div>
              <CountUp target="3" suffix="+" />
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#374151', marginTop: '0.5rem' }}>Kids</p>
            </div>
            <div>
              <CountUp target="∞" />
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#374151', marginTop: '0.5rem' }}>Side project ideas</p>
            </div>
            <div>
              <CountUp target="0" suffix="h" />
              <p style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#374151', marginTop: '0.5rem' }}>Free time / day</p>
            </div>
          </div>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', color: '#4B5563', marginTop: '3.5rem', lineHeight: 1.7 }}>
            Oh, and I work in procurement at Škoda Auto.<br />The fourth kid is arriving soon.
          </p>
        </Scene>

        <Rule />

        {/* ═══ THE SPARK ════════════════════════════════════════════ */}
        <Scene center>
          <p style={{ fontSize: 'clamp(1.8rem, 6vw, 3.5rem)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', color: '#D1D5DB', fontStyle: 'italic', maxWidth: '700px', margin: '0 auto' }}>
            &ldquo;What if the agent ran on a server at home, and I just&nbsp;
            <span style={{ color: '#F9FAFB', textDecoration: 'underline', textDecorationColor: 'rgba(96,165,250,0.5)', textDecorationThickness: '2px', textUnderlineOffset: '6px' }}>texted it tasks</span>
            &nbsp;from my phone?&rdquo;
          </p>
        </Scene>

        <Rule />

        {/* ═══ VINCE — full bleed hero moment ══════════════════════ */}
        <PhotoReveal
          src="/demo/vince.jpg"
          alt="Vince — Dell 5090 with Firexball"
          caption="Meet Vince."
          subcaption="Dell OptiPlex 5090. Always-on home server. Fire extinguisher included. Left him home alone for the Legoland weekend — he earned it."
          overlay="linear-gradient(to bottom, rgba(7,8,13,0.1) 0%, rgba(7,8,13,0.6) 100%)"
        />

        <Scene center>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', maxWidth: '560px', margin: '0 auto' }}>
            {[{ v: '24/7', l: 'Uptime' }, { v: '0', l: 'Confirm dialogs' }, { v: '1', l: 'Firexball' }].map(({ v: val, l }) => (
              <div key={l} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.25rem 0.75rem', textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.04em', color: '#F9FAFB' }}>{val}</div>
                <div style={{ fontSize: '0.67rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#374151', marginTop: '0.35rem' }}>{l}</div>
              </div>
            ))}
          </div>
        </Scene>

        <Rule />

        {/* ═══ CLAUDE DISPATCH — terminal ══════════════════════════ */}
        <Scene>
          <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#374151', marginBottom: '1.25rem' }}>The setup</p>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#60A5FA', lineHeight: 1.1, marginBottom: '2rem' }}>Claude Dispatch</h2>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: '#9CA3AF', lineHeight: 1.75, maxWidth: '600px', marginBottom: '2rem' }}>
            After a lot of experimenting — n8n, CrewAI, LangGraph — I landed here. Git worktrees. Scheduled tasks. Mobile interface. It starts code sessions while I parent my children.
          </p>
          <Typewriter lines={[
            'dispatch → "Add weather widget to GardenPin"',
            '',
            '▸ Starting code session in worktree...',
            '▸ Reading BACKLOG.md + project context...',
            '▸ Writing components/WeatherWidget.jsx...',
            '▸ npm run build ✓',
            '▸ git commit -m "feat: weather widget"',
            '▸ Pushing to origin/claude/weather-widget',
            '',
            'Done. Branch ready for review.',
          ]} />
          <p style={{ fontSize: '0.85rem', color: '#4B5563', marginTop: '1rem', lineHeight: 1.6 }}>
            This is a real session from two days ago. I typed that first line from my phone during a standup meeting.
          </p>
        </Scene>

        <Rule />

        {/* ═══ FAMILY PLOT TWIST ════════════════════════════════════ */}
        <Scene>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
            <div style={{ borderRadius: '14px', overflow: 'hidden', aspectRatio: '16/10' }}>
              <img src="/demo/minecraft-screen.png" alt="Son's Minecraft game" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} loading="lazy" />
            </div>
            <div style={{ borderRadius: '14px', overflow: 'hidden', aspectRatio: '16/10' }}>
              <img src="/demo/minecraft-crafting.png" alt="Craftovací stůl" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left' }} loading="lazy" />
            </div>
          </div>
          <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.16)', borderRadius: '14px', padding: '1.25rem 1.5rem', marginBottom: '1.75rem' }}>
            <span style={{ color: '#F59E0B', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em' }}>⚠️ PARENTING ACHIEVEMENT UNLOCKED</span>
            <p style={{ color: '#9CA3AF', marginTop: '0.3rem', fontSize: '0.9rem' }}>I banned my son from playing Minecraft.</p>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            He&apos;s 9. He built his own.
          </h2>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: '#9CA3AF', lineHeight: 1.75, maxWidth: '560px' }}>
            He found my Claude MAX subscription and said: <em style={{ color: '#D1D5DB' }}>&ldquo;Dad, can I use this to make Minecraft?&rdquo;</em>
          </p>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: '#9CA3AF', lineHeight: 1.75, maxWidth: '560px', marginTop: '1rem' }}>
            Reader, I let him. He&apos;s now shipping a Minecraft-inspired game with Claude as his entire dev team. That right side screenshot is a crafting table he designed. Czech UI and everything.
          </p>
          <p style={{ fontSize: '0.9rem', color: '#374151', marginTop: '1.25rem' }}>
            Two active MAX users in this household. The plan doesn&apos;t scale with children.
          </p>
        </Scene>

        <Rule />

        {/* ═══ PROJECTS ════════════════════════════════════════════ */}
        <Scene>
          <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#374151', marginBottom: '1.25rem' }}>Running in parallel</p>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '2.5rem' }}>The Projects</h2>
          <ProjectCard emoji="📌" name="GardenPin" desc="Garden planning tracker — prune the apple trees, repot tomatoes. React + Express + SQLite. iOS-style redesign dispatched from a commute." status="building" />
          <ProjectCard emoji="🩺" name="Zdravotní Analyzátor" nameEn="Health Analyzer" desc="Private offline health tracker. Upload lab results, local Ollama AI on the same Dell explains what's outside normal range. No cloud, no data leaks." status="building" />
          <ProjectCard emoji="📱" name="QR Jídelníček" nameEn="QR Menu" desc="Digital menu platform for restaurants. Scan → see the menu. Admin dashboard, analytics, Stripe. There's a QR code on the screen behind the presenter at that meetup photo above." status="building" />
          <ProjectCard emoji="🌐" name="patrikprikryl.com" desc="This site. Built and maintained entirely by Claude. Including this page — written last night, deployed before the talk." status="live" />
          <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.1rem 1.5rem', borderRadius: '14px', background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.12)' }}>
            <span style={{ fontSize: '1.5rem' }}>🍎</span>
            <div>
              <span style={{ fontWeight: 800, color: '#F9FAFB', fontSize: '0.95rem' }}>iOS App Store </span>
              <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.15rem 0.5rem', borderRadius: '99px', background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)', marginLeft: '0.5rem' }}>NEXT</span>
              <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: '0.2rem 0 0', lineHeight: 1.5 }}>One of these ships as a native app. Probably GardenPin.</p>
            </div>
          </div>
        </Scene>

        <Rule />

        {/* ═══ THE NEVER-ENDING LOOP ════════════════════════════════ */}
        <Scene center>
          <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#374151', marginBottom: '1.25rem' }}>Current obsession</p>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#60A5FA', lineHeight: 1.15, marginBottom: '1rem' }}>The Never-Ending Loop</h2>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: '#9CA3AF', lineHeight: 1.75, maxWidth: '560px', margin: '0 auto 3rem' }}>
            I&apos;m building an agent that builds the agents. A dispatch loop that runs 24/7, reads project goals, invents tasks, validates them, ships code, and loops back without ever asking for permission.
          </p>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0, textAlign: 'left' }}>
            {[
              { icon: '📋', label: 'Read project goals + BACKLOG', color: '#60A5FA' },
              { icon: '🧠', label: 'Invent the next best task', color: '#A78BFA' },
              { icon: '✅', label: 'Self-validate priority + effort', color: '#34D399' },
              { icon: '🚀', label: 'Dispatch code session', color: '#F59E0B' },
              { icon: '♾️', label: 'Loop forever', color: '#F9FAFB' },
            ].map(({ icon, label, color }, i, arr) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '48px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{icon}</div>
                  {i < arr.length - 1 && <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.08)' }} />}
                </div>
                <span style={{ marginLeft: '1rem', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', color, fontWeight: 600 }}>{label}</span>
              </div>
            ))}
          </div>
        </Scene>

        <Rule />

        {/* ═══ THE DEMO IS THE DEMO ════════════════════════════════ */}
        <Scene center>
          <p style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.15, color: '#D1D5DB', marginBottom: '1.5rem' }}>
            You&apos;re looking at<br />
            <span style={{ color: '#F9FAFB' }}>the demo</span>
            <span style={{ color: '#60A5FA' }}>.</span>
          </p>
          <p style={{ fontSize: 'clamp(1rem, 2.2vw, 1.2rem)', color: '#4B5563', lineHeight: 1.75, maxWidth: '540px', margin: '0 auto' }}>
            This page was written last night. Described to Claude from my phone. No Figma. No design meetings. No CSS debugging at 2am. Just a message, a commit notification, and a Vercel deploy.
          </p>
        </Scene>

        <Rule />

        {/* ═══ PROPHECY ════════════════════════════════════════════ */}
        <Scene>
          <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#374151', marginBottom: '1.25rem' }}>What I believe</p>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#60A5FA', marginBottom: '2.5rem' }}>The Prophecy</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { icon: '🏭', text: "Agents enter enterprises — not as tools, as colleagues with tasks, deadlines, accountability." },
              { icon: '🚗', text: "Škoda Auto. VW Group. 40,000 people. Millions of procurement decisions per year. This is where it pays off at scale." },
              { icon: '🔐', text: "The bottleneck won't be the AI — it'll be getting legal to sign off on the first agentic workflow. (Working on that too.)" },
              { icon: '⏳', text: "The people learning to work with agents now will design those corporate workflows in 3 years." },
            ].map(({ icon, text }) => (
              <div key={icon} style={{ display: 'flex', gap: '1.1rem', alignItems: 'flex-start', padding: '1.1rem 1.4rem', borderRadius: '14px', background: 'rgba(96,165,250,0.04)', border: '1px solid rgba(96,165,250,0.1)' }}>
                <span style={{ fontSize: '1.2rem', flexShrink: 0, marginTop: '0.1rem' }}>{icon}</span>
                <p style={{ color: '#9CA3AF', lineHeight: 1.7, margin: 0, fontSize: 'clamp(0.9rem, 1.8vw, 1rem)' }}>{text}</p>
              </div>
            ))}
          </div>
        </Scene>

        <Rule />

        {/* ═══ PATRIK SELFIE + CLOSE ════════════════════════════════ */}
        <PhotoReveal
          src="/demo/patrik-selfie.jpg"
          alt="Patrik at meetup"
          caption="See you after the talk."
          subcaption="Agents, dispatch setups, autonomous loops, or why giving a 9-year-old Claude MAX is definitely fine."
          overlay="linear-gradient(to bottom, rgba(7,8,13,0.05) 0%, rgba(7,8,13,0.85) 100%)"
        />

        {/* ═══ LINKS ═══════════════════════════════════════════════ */}
        <Scene center>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#1A56DB', color: '#fff', padding: '0.9rem 1.75rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
              patrikprikryl.com →
            </Link>
            <a href="https://github.com/RubbySource" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', color: '#9CA3AF', padding: '0.9rem 1.75rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.09)' }}>
              GitHub
            </a>
          </div>
          <p style={{ fontSize: '0.68rem', color: '#1F2937', marginTop: '4rem' }}>
            patrikprikryl.com/demo · Built by Claude Dispatch · Agents in Action Night Prague #3 · May 2026
          </p>
        </Scene>

      </div>

      <style>{`
        * { margin: 0; box-sizing: border-box; }
        @keyframes scrollHint { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        strong { color: #E5E7EB; }
        em { font-style: italic; }
        img { transform: translateZ(0); }
      `}</style>
    </div>
  );
}
