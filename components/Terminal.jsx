'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

const PROMPT = 'patrik@portfolio:~$';

const GARDENPIN_ASCII = [
  '   ____                _            ____  _',
  '  / ___| __ _ _ __ __| | ___ _ __ |  _ \\(_)_ __',
  ' | |  _ / _` | \'__/ _` |/ _ \\ \'_ \\| |_) | | \'_ \\',
  ' | |_| | (_| | | | (_| |  __/ | | |  __/| | | | |',
  '  \\____|\\__,_|_|  \\__,_|\\___|_| |_|_|   |_|_| |_|',
  '',
  '       🌱 Pin plants. Tend gardens. Ship for joy.',
  '',
  '  status   : beta',
  '  stack    : React · Node.js · SQLite · PWA',
  '  repo     : github.com/RubbySource/gardenpin',
];

const SKILLS_ASCII = [
  '  AI Project Mgmt   ██████████  10/10',
  '  Procurement       ██████████  13+ yrs',
  '  Negotiation       █████████░   9/10',
  '  Python            ███████░░░   7/10',
  '  React / JS        ██████░░░░   6/10',
  '  Public Speaking   █████████░   9/10',
  '  Connecting people ██████████  ∞',
];

const COMMAND_LIST = [
  ['help', 'list available commands'],
  ['whoami', 'short bio'],
  ['projects', 'commercial & internal projects'],
  ['skills', 'what I can do'],
  ['contact', 'how to reach me'],
  ['gardenpin', 'about the side project'],
  ['clear', 'wipe the screen'],
  ['exit', 'leave the terminal'],
];

const COMMANDS = {
  help: () => [
    'Available commands:',
    '',
    ...COMMAND_LIST.map(([cmd, desc]) => `  ${cmd.padEnd(12)} ${desc}`),
    '',
    "Hint: try 'sudo hire patrik' 😉",
  ],
  whoami: () => [
    'Patrik Přikryl — AI Project Manager @ Škoda Auto',
    '',
    '  · 13+ years in procurement, 8+ leading IT/Connected Car tenders',
    '  · Pioneering AI-driven negotiation and digital transformation',
    '  · Speaker, evangelist, and connector of the right people',
  ],
  projects: () => [
    'Projects:',
    '',
    '  [01] Automated Negotiation     AI tool · TOP 8 IT Project of the Year 2023',
    '  [02] Hackathons & Events       innovation · community',
    '  [03] AI Evangelization         universities · industry talks',
    '  [04] GardenPin (hobby)         PWA · gardening · type "gardenpin"',
  ],
  skills: () => SKILLS_ASCII,
  contact: () => [
    'Contact:',
    '',
    '  email     pt.rubby@gmail.com',
    '  linkedin  https://www.linkedin.com/in/patrikprikryl',
    '  web       https://patrikprikryl.com',
  ],
  gardenpin: () => GARDENPIN_ASCII,
};

const BANNER = [
  '┌──────────────────────────────────────────────────────┐',
  '│  patrikprikryl.com — terminal mode                   │',
  "│  Type 'help' for a list of commands.                 │",
  "│  Press ESC or type 'exit' to return to the site.     │",
  '└──────────────────────────────────────────────────────┘',
  '',
];

export default function Terminal() {
  const router = useRouter();
  const locale = useLocale();
  const [lines, setLines] = useState(BANNER);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        router.push(`/${locale}`);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [router, locale]);

  function runCommand(raw) {
    const cmd = raw.trim();
    const echo = `${PROMPT} ${cmd}`;

    if (cmd) {
      setHistory((h) => [...h, cmd]);
      setHistoryIdx(-1);
    }

    if (cmd === '') {
      setLines((l) => [...l, PROMPT]);
      return;
    }

    if (cmd === 'clear') {
      setLines([]);
      return;
    }

    if (cmd === 'exit') {
      setLines((l) => [...l, echo, 'logout', '']);
      setTimeout(() => router.push(`/${locale}`), 300);
      return;
    }

    let output;
    if (cmd.toLowerCase() === 'sudo hire patrik') {
      output = [
        '[sudo] password for guest: ********',
        '',
        '  ╔══════════════════════════════════════════╗',
        '  ║  ACCESS GRANTED ✨                       ║',
        '  ║                                          ║',
        '  ║  Patrik is open to AI / procurement      ║',
        '  ║  collaborations, talks, and side work.   ║',
        '  ║                                          ║',
        '  ║  → pt.rubby@gmail.com                    ║',
        '  ║  → /in/patrikprikryl                     ║',
        '  ╚══════════════════════════════════════════╝',
      ];
    } else if (cmd.toLowerCase().startsWith('sudo')) {
      output = [`${cmd.split(' ')[0]}: ${cmd.split(' ').slice(1).join(' ') || 'a command'}: nice try, but no.`];
    } else {
      const handler = COMMANDS[cmd.toLowerCase()];
      output = handler
        ? handler()
        : [`bash: ${cmd}: command not found. Try 'help'.`];
    }

    setLines((l) => [...l, echo, ...output, '']);
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      runCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const next = historyIdx < 0 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(next);
      setInput(history[next]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx < 0) return;
      const next = historyIdx + 1;
      if (next >= history.length) {
        setHistoryIdx(-1);
        setInput('');
      } else {
        setHistoryIdx(next);
        setInput(history[next]);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }

  return (
    <main
      className="fixed inset-0 z-[60] bg-black text-emerald-400 font-mono text-sm overflow-hidden"
      style={{ fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", ui-monospace, monospace' }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Top bar with close hint */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-emerald-900/60 text-xs text-emerald-700">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="ml-3">patrik@portfolio — bash</span>
        </div>
        <button
          type="button"
          onClick={() => router.push(`/${locale}`)}
          className="text-emerald-700 hover:text-emerald-400 transition-colors"
          aria-label="Exit terminal"
        >
          [ ESC ] exit
        </button>
      </div>

      {/* Scrollable output */}
      <div
        ref={scrollRef}
        className="h-[calc(100vh-2.25rem)] overflow-y-auto px-4 sm:px-6 py-4 leading-relaxed whitespace-pre"
      >
        {lines.map((line, i) => (
          <div key={i}>{line || ' '}</div>
        ))}

        {/* Live input prompt */}
        <div className="flex items-center mt-1">
          <span className="text-emerald-500 shrink-0">{PROMPT}&nbsp;</span>
          <input
            ref={inputRef}
            type="text"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent border-0 outline-none text-emerald-400 caret-emerald-400 font-mono text-sm"
            aria-label="Terminal input"
          />
        </div>
      </div>
    </main>
  );
}
