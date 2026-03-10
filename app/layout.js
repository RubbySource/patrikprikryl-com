import './globals.css';

export const metadata = {
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
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Patrik Přikryl – AI Project Manager',
    description:
      'AI Project Manager at Škoda Auto. Driving intelligent procurement through automation, AI tools, and digital transformation.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
  },
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
      </head>
      <body>{children}</body>
    </html>
  );
}
