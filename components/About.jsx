'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslations } from 'next-intl';

export default function About() {
  const t = useTranslations('about');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const tags = t.raw('tags');

  return (
    <section id="about" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-semibold tracking-widest uppercase text-[#1A56DB] mb-4 block">
              {t('label')}
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#111111] dark:text-[#F0F0F0] mb-8 leading-tight">
              {t('title')}
            </h2>
            <p className="text-lg text-[#4B5563] dark:text-gray-400 leading-relaxed mb-10">
              {t('text')}
            </p>

            {/* Focus tags */}
            <div className="flex flex-wrap gap-2.5">
              {tags.map((tag, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.06 }}
                  className="tag-pill font-medium"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
