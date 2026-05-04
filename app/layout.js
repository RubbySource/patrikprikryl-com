import { Inter, Sora, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Analytics from '@/components/Analytics';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

const sora = Sora({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-sora',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
});

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

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Patrik Přikryl',
  jobTitle: 'AI Project Manager',
  description: 'AI Project Manager at Škoda Auto with 13+ years in procurement. Pioneering AI-powered negotiation tools and digital transformation in automotive purchasing.',
  image: 'https://patrikprikryl.com/patrik.jpg',
  worksFor: {
    '@type': 'Organization',
    name: 'Škoda Auto',
    url: 'https://www.skoda-auto.com',
  },
  url: 'https://patrikprikryl.com',
  sameAs: [
    'https://www.linkedin.com/in/patrikprikryl',
    'https://github.com/RubbySource',
  ],
  knowsAbout: [
    'Artificial Intelligence',
    'Procurement Automation',
    'Automated Negotiation',
    'Digital Transformation',
    'AI Project Management',
    'Connected Car Sourcing',
  ],
  award: [
    'Jiří Polák Award – IT Project of the Year 2023 (CACIO)',
    'Purchaser of the Year 2021 (Škoda Auto)',
  ],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Patrik Přikryl',
  url: 'https://patrikprikryl.com',
  inLanguage: ['en', 'cs', 'de'],
  author: { '@type': 'Person', name: 'Patrik Přikryl' },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
