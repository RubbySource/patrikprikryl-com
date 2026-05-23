'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { projects, hobbyProjects } from '@/data/projects';

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

const projectCardEase = [0.22, 1, 0.36, 1];

const projectCardHoverVariants = {
  rest: {},
  hover: {},
};

const projectMediaVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.06, transition: { duration: 0.9, ease: projectCardEase } },
};

const projectOverlayVariants = {
  rest: { opacity: 1 },
  hover: { opacity: 0.55, transition: { duration: 0.5, ease: projectCardEase } },
};

const projectGlowVariants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.5, ease: projectCardEase } },
};

const projectContentVariants = {
  rest: { y: 0 },
  hover: { y: -6, transition: { duration: 0.6, ease: projectCardEase } },
};

function ProjectCard({ project, index, totalCount, t, locale }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.008 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: projectCardEase }}
      variants={projectCardHoverVariants}
      whileHover="hover"
      animate="rest"
      className="group relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-6 min-h-[70vh] sm:min-h-[80vh] cursor-default will-change-transform"
    >
      {/* Background — image or gradient (scales on hover) */}
      <motion.div className="absolute inset-0" variants={projectMediaVariants}>
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
      </motion.div>

      {/* Gradient overlay for text legibility — fades a touch on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 pointer-events-none"
        variants={projectOverlayVariants}
      />

      {/* Accent glow that appears on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        variants={projectGlowVariants}
        style={{
          background: `radial-gradient(circle at 50% 60%, ${project.bgTo}55 0%, transparent 70%)`,
        }}
      />

      {/* Inner ring outline on hover */}
      <div className="absolute inset-0 rounded-3xl ring-0 ring-white/0 group-hover:ring-1 group-hover:ring-white/15 transition-[box-shadow,ring] duration-500 pointer-events-none" />

      {/* Content */}
      <motion.div
        className="absolute inset-0 flex flex-col p-8 sm:p-12 lg:p-16"
        variants={projectContentVariants}
      >

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

      </motion.div>
    </motion.div>
  );
}

function ProjectIcon({ kind }) {
  if (kind === 'health') {
    return (
      <svg className="w-12 h-12 text-pink-200/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 12h3l2-5 4 10 2-5h5.5" />
      </svg>
    );
  }
  return null;
}

const hobbyCardHoverVariants = {
  rest: {
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: projectCardEase },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.45, ease: projectCardEase },
  },
};

const hobbyGlowVariants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.4, ease: projectCardEase } },
};

function HobbyProjectCard({ project, index, locale, t }) {
  const tCase = useTranslations('caseStudy');
  const caseStudyHref = project.caseStudySlug
    ? (locale === 'en'
        ? `/projects/${project.caseStudySlug}`
        : `/${locale}/projects/${project.caseStudySlug}`)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: projectCardEase, delay: index * 0.1 }}
      variants={hobbyCardHoverVariants}
      whileHover="hover"
      animate="rest"
      className="group relative rounded-2xl overflow-hidden border border-emerald-900/40 hover:border-emerald-500/40 transition-colors duration-300 will-change-transform shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-emerald-900/30"
      style={{ background: `linear-gradient(145deg, ${project.bgFrom} 0%, ${project.bgTo} 100%)` }}
    >
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Hover accent glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        variants={hobbyGlowVariants}
        style={{
          background: `radial-gradient(circle at 50% 0%, ${project.bgTo}77 0%, transparent 60%)`,
        }}
      />

      {/* Decorative project icon (top-right) */}
      {project.icon && (
        <div className="pointer-events-none absolute top-5 right-5 opacity-30 group-hover:opacity-60 transition-opacity duration-500">
          <ProjectIcon kind={project.icon} />
        </div>
      )}

      <div className="relative z-10 p-7 sm:p-8 flex flex-col gap-4 min-h-[280px]">
        {/* Top badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-emerald-300 bg-emerald-900/50 border border-emerald-700/50 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {t('hobby_badge')}
            </span>
            {project.currentlyBuilding && (
              <span className="text-[10px] font-semibold tracking-wider uppercase text-white/50 border border-white/15 px-2.5 py-1 rounded-full">
                {t('in_progress_badge')}
              </span>
            )}
          </div>
          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>

        {/* Tag */}
        <span className="text-xs font-semibold tracking-widest uppercase text-white/40">
          {project.tag[locale] ?? project.tag.en}
        </span>

        {/* Title */}
        <h3 className="font-display font-bold text-3xl sm:text-4xl text-white leading-tight transition-transform duration-500 group-hover:translate-x-0.5">
          {project.title[locale] ?? project.title.en}
        </h3>

        {/* Description */}
        <p className="text-sm text-white/70 leading-relaxed flex-1 transition-colors duration-500 group-hover:text-white/85">
          {project.description[locale] ?? project.description.en}
        </p>

        {/* Tech stack */}
        {project.techStack?.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/10 text-white/60 border border-white/15"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Case study link */}
        {caseStudyHref && (
          <Link
            href={caseStudyHref}
            className="inline-flex items-center gap-1.5 mt-1 text-xs font-semibold tracking-wider uppercase text-emerald-300 hover:text-emerald-200 transition-colors group/link self-start"
          >
            {tCase('card_link')}
            <svg
              className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        )}
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const t = useTranslations('projects');
  const locale = useLocale();

  return (
    <section id="projects">
      {/* ── Commercial projects header ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 pb-8">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#1A56DB] mb-4 block">
          {t('label')}
        </span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#111111] dark:text-[#F0F0F0]">
          {t('title')}
        </h2>
      </div>

      {/* ── Commercial projects gallery ── */}
      <div>
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            project={project}
            index={index}
            totalCount={projects.length}
            t={t}
            locale={locale}
          />
        ))}
      </div>

      {/* ── Hobby projects section ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-semibold tracking-widest uppercase text-emerald-500">
            {t('hobby_label')}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#111111] dark:text-[#F0F0F0] mb-3">
          {t('hobby_title')}
        </h2>
        <p className="text-base text-[#6B7280] dark:text-gray-400 max-w-xl">
          {t('hobby_subtitle')}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {hobbyProjects.map((project, index) => (
            <HobbyProjectCard
              key={index}
              project={project}
              index={index}
              locale={locale}
              t={t}
            />
          ))}
        </div>
      </div>

      <div className="pb-16 md:pb-24" />
    </section>
  );
}
