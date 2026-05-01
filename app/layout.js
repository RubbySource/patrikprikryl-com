import './globals.css';

export const metadata = {
  metadataBase: new URL('https://patrikprikryl.com'),
  title: 'Patrik Přikryl – AI Project Manager',
  description:
    'AI Project Manager at Škoda Auto. Driving intelligent procurement through automation, AI tools, and digital transformation.',
  openGraph: {
    title: 'Patrik Přikryl – AI Project Manager',
    description:
      'AI Project Manager at Škoda Auto. Driving intelligent procurement through automation, AI tools, and digital transformation.',
    url: 'https://patrikprikryl.com',
    siteName: 'Patrik Přikryl',
    images: [
      {
        url: '/og-default.svg',
        width: 1200,
        height: 630,
        type: 'image/svg+xml',
        alt: 'Patrik Přikryl – AI Project Manager · Škoda Auto',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Patrik Přikryl',
  jobTitle: 'AI Project Manager',
  description: 'AI Project Manager at Škoda Auto with 13+ years in procurement. Pioneering AI-powered negotiation tools and digital transformation in automotive purchasing.',
  worksFor: {
    '@type': 'Organization',
    name: 'Škoda Auto',
    url: 'https://www.skoda-auto.com',
  },
  url: 'https://patrikprikryl.com',
  sameAs: [
    'https://www.linkedin.com/in/patrikprikryl',
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

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
