#!/usr/bin/env node
/**
 * Bundle-size report + diff for the Next.js build.
 *
 * Self-contained: only Node builtins (fs, path). No runtime deps, so it can run
 * in CI right after `next build`.
 *
 * Source of truth = the `Route (app)` table that `next build` prints. We parse
 * it rather than re-deriving sizes from `.next` manifests, so the numbers in a
 * PR comment exactly match what the build logs (and Vercel) show — no "why does
 * the bot say 192 kB when the build says 171 kB" confusion.
 *
 * Two modes:
 *
 *   node scripts/bundle-size-report.js report <build-log> [out.json]
 *       Parse a captured `next build` log into a snapshot of First Load JS per
 *       route (+ the shared baseline). Writes <out.json> (default
 *       .next/analyze/__bundle_size.json) and prints a table.
 *
 *   node scripts/bundle-size-report.js compare <base.json> <head.json>
 *       Diff two snapshots and write a Markdown per-route Δ table to
 *       bundle-size-comment.md + stdout. Used by CI to comment on PRs.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

// --- config (from package.json → nextBundleAnalysis, with sane defaults) -------
function loadConfig() {
  const defaults = {
    // Per-route First Load JS budget, in bytes. 350 kB ≈ Lighthouse "good".
    budget: 350 * 1024,
    // Δ below this (bytes) is treated as noise and rendered as "—".
    // Next reports First Load JS at 1 kB resolution, so anything under ~1 kB
    // is below measurement granularity anyway.
    minimumChangeThreshold: 1024,
  };
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
    return { ...defaults, ...(pkg.nextBundleAnalysis || {}) };
  } catch {
    return defaults;
  }
}

// --- size helpers --------------------------------------------------------------
function sizeToBytes(token) {
  const m = /([\d.]+)\s*([kKMG]?)B/.exec(token);
  if (!m) return null;
  const mult = { '': 1, k: 1024, K: 1024, M: 1024 ** 2, G: 1024 ** 3 }[m[2]] ?? 1;
  return Math.round(parseFloat(m[1]) * mult);
}

function kb(bytes) {
  return `${(bytes / 1024).toFixed(bytes % 1024 === 0 ? 0 : 1)} kB`;
}

function signedKb(bytes) {
  const sign = bytes > 0 ? '+' : bytes < 0 ? '−' : '';
  return `${sign}${kb(Math.abs(bytes))}`;
}

function pct(delta, base) {
  if (!base) return '';
  return ` (${delta > 0 ? '+' : '−'}${Math.abs((delta / base) * 100).toFixed(1)}%)`;
}

// --- parse the `next build` route table ----------------------------------------
// Rows look like:  "├ ● /[locale]            26.8 kB         171 kB"
// Glyph (○ ● ƒ) marks a real route; sub-rows like "├   ├ /en" have no glyph and
// are skipped. The shared baseline is its own line.
function parseBuildLog(logText) {
  const routes = {};
  let shared = 0;

  const routeRe = /^[\s│┌├└─]*([○●ƒ])\s+(\S+)\s+([\d.]+\s*[kKMG]?B)\s+([\d.]+\s*[kKMG]?B)\s*$/;
  const sharedRe = /First Load JS shared by all\s+([\d.]+\s*[kKMG]?B)/;

  for (const line of logText.split(/\r?\n/)) {
    const s = sharedRe.exec(line);
    if (s) {
      shared = sizeToBytes(s[1]) ?? 0;
      continue;
    }
    const m = routeRe.exec(line);
    if (!m) continue;
    const route = m[2];
    const firstLoad = sizeToBytes(m[4]); // last column = First Load JS
    if (firstLoad == null) continue;
    routes[route] = firstLoad;
  }

  if (Object.keys(routes).length === 0) {
    throw new Error('No routes parsed from build log — did the `Route (app)` table change format?');
  }
  return { generatedAt: new Date().toISOString(), shared, routes };
}

// A route is worth showing if it ships route-specific JS (> shared baseline).
// Flat API / static rows all sit at the baseline and only add noise.
function isInteresting(firstLoad, shared) {
  return firstLoad > shared;
}

// --- report --------------------------------------------------------------------
function report(logFile, outFile) {
  const snapshot = parseBuildLog(fs.readFileSync(logFile, 'utf8'));
  const dest = outFile || path.join(ROOT, '.next', 'analyze', '__bundle_size.json');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, JSON.stringify(snapshot, null, 2));

  const cfg = loadConfig();
  const rows = Object.entries(snapshot.routes)
    .filter(([, v]) => isInteresting(v, snapshot.shared))
    .sort(([a], [b]) => a.localeCompare(b));

  /* eslint-disable no-console */
  console.log(`\nShared First Load JS: ${kb(snapshot.shared)}\n`);
  console.log('Route'.padEnd(40) + 'First Load JS');
  console.log('-'.repeat(58));
  for (const [route, v] of rows) {
    console.log(route.padEnd(40) + kb(v).padStart(10) + (v > cfg.budget ? '  ⚠ over budget' : ''));
  }
  console.log(`\nSnapshot written to ${path.relative(ROOT, dest)}\n`);
  /* eslint-enable no-console */
}

// --- compare -------------------------------------------------------------------
function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function compare(baseFile, headFile) {
  const cfg = loadConfig();
  const base = readJson(baseFile);
  const head = readJson(headFile);

  const allRoutes = [...new Set([...Object.keys(base.routes), ...Object.keys(head.routes)])].sort();

  let biggestRegression = 0;
  let anyOverBudget = false;
  const tableRows = [];

  for (const route of allRoutes) {
    const inBase = Object.prototype.hasOwnProperty.call(base.routes, route);
    const inHead = Object.prototype.hasOwnProperty.call(head.routes, route);
    const b = base.routes[route] ?? 0;
    const h = head.routes[route] ?? 0;
    const delta = h - b;

    // Only routes that ship route-specific JS are worth a line. API/static rows
    // all sit at the shared baseline — never interesting, even when added/removed.
    if (!isInteresting(b, base.shared) && !isInteresting(h, head.shared)) continue;

    const overBudget = inHead && h > cfg.budget;
    if (overBudget) anyOverBudget = true;
    // "Largest regression" tracks growth of existing routes — a brand-new route
    // isn't a regression of anything.
    if (inBase && inHead && delta > biggestRegression) biggestRegression = delta;

    let deltaCell;
    if (!inBase) deltaCell = '🆕 new';
    else if (!inHead) deltaCell = '🗑️ removed';
    else if (Math.abs(delta) < cfg.minimumChangeThreshold) deltaCell = '—';
    else deltaCell = `${delta > 0 ? '🔺' : '🟢'} ${signedKb(delta)}${pct(delta, b)}`;

    const headCell = overBudget ? `**${kb(h)}** ⚠️` : inHead ? kb(h) : '—';
    tableRows.push(`| \`${route}\` | ${inBase ? kb(b) : '—'} | ${headCell} | ${deltaCell} |`);
  }

  const lines = [];
  // Marker lets CI find + update one sticky comment instead of stacking new ones.
  lines.push('<!-- bundle-size-report -->');
  lines.push('### 📦 Bundle size — First Load JS');
  lines.push('');
  if (tableRows.length) {
    lines.push('| Route | Base | This PR | Δ |');
    lines.push('| :-- | --: | --: | --: |');
    lines.push(...tableRows);
  } else {
    lines.push('_No route-level changes to report._');
  }

  // Shared baseline moves every route at once — call it out separately.
  if (Math.abs(head.shared - base.shared) >= cfg.minimumChangeThreshold) {
    lines.push('');
    lines.push(
      `> ⚠️ Shared First Load JS: ${kb(base.shared)} → **${kb(head.shared)}** (${signedKb(head.shared - base.shared)}) — affects every route.`
    );
  }

  lines.push('');
  if (anyOverBudget) {
    lines.push(`⚠️ One or more routes exceed the ${kb(cfg.budget)} First Load JS budget.`);
  } else if (biggestRegression >= cfg.minimumChangeThreshold) {
    lines.push(`Largest regression this PR: **${signedKb(biggestRegression)}**. Within the ${kb(cfg.budget)} budget.`);
  } else {
    lines.push('✅ No meaningful First Load JS regressions.');
  }
  lines.push('');
  lines.push('<sub>Parsed from the <code>next build</code> route table · <code>scripts/bundle-size-report.js</code></sub>');

  const md = lines.join('\n');
  fs.writeFileSync(path.join(ROOT, 'bundle-size-comment.md'), md + '\n');
  process.stdout.write(md + '\n');
}

// --- main ----------------------------------------------------------------------
function main() {
  const [mode, ...rest] = process.argv.slice(2);

  if (mode === 'compare') {
    if (!rest[0] || !rest[1]) {
      console.error('Usage: bundle-size-report.js compare <base.json> <head.json>');
      process.exit(2);
    }
    compare(rest[0], rest[1]);
    return;
  }

  if (mode === 'report') {
    if (!rest[0]) {
      console.error('Usage: bundle-size-report.js report <build-log> [out.json]');
      process.exit(2);
    }
    report(rest[0], rest[1]);
    return;
  }

  console.error('Usage:\n  bundle-size-report.js report <build-log> [out.json]\n  bundle-size-report.js compare <base.json> <head.json>');
  process.exit(2);
}

main();
