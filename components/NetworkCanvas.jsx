'use client';

import { useEffect, useRef } from 'react';

const NODE_COUNT = 65;
const MAX_DIST = 190;
const SPEED = 0.22;
const PULSE_INTERVAL = 450; // ms between new pulse signals

export default function NetworkCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let rafId;
    let nodes = [];
    let pulses = []; // traveling signal dots

    const setSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const initNodes = () => {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r: Math.random() * 1.4 + 0.6,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    // Try to spawn a pulse along a random connected pair
    const trySpawnPulse = () => {
      for (let attempt = 0; attempt < 30; attempt++) {
        const i = Math.floor(Math.random() * nodes.length);
        const j = Math.floor(Math.random() * nodes.length);
        if (i === j) continue;
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (dx * dx + dy * dy < MAX_DIST * MAX_DIST) {
          pulses.push({ i, j, t: 0 });
          return;
        }
      }
    };

    let lastPulseTs = 0;

    const draw = (ts) => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Spawn pulses on interval
      if (ts - lastPulseTs > PULSE_INTERVAL) {
        trySpawnPulse();
        if (Math.random() > 0.45) trySpawnPulse(); // occasionally spawn 2
        lastPulseTs = ts;
      }

      // Move nodes + bounce off edges
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        n.phase += 0.011;
        if (n.x < 0 || n.x > W) { n.vx *= -1; n.x = Math.max(0, Math.min(W, n.x)); }
        if (n.y < 0 || n.y > H) { n.vy *= -1; n.y = Math.max(0, Math.min(H, n.y)); }
      }

      // Draw static connection lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < MAX_DIST * MAX_DIST) {
            const dist = Math.sqrt(d2);
            const alpha = (1 - dist / MAX_DIST) * 0.16;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(26,86,219,${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // Advance pulse signals and draw them
      pulses = pulses.filter(p => p.t <= 1);
      for (const p of pulses) {
        p.t += 0.016;
        if (p.t > 1) continue;

        const ni = nodes[p.i];
        const nj = nodes[p.j];
        const dx = nj.x - ni.x;
        const dy = nj.y - ni.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > MAX_DIST) continue; // nodes drifted apart

        // Sin envelope so the pulse fades in and out
        const envelope = Math.sin(p.t * Math.PI);

        // Bright artery flash on this connection
        const lineAlpha = (1 - dist / MAX_DIST) * envelope * 0.55;
        ctx.beginPath();
        ctx.moveTo(ni.x, ni.y);
        ctx.lineTo(nj.x, nj.y);
        ctx.strokeStyle = `rgba(80,150,255,${lineAlpha.toFixed(3)})`;
        ctx.lineWidth = 1.3;
        ctx.stroke();

        // Traveling dot
        const px = ni.x + dx * p.t;
        const py = ni.y + dy * p.t;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,215,255,${(envelope * 0.9).toFixed(3)})`;
        ctx.fill();

        // Soft glow around the dot
        const grd = ctx.createRadialGradient(px, py, 0, px, py, 8);
        grd.addColorStop(0, `rgba(100,170,255,${(envelope * 0.3).toFixed(3)})`);
        grd.addColorStop(1, 'rgba(100,170,255,0)');
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      // Draw nodes
      for (const n of nodes) {
        const pulse = Math.sin(n.phase) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + pulse * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(26,86,219,${(0.22 + pulse * 0.28).toFixed(3)})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    setSize();
    initNodes();
    rafId = requestAnimationFrame(draw);

    const onResize = () => { setSize(); initNodes(); };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.28] dark:opacity-[0.55] z-0"
    />
  );
}
