import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Patrik Přikryl <newsletter@patrikprikryl.com>';
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

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
    // Resend returns "already exists" as an error — treat that as success.
    if (error && !/already exists|already in/i.test(error.message ?? '')) {
      return NextResponse.json({ error: 'Could not add you to the list.' }, { status: 502 });
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

  return NextResponse.json({ ok: true });
}
