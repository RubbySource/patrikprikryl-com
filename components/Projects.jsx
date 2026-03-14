'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { projects } from '@/data/projects';

function ProjectScrollCard({ project, index, t }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Přímý transform bez spring — plynulý 1:1 se scrollem, žádný lag
  const scale = useTransform(
    scrollYProgress,
    [0, 0.28, 0.72, 1],
    [0.6, 1, 1, 0.6]
  );

  const borderRadius = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [28, 0, 0, 28]
  );

  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.85, 0.55, 0.55, 0.85]
  );

  return (
    <div ref={ref} className="h-[180vh] relative">
      {/* Sticky container — stays in place while scroll happens */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          style={{ scale, borderRadius, willChange: 'transform' }}
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
            className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"
          />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-8 sm:p-12 lg:p-16">
            {/* Top row */}
            <div className="flex items-start justify-between">
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

            {/* Bottom content */}
            <div>
              <span className="block text-xs font-semibold tracking-widest uppercase text-white/50 mb-4">
                {project.tag}
              </span>
              <h3 className="font-display font-bold text-5xl sm:text-6xl lg:text-8xl text-white mb-5 leading-[0.95] tracking-tight">
                {project.title}
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-white/60 max-w-2xl leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Projects() {
  const t = useTranslations('projects');

  return (
    <section id="projects" className="bg-[#FAFAFA] dark:bg-[#0A0A0A]">
      {/* Section header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 pb-8">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#1A56DB] mb-4 block">
          {t('label')}
        </span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#F0F0F0]">
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
          />
        ))}
      </div>

      <div className="pb-16 md:pb-24" />
    </section>
  );
}
