import { promises as fs } from 'fs';
import path from 'path';

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const SET_KEY = 'subscribers:emails';
const HASH_PREFIX = 'subscriber:';

const FILE_PATH = path.join(process.cwd(), 'data', 'subscribers.json');

const useKv = Boolean(KV_URL && KV_TOKEN);

export function storageBackend() {
  return useKv ? 'vercel-kv' : 'fs-json';
}

async function kvCommand(args) {
  const res = await fetch(KV_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`KV ${args[0]} failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data.result;
}

async function readFileList() {
  try {
    const buf = await fs.readFile(FILE_PATH, 'utf8');
    const parsed = JSON.parse(buf);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeFileList(list) {
  await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
  await fs.writeFile(FILE_PATH, JSON.stringify(list, null, 2), 'utf8');
}

export async function addSubscriber({ email, name = null, ip = null }) {
  const entry = {
    email,
    name: name || null,
    ip: ip || null,
    createdAt: new Date().toISOString(),
  };

  if (useKv) {
    const added = await kvCommand(['SADD', SET_KEY, email]);
    if (!added) return { duplicate: true, entry: null };
    await kvCommand(['SET', HASH_PREFIX + email, JSON.stringify(entry)]);
    return { duplicate: false, entry };
  }

  const list = await readFileList();
  if (list.some((s) => s.email === email)) {
    return { duplicate: true, entry: null };
  }
  list.push(entry);
  await writeFileList(list);
  return { duplicate: false, entry };
}

export async function listSubscribers() {
  if (useKv) {
    const emails = await kvCommand(['SMEMBERS', SET_KEY]);
    if (!emails || emails.length === 0) return [];
    const keys = emails.map((e) => HASH_PREFIX + e);
    const values = await kvCommand(['MGET', ...keys]);
    return (values || [])
      .filter(Boolean)
      .map((raw) => {
        try {
          return typeof raw === 'string' ? JSON.parse(raw) : raw;
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  const list = await readFileList();
  return [...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
