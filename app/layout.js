import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import Analytics from '@/components/Analytics';
import MotionProvider from '@/components/MotionProvider';
import StructuredData from '@/components/seo/StructuredData';
import { personSchema } from '@/components/seo/schemas';

const inter = { variable: 'font-inter' };

const sora = { variable: 'font-sora' };

const plusJakartaSans = { variable: 'font-pjs' };

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAFA' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
  ],
};

export const metadata = {
  metadataBase: new URL('https://patrikprikryl.com'),
  title: {
    default: 'Patrik Přikryl – AI Project Manager',
    template: '%s | Patrik Přikryl',
  },
  description:
    'AI Project Manager at Škoda Auto. Driving intelligent procurement through automation, AI tools, and digital transformation.',
  keywords: [
    'AI Project Manager',
    'Patrik Přikryl',
    'Škoda Auto',
    'AI procurement',
    'automated negotiation',
    'digital transformation',
    'connected car',
    'GardenPin',
  ],
  authors: [{ name: 'Patrik Přikryl', url: 'https://patrikprikryl.com' }],
  creator: 'Patrik Přikryl',
  publisher: 'Patrik Přikryl',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Patrik Přikryl – AI Project Manager',
    description:
      'AI Project Manager at Škoda Auto. Driving intelligent procurement through automation, AI tools, and digital transformation.',
    url: 'https://patrikprikryl.com',
    siteName: 'Patrik Přikryl',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'Patrik Přikryl – AI Project Manager · Škoda Auto',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Patrik Přikryl – AI Project Manager',
    description:
      'AI Project Manager at Škoda Auto. Driving intelligent procurement through automation and AI.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      suppressHydrationWarning
      className={`${inter.variable} ${sora.variable} ${plusJakartaSans.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <StructuredData data={personSchema()} />
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
