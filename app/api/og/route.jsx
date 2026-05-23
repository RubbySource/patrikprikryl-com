import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const SIZE = { width: 1200, height: 630 };

const LOCALE_DATE = { cs: 'cs-CZ', de: 'de-DE', en: 'en-GB' };

function clip(value, max) {
  if (!value) return '';
  if (value.length <= max) return value;
  return value.slice(0, max - 1).trimEnd() + '…';
}

function formatDate(iso, locale) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(LOCALE_DATE[locale] ?? 'en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const kind = searchParams.get('kind') ?? 'home';
  const locale = searchParams.get('locale') ?? 'en';
  const title = clip(searchParams.get('title') ?? 'Patrik Přikryl', 110);
  const subtitle = clip(
    searchParams.get('subtitle') ?? 'AI Project Manager · Škoda Auto',
    140,
  );
  const date = searchParams.get('date') ?? '';
  const tag = (searchParams.get('tag') ?? '').toUpperCase();

  const isPost = kind === 'post';
  const titleSize = isPost
    ? title.length > 60
      ? 64
      : title.length > 35
        ? 76
        : 92
    : 104;

  const metaLine = isPost
    ? [tag, formatDate(date, locale)].filter(Boolean).join(' · ')
    : subtitle;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          color: '#F8FAFC',
          background:
            'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0F172A 100%)',
          fontFamily: 'system-ui, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '720px',
            height: '720px',
            background:
              'radial-gradient(circle at 80% 20%, rgba(56,189,248,0.22) 0%, rgba(15,23,42,0) 60%)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #1A56DB 0%, #38BDF8 100%)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '24px',
              letterSpacing: '2px',
            }}
          >
            PP
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              lineHeight: 1.2,
            }}
          >
            <span
              style={{
                fontSize: '22px',
                fontWeight: 600,
                color: '#F8FAFC',
                letterSpacing: '-0.2px',
              }}
            >
              Patrik Přikryl
            </span>
            <span
              style={{
                fontSize: '16px',
                fontWeight: 500,
                color: '#94A3B8',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              patrikprikryl.com
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {isPost && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '20px',
                fontWeight: 600,
                color: '#38BDF8',
                letterSpacing: '3px',
                textTransform: 'uppercase',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '2px',
                  background: '#38BDF8',
                }}
              />
              Blog
            </div>
          )}
          <div
            style={{
              fontSize: `${titleSize}px`,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-2px',
              color: '#F8FAFC',
              maxWidth: '1040px',
              display: 'flex',
            }}
          >
            {title}
          </div>
          {metaLine && (
            <div
              style={{
                fontSize: isPost ? '26px' : '34px',
                fontWeight: 500,
                color: '#94A3B8',
                lineHeight: 1.35,
                maxWidth: '1040px',
                display: 'flex',
              }}
            >
              {metaLine}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #1E293B',
            paddingTop: '24px',
            fontSize: '20px',
            color: '#64748B',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ display: 'flex' }}>PATRIKPRIKRYL.COM</span>
          <span style={{ display: 'flex' }}>
            {locale.toUpperCase()}
          </span>
        </div>
      </div>
    ),
    {
      ...SIZE,
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      },
    },
  );
}
