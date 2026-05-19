'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/* ─── Tiny scroll-reveal hook ───────────────────────────────── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Chapter({ emoji, number, title, children, accent = false }) {
  const [ref, visible] = useReveal();
  return (
    <section ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)', transition: 'opacity 0.7s ease, transform 0.7s ease', padding: '5rem 1.5rem', maxWidth: '760px', margin: '0 auto' }}>
      {number && (<p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#4B5563', marginBottom: '0.75rem' }}>Chapter {number}</p>)}
      <div style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', marginBottom: '1rem', lineHeight: 1 }}>{emoji}</div>
      <h2 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.5rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '1.5rem', color: accent ? '#60A5FA' : '#F9FAFB' }}>{title}</h2>
      <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', lineHeight: 1.75, color: '#9CA3AF' }}>{children}</div>
    </section>
  );
}

function Divider() {
  return (<div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 1.5rem' }}><div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} /></div>);
}

function ProjectPill({ emoji, name, desc, status }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.25rem 1.5rem', marginBottom: '1rem' }}>
      <span style={{ fontSize: '1.75rem', lineHeight: 1, flexShrink: 0, marginTop: '0.1rem' }}>{emoji}</span>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
          <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#F9FAFB' }}>{name}</span>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.2rem 0.6rem', borderRadius: '99px', background: status === 'live' ? 'rgba(52,211,153,0.15)' : 'rgba(96,165,250,0.15)', color: status === 'live' ? '#34D399' : '#60A5FA', border: `1px solid ${status === 'live' ? 'rgba(52,211,153,0.3)' : 'rgba(96,165,250,0.3)'}` }}>{status === 'live' ? '● live' : '● building'}</span>
        </div>
        <p style={{ fontSize: '0.95rem', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>{desc}</p>
      </div>
    </div>
  );
}

function StatRow({ stats }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', margin: '2rem 0' }}>
      {stats.map(({ value, label }) => (
        <div key={label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1.25rem 1rem', textAlign: 'center' }}>
          <div style={{ fontSize: 'clamp(1.6rem, 4vw, 2rem)', fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.02em' }}>{value}</div>
          <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginTop: '0.25rem' }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

export default function DemoPage() {
  const [ref, visible] = useReveal(0.05);
  return (
    <div style={{ background: '#080C14', minHeight: '100vh', fontFamily: "var(--font-inter), 'Inter', -apple-system, sans-serif", color: '#F9FAFB', overflowX: 'hidden' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(26,86,219,0.18) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <section ref={ref} style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '6rem 1.5rem 4rem', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 1s ease, transform 1s ease', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(26,86,219,0.15)', border: '1px solid rgba(26,86,219,0.35)', borderRadius: '99px', padding: '0.4rem 1rem', marginBottom: '2rem', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#93B4F7' }}>
            <span style={{ fontSize: '0.9rem' }}>🎯</span>
            Agents in Action Night Prague #3 · May 20, 2026
          </div>
          <h1 style={{ fontSize: 'clamp(2.8rem, 10vw, 6.5rem)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.04em', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #F9FAFB 0%, #93B4F7 60%, #60A5FA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Building with<br />an AI dev<br />from my phone
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: '#6B7280', maxWidth: '520px', lineHeight: 1.6, marginBottom: '3rem' }}>
            A procurement manager at Škoda Auto. Three kids (almost four). Zero free time. This is how I shipped anyway.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src="/patrik.jpg" alt="Patrik Přikryl" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.1)' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#E5E7EB' }}>Patrik Přikryl</div>
              <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Procurement · Škoda Auto · Prague</div>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', animation: 'bounce 2s infinite' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
          </div>
        </section>
        <Divider />
        <Chapter number="1" emoji="⏰" title="The Honest Problem">
          <p>I work in procurement at Škoda Auto — think spreadsheets, negotiations, suppliers, and meetings from 8am to whenever the kids go to sleep.</p>
          <p style={{ marginTop: '1rem' }}>Speaking of kids: I have three. The fourth is arriving soon.</p>
          <StatRow stats={[{ value: '3+', label: 'Kids' }, { value: '~0h', label: 'Free time / day' }, { value: '∞', label: 'Side project ideas' }]} />
          <p>Classic setup. Tons of ideas, zero runway to actually build them.</p>
        </Chapter>
        <Divider />
        <Chapter number="2" emoji="💻" title="Enter Claude Code">
          <p>I discovered Claude Code — Anthropic&apos;s CLI tool that lets you hand off coding tasks to an AI agent in your terminal.</p>
          <p style={{ marginTop: '1rem' }}>It was incredible. I could describe what I wanted and it just... built it. But there was a catch: I had to be at my computer. Which, see Chapter 1.</p>
          <p style={{ marginTop: '1rem' }}>I&apos;d start something in the evening, get interrupted by bedtime routines, come back to a terminal that had timed out. There had to be a better way.</p>
        </Chapter>
        <Divider />
        <Chapter number="3" emoji="💡" title="The Phone Idea">
          <p style={{ fontStyle: 'italic', color: '#D1D5DB', fontSize: '1.25rem', marginBottom: '1rem' }}>&quot;What if the agent ran on a server at home, and I just texted it tasks from my phone?&quot;</p>
          <p>Not a new idea. But suddenly it felt very achievable. I needed always-on compute, a good chat interface, and an agent that could actually ship code while I was in a supplier meeting.</p>
        </Chapter>
        <Divider />
        <Chapter number="4" emoji="🖥️" title="The Machine">
          <p>I bought a <strong style={{ color: '#E5E7EB' }}>Dell OptiPlex 5090 Micro</strong> — a tiny but capable little box that sits in my home office, always on, always ready.</p>
          <p style={{ marginTop: '1rem' }}>WSL2, Git, Node.js, Python. The whole dev stack. And crucially: a Claude MAX subscription pointed at it.</p>
          <StatRow stats={[{ value: '24/7', label: 'Uptime' }, { value: '0', label: 'Permission prompts left' }, { value: '100%', label: 'Couch deployable' }]} />
        </Chapter>
        <Divider />
        <Chapter number="5" emoji="🤝" title="The Choice: Claude Dispatch" accent>
          <p>At the previous meetup someone asked: <em style={{ color: '#D1D5DB' }}>&quot;Which framework are you using for agents?&quot;</em></p>
          <p style={{ marginTop: '1rem' }}>I&apos;d been going back and forth — n8n, CrewAI, LangGraph... After that conversation and a lot of experimenting, I landed on <strong style={{ color: '#60A5FA' }}>Claude Dispatch</strong> (Anthropic&apos;s own agentic system inside the Claude desktop app).</p>
          <p style={{ marginTop: '1rem' }}>The reason: it starts code sessions in isolated git worktrees, can run scheduled tasks, and the mobile interface is exactly what I needed — just type, and the agent does the rest while I go parent my children.</p>
          <p style={{ marginTop: '1rem' }}>Pro → MAX subscription. Gradually removed every &quot;are you sure?&quot; dialog. I now have Claude that almost never asks for confirmation — it just ships.</p>
        </Chapter>
        <Divider />
        <Chapter emoji="🎮" title="Family Plot Twist" number={null}>
          <div style={{ background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <p style={{ color: '#FCD34D', fontWeight: 600, marginBottom: '0.5rem' }}>⚠️ Parenting Achievement Unlocked</p>
            <p style={{ color: '#9CA3AF' }}>I banned my son from playing Minecraft. Classic dad move.</p>
          </div>
          <p>He noticed my Claude MAX subscription. Looked at me. Looked at the subscription. <em style={{ color: '#D1D5DB' }}>&quot;Dad, can I use this to build my own Minecraft?&quot;</em></p>
          <p style={{ marginTop: '1rem' }}>Reader, I let him.</p>
          <p style={{ marginTop: '1rem' }}>He&apos;s now 11 years old and actively developing a Minecraft-inspired game using Claude as his developer. Somewhere in this story, the student became the teacher. Or the teacher became the student. I&apos;m genuinely not sure anymore.</p>
          <p style={{ marginTop: '1rem', color: '#6B7280' }}>The MAX plan now has two active users in this household. Send help (or a bigger plan).</p>
        </Chapter>
        <Divider />
        <Chapter number="6" emoji="🌱" title="The Projects">
          <p>So what&apos;s actually being built? A few things running in parallel, all dispatched from my phone:</p>
          <div style={{ marginTop: '1.5rem' }}>
            <ProjectPill emoji="📌" name="GardenPin" desc="A garden planning tracker for seasonal tasks — when to prune the apple trees, when to repot tomatoes. Claude built the full-stack app (React + Express + SQLite) including an iOS-style redesign I requested during a commute." status="building" />
            <ProjectPill emoji="🩺" name="Zdravotní Analyzátor" desc="A private, offline health tracker for the family. Upload lab results, local AI (Ollama running on the same Dell) explains what's outside normal range. Built for us, no cloud, no data leaks." status="building" />
            <ProjectPill emoji="🌐" name="patrikprikryl.com" desc="This website. Built, redesigned, and maintained entirely by Claude. Including the page you're reading right now, which was created the night before this demo." status="live" />
          </div>
        </Chapter>
        <Divider />
        <Chapter number="7" emoji="📱" title="The Demo Is the Demo">
          <p style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', color: '#E5E7EB', lineHeight: 1.6 }}>You&apos;re looking at the demo right now.</p>
          <p style={{ marginTop: '1.25rem' }}>This page was built last night. I described it to Claude from my phone — &quot;create a showcase page for my meetup talk tomorrow, tell my story, make it scroll well on a projector.&quot; This is what came back.</p>
          <p style={{ marginTop: '1.25rem' }}>No Figma. No design sprints. No CSS debugging at 2am. Just a message and a commit notification.</p>
          <p style={{ marginTop: '1.25rem', fontStyle: 'italic', color: '#6B7280' }}>The entire website (blog, projects, contact, RSS feed, i18n in 3 languages) — all built this way.</p>
        </Chapter>
        <Divider />
        <Chapter number="8" emoji="🔮" title="The Prophecy" accent>
          <p>Here&apos;s what I believe is coming, and I think it&apos;s closer than most people in corporate environments realize:</p>
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { icon: '🏭', text: "Autonomous agents will enter large enterprises. Not as tools — as colleagues. They'll have tasks, deadlines, and accountability." },
              { icon: '🚗', text: "A company like Škoda Auto — 40,000 people, hundreds of suppliers, millions of procurement decisions per year — is exactly the kind of environment where this pays off at scale." },
              { icon: '🔐', text: "The bottleneck won't be the AI. It'll be security, compliance, and getting legal to approve the first agentic workflow. (I'm working on that too.)" },
              { icon: '⏳', text: "The people who understand how to work with agents today will be the ones designing those corporate workflows in 3 years." },
            ].map(({ icon, text }) => (
              <div key={icon} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'rgba(96,165,250,0.05)', border: '1px solid rgba(96,165,250,0.1)', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{icon}</span>
                <p style={{ color: '#9CA3AF', lineHeight: 1.6, margin: 0 }}>{text}</p>
              </div>
            ))}
          </div>
        </Chapter>
        <Divider />
        <ClosingSection />
      </div>
      <style>{`
        @keyframes bounce { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }
        p { margin: 0; }
      `}</style>
    </div>
  );
}

function ClosingSection() {
  const [ref, visible] = useReveal();
  return (
    <section ref={ref} style={{ padding: '6rem 1.5rem 8rem', maxWidth: '760px', margin: '0 auto', textAlign: 'center', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>👋</div>
      <h2 style={{ fontSize: 'clamp(1.6rem, 5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#F9FAFB', marginBottom: '1.25rem', lineHeight: 1.2 }}>
        Thanks for watching me<br />scroll through my life choices
      </h2>
      <p style={{ fontSize: '1.1rem', color: '#6B7280', lineHeight: 1.7, marginBottom: '2.5rem' }}>
        Happy to talk agents, dispatch setups, autonomous workflows, or why banning kids from Minecraft is a terrible idea. Find me after the talk.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#1A56DB', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>Visit the site →</Link>
        <a href="https://github.com/RubbySource" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.06)', color: '#9CA3AF', padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>GitHub</a>
      </div>
      <p style={{ marginTop: '3rem', fontSize: '0.75rem', color: '#374151' }}>
        Built by Claude Dispatch · patrikprikryl.com/demo · Agents in Action Night Prague #3
      </p>
    </section>
  );
}
