import { NextResponse } from 'next/server';
import { addSubscriber } from '@/lib/subscribers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getIp(request) {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return request.headers.get('x-real-ip') || null;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const email =
    typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 },
    );
  }

  const name =
    typeof body?.name === 'string' ? body.name.trim().slice(0, 200) : '';

  try {
    const { duplicate } = await addSubscriber({
      email,
      name: name || null,
      ip: getIp(request),
    });
    if (duplicate) {
      return NextResponse.json(
        { error: 'You are already subscribed.', duplicate: true },
        { status: 409 },
      );
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error('[subscribe] storage error', err);
    return NextResponse.json(
      { error: 'Could not save subscription. Please try again later.' },
      { status: 500 },
    );
  }
}
