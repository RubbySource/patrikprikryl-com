'use client';

import { useEffect } from 'react';
import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function GoogleAnalytics() {
  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (consent === 'accepted' && GA_ID) {
      loadGA();
    }

    const handler = () => {
      if (GA_ID) loadGA();
    };
    window.addEventListener('cookie-accepted', handler);
    return () => window.removeEventListener('cookie-accepted', handler);
  }, []);

  if (!GA_ID) return null;

  return null;
}

function loadGA() {
  if (window.gaLoaded) return;
  window.gaLoaded = true;

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', process.env.NEXT_PUBLIC_GA_ID);
}
