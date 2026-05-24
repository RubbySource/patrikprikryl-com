const SITE_URL = 'https://patrikprikryl.com';

export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Patrik Přikryl',
    jobTitle: 'AI Project Manager',
    description:
      'AI Project Manager at Škoda Auto with 13+ years in procurement. Pioneering AI-powered negotiation tools and digital transformation in automotive purchasing.',
    image: `${SITE_URL}/patrik.jpg`,
    url: SITE_URL,
    worksFor: {
      '@type': 'Organization',
      name: 'Škoda Auto',
      url: 'https://www.skoda-auto.com',
    },
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
}

export function websiteSchema(locale = 'en') {
  const langMap = { en: 'en-US', cs: 'cs-CZ', de: 'de-DE' };
  const path = locale === 'en' ? '/' : `/${locale}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}#website`,
    name: 'Patrik Přikryl',
    url: `${SITE_URL}${path}`,
    inLanguage: langMap[locale] ?? 'en-US',
    author: { '@type': 'Person', name: 'Patrik Přikryl' },
    publisher: { '@type': 'Person', name: 'Patrik Přikryl' },
  };
}

export function portfolioSchema(locale, projects) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Patrik Přikryl — Projects & Initiatives',
    itemListElement: projects.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'CreativeWork',
        name: p.title[locale] ?? p.title.en,
        description: p.description[locale] ?? p.description.en,
        url: p.url ?? `${SITE_URL}/${locale}#projects`,
        keywords: (p.techStack ?? []).join(', '),
      },
    })),
  };
}

export function contactPageSchema(locale = 'en') {
  const langMap = { en: 'en-US', cs: 'cs-CZ', de: 'de-DE' };
  const path = locale === 'en' ? '/contact' : `/${locale}/contact`;
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${SITE_URL}${path}#contactpage`,
    name: 'Contact — Patrik Přikryl',
    url: `${SITE_URL}${path}`,
    inLanguage: langMap[locale] ?? 'en-US',
    mainEntity: {
      '@type': 'Person',
      name: 'Patrik Přikryl',
      jobTitle: 'AI Project Manager',
      url: SITE_URL,
      sameAs: [
        'https://www.linkedin.com/in/patrikprikryl',
        'https://github.com/RubbySource',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Professional Inquiries',
        url: `${SITE_URL}${path}`,
        availableLanguage: ['English', 'Czech', 'German'],
        areaServed: 'Worldwide',
      },
    },
  };
}
