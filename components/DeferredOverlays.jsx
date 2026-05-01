'use client';

import dynamic from 'next/dynamic';

const NetworkCanvas = dynamic(() => import('./NetworkCanvas'), { ssr: false });
const CookieBanner = dynamic(() => import('./CookieBanner'), { ssr: false });
const BackToTop = dynamic(() => import('./BackToTop'), { ssr: false });
const ScrollNav = dynamic(() => import('./ScrollNav'), { ssr: false });

export default function DeferredOverlays() {
  return (
    <>
      <NetworkCanvas />
      <CookieBanner />
      <BackToTop />
      <ScrollNav />
    </>
  );
}
