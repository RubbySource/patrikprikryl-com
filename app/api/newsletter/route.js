import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Patrik Přikryl <newsletter@patrikprikryl.com>';
const ADMIN_FROM_EMAIL = 'onboarding@resend.dev';
const ADMIN_TO_EMAIL = process.env.NEWSLETTER_ADMIN_EMAIL || 'pt.rubby@gmail.com';
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'subscribers.json');

function readSubscribers() {
  try {
    if (!fs.existsSync(SUBSCRIBERS_FILE)) return [];
    const raw = fs.readFileSync(SUBSCRIBERS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSubscribers(list) {
  const dir = path.dirname(SUBSCRIBERS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(list, null, 2), 'utf8');
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function adminNotificationHtml({ name, email, allSubscribers }) {
  const rows = allSubscribers
    .map((s, i) => {
      const dateStr = s.subscribedAt
        ? new Date(s.subscribedAt).toISOString().replace('T', ' ').slice(0, 19)
        : '';
      return `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #E5E7EB;font-size:13px;color:#6B7280;">${i + 1}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #E5E7EB;font-size:13px;color:#111827;">${escapeHtml(s.name || '—')}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #E5E7EB;font-size:13px;color:#111827;">${escapeHtml(s.email)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #E5E7EB;font-size:13px;color:#6B7280;">${escapeHtml(dateStr)}</td>
        </tr>`;
    })
    .join('');

  return `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f7f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,0.04);">
            <tr>
              <td style="padding:32px 32px 8px 32px;">
                <div style="display:inline-block;padding:6px 12px;border-radius:999px;background:#EFF6FF;color:#1D4ED8;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">New subscriber</div>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 32px 8px 32px;">
                <h1 style="margin:0;font-size:22px;line-height:1.3;color:#111827;font-weight:700;">${escapeHtml(name || '(no name)')} just subscribed</h1>
                <p style="margin:6px 0 0 0;font-size:14px;color:#4B5563;"><a href="mailto:${escapeHtml(email)}" style="color:#1D4ED8;text-decoration:none;">${escapeHtml(email)}</a></p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 8px 32px;">
                <h2 style="margin:0 0 12px 0;font-size:15px;color:#111827;font-weight:600;">All subscribers (${allSubscribers.length})</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;border-collapse:separate;">
                  <thead>
                    <tr style="background:#F9FAFB;">
                      <th align="left" style="padding:8px 12px;font-size:11px;color:#6B7280;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid #E5E7EB;">#</th>
                      <th align="left" style="padding:8px 12px;font-size:11px;color:#6B7280;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid #E5E7EB;">Name</th>
                      <th align="left" style="padding:8px 12px;font-size:11px;color:#6B7280;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid #E5E7EB;">Email</th>
                      <th align="left" style="padding:8px 12px;font-size:11px;color:#6B7280;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid #E5E7EB;">Subscribed (UTC)</th>
                    </tr>
                  </thead>
                  <tbody>${rows}</tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 32px 32px;">
                <p style="margin:0;font-size:12px;color:#9CA3AF;">Sent from patrikprikryl.com newsletter API.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function adminNotificationText({ name, email, allSubscribers }) {
  const lines = allSubscribers.map((s, i) => {
    const dateStr = s.subscribedAt
      ? new Date(s.subscribedAt).toISOString().replace('T', ' ').slice(0, 19)
      : '';
    return `${i + 1}. ${s.name || '(no name)'} <${s.email}> — ${dateStr}`;
  });
  return [
    `New subscriber: ${name || '(no name)'} <${email}>`,
    '',
    `All subscribers (${allSubscribers.length}):`,
    ...lines,
  ].join('\n');
}

const welcomeHtml = `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f7f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,0.04);">
            <tr>
              <td style="padding:40px 40px 8px 40px;">
                <div style="display:inline-block;padding:6px 12px;border-radius:999px;background:#ECFDF5;color:#047857;font-size:12px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;">Welcome 🌱</div>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 40px 8px 40px;">
                <h1 style="margin:0;font-size:28px;line-height:1.2;color:#111827;font-weight:700;letter-spacing:-0.02em;">Thanks for subscribing.</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 40px 8px 40px;">
                <p style="margin:0;font-size:16px;line-height:1.65;color:#4B5563;">
                  You're now on the list. The first article is coming soon — short, honest notes on AI in procurement, side projects, and what I'm building.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 40px 40px 40px;">
                <p style="margin:0;font-size:16px;line-height:1.65;color:#4B5563;">— Patrik</p>
                <p style="margin:24px 0 0 0;font-size:13px;line-height:1.5;color:#9CA3AF;">
                  You signed up at <a href="https://patrikprikryl.com" style="color:#1A56DB;text-decoration:none;">patrikprikryl.com</a>. If this wasn't you, just ignore this email.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export async function POST(request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Newsletter is not configured yet.' },
      { status: 503 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const resend = new Resend(apiKey);

  if (AUDIENCE_ID) {
    const { error } = await resend.contacts.create({
      email,
      audienceId: AUDIENCE_ID,
      unsubscribed: false,
    });
    if (error && !/already exists|already in/i.test(error.message ?? '')) {
      return NextResponse.json({ error: 'Could not add you to the list.' }, { status: 502 });
    }
  }

  const subscribers = readSubscribers();
  const existing = subscribers.find((s) => s.email === email);
  if (!existing) {
    subscribers.push({ email, name: name || '', subscribedAt: new Date().toISOString() });
    try {
      writeSubscribers(subscribers);
    } catch (err) {
      console.error('Failed to write subscribers.json', err);
    }
  } else if (name && !existing.name) {
    existing.name = name;
    try {
      writeSubscribers(subscribers);
    } catch (err) {
      console.error('Failed to update subscribers.json', err);
    }
  }

  const { error: sendError } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Welcome — first article coming soon 🌱',
    html: welcomeHtml,
  });
  if (sendError) {
    return NextResponse.json({ error: 'Subscribed, but welcome email failed.' }, { status: 502 });
  }

  try {
    await resend.emails.send({
      from: ADMIN_FROM_EMAIL,
      to: ADMIN_TO_EMAIL,
      subject: `Nový subscriber: ${email}`,
      html: adminNotificationHtml({ name, email, allSubscribers: subscribers }),
      text: adminNotificationText({ name, email, allSubscribers: subscribers }),
    });
  } catch (err) {
    console.error('Admin notification failed', err);
  }

  return NextResponse.json({ ok: true });
}
