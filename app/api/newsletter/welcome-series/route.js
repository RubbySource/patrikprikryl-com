import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { scheduleWelcomeSeries } from '@/lib/welcome-series';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Patrik Přikryl <newsletter@patrikprikryl.com>';

// Manual trigger for testing / re-sending the welcome series to a single address.
// Protected by NEWSLETTER_ADMIN_SECRET (header `x-admin-secret` or body `secret`).
// Unlike signup, this ignores NEWSLETTER_WELCOME_SERIES so it can be tested in isolation.
export async function POST(request) {
  const secret = process.env.NEWSLETTER_ADMIN_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Manual trigger disabled: NEWSLETTER_ADMIN_SECRET not set.' }, { status: 503 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const provided = request.headers.get('x-admin-secret') || body?.secret;
  if (provided !== secret) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const locale = typeof body?.locale === 'string' ? body.locale : 'en';
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY not set in this environment.' }, { status: 503 });
  }

  const resend = new Resend(apiKey);
  const { scheduled, errors } = await scheduleWelcomeSeries(resend, { email, locale, from: FROM_EMAIL });

  return NextResponse.json({ ok: errors.length === 0, scheduled, errors });
}
