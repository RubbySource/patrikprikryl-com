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

/* ─── Typewriter — rAF-based to avoid scroll jank ───────────────── */
function Typewriter({ lines, speed = 28 }) {
  const [ref, v] = useReveal(0.2);
  const [text, setText] = useState('');
  const full = lines.join('\n');
  useEffect(() => {
    if (!v) return;
    let i = 0;
    let last = 0;
    let raf;
    const step = (ts) => {
      if (ts - last >= speed) {
        last = ts;
        i++;
        setText(full.slice(0, i));
      }
      if (i < full.length) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
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

/* ─── Floating LinkedIn QR ───────────────────────────────────────── */
function FloatingQR() {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="https://www.linkedin.com/in/patrikprikryl"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        right: '1.25rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.3rem',
        background: 'rgba(7,8,13,0.88)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '14px',
        padding: '0.6rem 0.6rem 0.4rem',
        background: '#0d0f16',
        boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
        textDecoration: 'none',
        opacity: hovered ? 1 : 0.65,
        transform: hovered ? 'scale(1.04)' : 'scale(1)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        touchAction: 'manipulation',
        willChange: 'transform',
      }}
      aria-label="Connect on LinkedIn"
    >
      <img
        src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://www.linkedin.com/in/patrikprikryl&bgcolor=0d0f16&color=60A5FA&qzone=1&format=png"
        alt="LinkedIn QR code"
        width={58}
        height={58}
        style={{ borderRadius: '6px', display: 'block' }}
      />
      <span style={{ fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#60A5FA' }}>LinkedIn</span>
    </a>
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

      {/* Floating QR → LinkedIn */}
      <FloatingQR />

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

          <h1 style={{ fontSize: 'clamp(3rem, 12vw, 7.5rem)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.045em', marginBottom: '1.5rem', background: 'linear-gradient(160deg, #ffffff 0%, #b3c6ff 50%, #60A5FA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            How to double<br />yourself. 24/7.
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)', color: '#4B5563', fontWeight: 600, letterSpacing: '-0.01em', marginBottom: '2.5rem', maxWidth: '520px' }}>
            The ultimate phone setup — for people with zero free time, zero IT background, and way too many ideas.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', justifyContent: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.14)', flexShrink: 0, boxShadow: '0 0 0 6px rgba(96,165,250,0.07)' }}>
              <img src="/patrik.jpg" alt="Patrik" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#E5E7EB' }}>Patrik Přikryl</div>
              <div style={{ fontSize: '0.78rem', color: '#4B5563', lineHeight: 1.5 }}>AI Project Manager · Škoda Auto Procurement<br />covering AI strategy for Volkswagen Group</div>
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

        {/* ═══ VINCE — story: VPS vs home box ══════════════════════ */}
        <Scene>
          <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#374151', marginBottom: '1.25rem' }}>The hardware decision</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1.5rem' }}>VPS or a box<br />under the desk?</h2>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: '#9CA3AF', lineHeight: 1.75, maxWidth: '580px', marginBottom: '1.5rem' }}>
            I almost rented a cloud server. DigitalOcean, Hetzner, the usual. Then I stopped. I love hardware. I always have — there&apos;s something about owning the metal. Knowing exactly what&apos;s running. Being able to upgrade it, expand it, build on top of it in ways a VPS will never let you. Cloud is someone else&apos;s computer. Then I found this listing.
          </p>
          <div style={{ borderRadius: '18px', overflow: 'hidden', maxWidth: '340px', width: '100%', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 16px 48px rgba(0,0,0,0.6)', marginBottom: '1.5rem' }}>
            <img src="/demo/vince-marketplace.jpg" alt="Dell OptiPlex 5090 on Facebook Marketplace — 5700 Kč" loading="lazy" style={{ width: '100%', display: 'block' }} />
          </div>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: '#D1D5DB', fontWeight: 700, lineHeight: 1.5 }}>
            5 700 Kč. One-time. Physically mine.
          </p>
          <p style={{ fontSize: '0.9rem', color: '#4B5563', lineHeight: 1.6, marginTop: '0.5rem' }}>
            No monthly bill. No rate limits. First thing I did was upgrade the RAM — 8 GB to 32 GB. Just because I could.
          </p>
        </Scene>

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

        {/* ═══ 3 STEPS ══════════════════════════════════════════════ */}
        <Scene center>
          <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#374151', marginBottom: '1.25rem' }}>How it actually works</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '3rem' }}>Three steps.<br />That&apos;s it.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
            {[
              {
                step: '01',
                icon: '📱',
                title: 'Text from your phone',
                desc: 'One message. "Add feature X to GardenPin." From the sofa, the car, the kids\' sports practice. Doesn\'t matter where.',
                color: '#60A5FA',
              },
              {
                step: '02',
                icon: '🖥️',
                title: 'Vince picks it up',
                desc: 'Claude Code reads the project context, writes the code, runs the build, commits — while you\'re doing something else entirely.',
                color: '#A78BFA',
              },
              {
                step: '03',
                icon: '✅',
                title: 'It\'s done',
                desc: 'PR ready. Deployed to Vercel. Or a health analysis sitting in your inbox. You show up to review, not to build.',
                color: '#34D399',
              },
            ].map(({ step, icon, title, desc, color }) => (
              <div key={step} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '2rem 1.75rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '1.25rem', right: '1.5rem', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.07)' }}>{step}</div>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{icon}</div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: color, marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>{title}</h3>
                <p style={{ fontSize: '0.88rem', color: '#4B5563', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.82rem', color: '#374151', marginTop: '2.5rem', lineHeight: 1.6, maxWidth: '480px', margin: '2.5rem auto 0' }}>
            No IDE. No terminal. No deployment pipeline to babysit.<br />Just a phone and a very obedient server.
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

        {/* ═══ CES PRESENTATION ═══════════════════════════════════ */}
        <PhotoReveal
          src="/demo/ces-presentation.jpg"
          alt="Patrik presenting CES 2026 report to 400 people"
          caption="400 people in the room."
          subcaption="Physical AI · CES 2026. Boston Dynamics, Figure, Tesla Optimus — on the floor, right there."
          overlay="linear-gradient(to bottom, rgba(7,8,13,0.15) 0%, rgba(7,8,13,0.0) 30%, rgba(7,8,13,0.75) 100%)"
        />

        <Scene>
          <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#374151', marginBottom: '1.25rem' }}>It&apos;s not just code</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1.5rem' }}>
            &ldquo;Build me a presentation<br />from the CES report.&rdquo;
          </h2>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: '#9CA3AF', lineHeight: 1.75, maxWidth: '580px', marginBottom: '1rem' }}>
            I sent Claude the CES 2026 briefing materials. Asked it to turn them into a presentation. It picked the most compelling angle — Physical AI you can physically touch — structured the narrative, chose the quotes, designed the flow.
          </p>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: '#9CA3AF', lineHeight: 1.75, maxWidth: '580px' }}>
            I walked on stage with it. 400 people in the audience.
          </p>
          <p style={{ fontSize: '0.88rem', color: '#374151', marginTop: '1.25rem', lineHeight: 1.6 }}>
            The agents don&apos;t just write code. They write your Monday morning report, your board deck, your CES debrief.
          </p>
        </Scene>

        <Rule />

        {/* ═══ PROJECTS ════════════════════════════════════════════ */}
        <Scene>
          <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#374151', marginBottom: '1.25rem' }}>Running in parallel</p>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '2.5rem' }}>The Projects</h2>
          <ProjectCard emoji="📌" name="GardenPin" desc="Garden planning tracker — prune the apple trees, repot tomatoes. React + Express + SQLite. iOS-style redesign dispatched from a commute." status="building" />
          {/* GardenPin screenshot inline — bigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.25rem 1.5rem', marginBottom: '0.875rem', background: 'rgba(255,255,255,0.015)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ flexShrink: 0, borderRadius: '22px', overflow: 'hidden', width: '160px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 28px rgba(0,0,0,0.55)' }}>
              <img src="/demo/gardenpin-ios.jpg" alt="GardenPin on iPhone" loading="lazy" style={{ width: '100%', display: 'block' }} />
            </div>
            <p style={{ fontSize: '0.9rem', color: '#4B5563', lineHeight: 1.6, margin: 0 }}>
              My actual garden, pinned on a satellite map. Running on a real iPhone.<br/><br/>
              <span style={{ color: '#374151' }}>iOS redesign in progress — dispatched from a commute.</span>
            </p>
          </div>
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

        {/* ═══ LINKEDIN CTA ════════════════════════════════════════ */}
        <Scene center>
          <p style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.15, color: '#D1D5DB', marginBottom: '1.5rem' }}>
            Want the<br />
            <span style={{ color: '#60A5FA' }}>setup</span>
            <span style={{ color: '#F9FAFB' }}>?</span>
          </p>
          <p style={{ fontSize: 'clamp(1rem, 2.2vw, 1.2rem)', color: '#6B7280', lineHeight: 1.8, maxWidth: '560px', margin: '0 auto 2.5rem' }}>
            Connect with me on LinkedIn.<br />
            <strong style={{ color: '#E5E7EB' }}>Vince</strong> — not me, Vince — will share how to bypass approvals in Dispatch to run as autonomously as possible.
          </p>
          <a
            href="https://www.linkedin.com/in/patrikprikryl"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', background: '#0A66C2', color: '#fff', padding: '1rem 2rem', borderRadius: '14px', fontWeight: 800, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 4px 24px rgba(10,102,194,0.35)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            linkedin.com/in/patrikprikryl
          </a>
        </Scene>

        <Rule />

        {/* ═══ PROPHECY — zkrácená ══════════════════════════════════ */}
        <Scene center>
          <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#374151', marginBottom: '2rem' }}>The question I can&apos;t stop thinking about</p>
          {/* Building/server graphic */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px' }}>
              <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                <rect x="15" y="30" width="90" height="75" rx="4" fill="rgba(96,165,250,0.07)" stroke="rgba(96,165,250,0.25)" strokeWidth="1.5"/>
                <rect x="25" y="15" width="70" height="20" rx="3" fill="rgba(96,165,250,0.1)" stroke="rgba(96,165,250,0.3)" strokeWidth="1.5"/>
                <rect x="30" y="50" width="16" height="12" rx="2" fill="rgba(96,165,250,0.2)"/>
                <rect x="52" y="50" width="16" height="12" rx="2" fill="rgba(96,165,250,0.2)"/>
                <rect x="74" y="50" width="16" height="12" rx="2" fill="rgba(96,165,250,0.2)"/>
                <rect x="30" y="70" width="16" height="12" rx="2" fill="rgba(96,165,250,0.15)"/>
                <rect x="52" y="70" width="16" height="12" rx="2" fill="rgba(96,165,250,0.15)"/>
                <rect x="74" y="70" width="16" height="12" rx="2" fill="rgba(96,165,250,0.15)"/>
                <rect x="47" y="90" width="26" height="15" rx="2" fill="rgba(96,165,250,0.12)" stroke="rgba(96,165,250,0.2)" strokeWidth="1"/>
                {/* lock icon overlay */}
                <circle cx="97" cy="33" r="16" fill="#07080D" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5"/>
                <rect x="91" y="33" width="12" height="9" rx="1.5" fill="rgba(245,158,11,0.25)" stroke="rgba(245,158,11,0.6)" strokeWidth="1"/>
                <path d="M93 33 v-3 a4 4 0 0 1 8 0 v3" stroke="rgba(245,158,11,0.7)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <circle cx="97" cy="37.5" r="1.5" fill="#F59E0B"/>
              </svg>
            </div>
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#F9FAFB', lineHeight: 1.2, maxWidth: '640px', margin: '0 auto 1.5rem' }}>
            Will autonomous agents ever get past the firewall?
          </h2>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: '#6B7280', lineHeight: 1.8, maxWidth: '540px', margin: '0 auto' }}>
            I&apos;m genuinely curious when — and if — we&apos;ll be able to let autonomous agents loose on legacy systems in corporate environments. Škoda Auto. VW Group. Millions of procurement decisions per year. The potential is obvious. The legal and compliance journey is&hellip; <em style={{ color: '#4B5563' }}>interesting</em>.
          </p>
          <p style={{ fontSize: '0.85rem', color: '#374151', marginTop: '1.5rem' }}>Working on finding out. From the inside.</p>
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
