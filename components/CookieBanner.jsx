'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function CookieBanner() {
  const t = useTranslations('cookie');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
    // GA will load on next page interaction via GoogleAnalytics component check
    window.dispatchEvent(new Event('cookie-accepted'));
  };

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-xl"
        >
          <div className="bg-[#111111] dark:bg-[#1C1C1C] text-white rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-2xl shadow-black/20">
            <p className="text-sm text-gray-300 flex-1 leading-relaxed">
              {t('text')}
            </p>
            <div className="flex items-center gap-2.5 flex-shrink-0 w-full sm:w-auto">
              <button
                onClick={accept}
                className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-[#1A56DB] text-white text-sm font-semibold hover:bg-[#1340B0] active:scale-95 transition-all duration-200"
              >
                {t('accept')}
              </button>
              <button
                onClick={decline}
                className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-gray-600 text-gray-300 text-sm font-semibold hover:bg-white/5 active:scale-95 transition-all duration-200"
              >
                {t('decline')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
