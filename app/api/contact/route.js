import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'pt.rubby@gmail.com';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Patrik Přikryl <newsletter@patrikprikryl.com>';

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

const submissions = new Map();

function getClientIp(request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = submissions.get(ip);

  if (!entry || now - entry.firstAt > RATE_LIMIT_WINDOW_MS) {
    submissions.set(ip, { count: 1, firstAt: now });
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfterMs = RATE_LIMIT_WINDOW_MS - (now - entry.firstAt);
    return { allowed: false, retryAfterSec: Math.ceil(retryAfterMs / 1000) };
  }

  entry.count += 1;
  return { allowed: true };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildHtml({ name, email, message }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  return `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f7f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,0.04);">
            <tr>
              <td style="padding:32px 40px 8px 40px;">
                <div style="display:inline-block;padding:6px 12px;border-radius:999px;background:#EFF6FF;color:#1A56DB;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">New contact message</div>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 40px 8px 40px;">
                <h1 style="margin:0;font-size:22px;line-height:1.3;color:#111827;font-weight:700;">${safeName}</h1>
                <p style="margin:4px 0 0 0;font-size:14px;color:#6B7280;">${safeEmail}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 40px 32px 40px;">
                <div style="font-size:15px;line-height:1.6;color:#1F2937;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:12px;padding:16px 18px;">
                  ${safeMessage}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function POST(request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Contact form is not configured yet.' },
      { status: 503 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const message = typeof body?.message === 'string' ? body.message.trim() : '';

  if (name.length < 1 || name.length > 200) {
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > 320) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (message.length < 1 || message.length > 5000) {
    return NextResponse.json({ error: 'Please enter a message.' }, { status: 400 });
  }

  const ip = getClientIp(request);
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } },
    );
  }

  const resend = new Resend(apiKey);
  const subject = `New message from ${name} via patrikprikryl.com`;

  const { error: sendError } = await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: email,
    subject,
    html: buildHtml({ name, email, message }),
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  if (sendError) {
    return NextResponse.json({ error: 'Could not send your message. Please try again.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
