'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/data/projects';

// Two alternating directions — exit of card N == entry of card N+1, so spacing looks equal
const SLIDE_DIRECTIONS = [
  { x: ['-40%', '0%', '40%'], y: ['30%', '0%', '-30%'] },  // bottom-left → top-right
  { x: ['40%', '0%', '-40%'], y: ['-30%', '0%', '30%'] },  // top-right → bottom-left
];

function ProjectScrollCard({ project, index, t, locale }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const dir = SLIDE_DIRECTIONS[index % SLIDE_DIRECTIONS.length];

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 0.6]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.5, 1], [28, 0, 28]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 0.65, 0.95]);
  const x = useTransform(scrollYProgress, [0, 0.5, 1], dir.x);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], dir.y);

  return (
    <div ref={ref} className="h-[130vh] relative">
      {/* Sticky container — stays in place while scroll drives the animation */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          style={{ scale, borderRadius, x, y, willChange: 'transform' }}
          className="absolute inset-0 project-card-mask"
        >
          {/* Background — image or gradient */}
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(145deg, ${project.bgFrom} 0%, ${project.bgTo} 100%)`,
              }}
            />
          )}

          {/* Gradient overlay for text legibility */}
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"
          />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col p-8 sm:p-12 lg:p-16">

            {/* Top row — card counter + badges */}
            <div className="flex items-start justify-between flex-shrink-0">
              <span className="text-xs font-semibold tracking-widest uppercase text-white/40">
                {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
              </span>
              <div className="flex items-center gap-3">
                {project.featured && (
                  <span className="text-xs font-semibold tracking-widest uppercase text-white bg-[#1A56DB] px-3 py-1.5 rounded-full">
                    {t('featured')}
                  </span>
                )}
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-white transition-colors"
                    aria-label="Open project"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Vertically centred main content */}
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <span className="block text-xs font-semibold tracking-widest uppercase text-white/50 mb-5">
                {project.tag[locale] ?? project.tag.en}
              </span>
              <h3 className="font-display font-bold text-5xl sm:text-6xl lg:text-8xl text-white mb-6 leading-[0.95] tracking-tight max-w-5xl">
                {project.title[locale] ?? project.title.en}
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-white/85 max-w-2xl leading-relaxed px-5 py-3 rounded-2xl" style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}>
                {project.description[locale] ?? project.description.en}
              </p>

              {project.caseStudy && (
                <Link
                  href={`/${locale}${project.caseStudy}`}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 hover:bg-white text-white hover:text-[#0D4A2A] font-semibold text-sm backdrop-blur-md border border-white/20 transition-all duration-200 active:scale-95"
                >
                  Read case study
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Projects() {
  const t = useTranslations('projects');
  const locale = useLocale();

  return (
    <section id="projects">
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 pb-8">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#1A56DB] mb-4 block">
          {t('label')}
        </span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#111111] dark:text-[#F0F0F0]">
          {t('title')}
        </h2>
      </div>

      {/* Scroll gallery */}
      <div>
        {projects.map((project, index) => (
          <ProjectScrollCard
            key={index}
            project={project}
            index={index}
            t={t}
            locale={locale}
          />
        ))}
      </div>

      <div className="pb-16 md:pb-24" />
    </section>
  );
}
