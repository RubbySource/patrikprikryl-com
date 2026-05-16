#!/usr/bin/env node
const { spawnSync } = require('child_process');

process.env.ANALYZE = 'true';

const result = spawnSync('next', ['build'], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

process.exit(result.status ?? 1);
