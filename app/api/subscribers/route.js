import { NextResponse } from 'next/server';
import { listSubscribers, storageBackend } from '@/lib/subscribers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_KEY = 'changeme';

export async function GET(request) {
  const expected = process.env.ADMIN_KEY || DEFAULT_KEY;
  const provided = request.headers.get('x-admin-key');
  if (!provided || provided !== expected) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const subscribers = await listSubscribers();
    return NextResponse.json(
      { count: subscribers.length, backend: storageBackend(), subscribers },
      { status: 200 },
    );
  } catch (err) {
    console.error('[subscribers] read error', err);
    return NextResponse.json(
      { error: 'Could not load subscribers.' },
      { status: 500 },
    );
  }
}
