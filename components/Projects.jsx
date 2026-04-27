'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { projects, hobbyProjects } from '@/data/projects';

// Two alternating directions — exit of card N == entry of card N+1, so spacing looks equal
const SLIDE_DIRECTIONS = [
  { x: ['-40%', '0%', '40%'], y: ['30%', '0%', '-30%'] },  // bottom-left → top-right
  { x: ['40%', '0%', '-40%'], y: ['-30%', '0%', '30%'] },  // top-right → bottom-left
];

function TechStackTags({ techStack }) {
  if (!techStack?.length) return null;
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-5">
      {techStack.map((tech) => (
        <span
          key={tech}
          className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/10 text-white/70 border border-white/15 backdrop-blur-sm"
        >
          {tech}
        </span>
      ))}
    </div>
  );
}

function ProjectScrollCard({ project, index, totalCount, t, locale }) {
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
              alt={project.title[locale] ?? project.title.en}
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
                {String(index + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
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
              <TechStackTags techStack={project.techStack} />
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}

function HobbyProjectCard({ project, index, locale }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      className="relative rounded-2xl overflow-hidden border border-emerald-900/40"
      style={{ background: `linear-gradient(145deg, ${project.bgFrom} 0%, ${project.bgTo} 100%)` }}
    >
