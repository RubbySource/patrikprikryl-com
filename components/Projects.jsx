'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
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

function ProjectCard({ project, index, totalCount, t, locale }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-6 min-h-[70vh] sm:min-h-[80vh]"
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

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
  );
}

function HobbyProjectCard({ project, index, locale, t }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      className="relative rounded-2xl overflow-hidden border border-emerald-900/40"
      style={{ background: `linear-gradient(145deg, ${project.bgFrom} 0%, ${project.bgTo} 100%)` }}
    >
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

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
        <h3 className="font-display font-bold text-3xl sm:text-4xl text-white leading-tight">
          {project.title[locale] ?? project.title.en}
        </h3>

        {/* Description */}
        <p className="text-sm text-white/70 leading-relaxed flex-1">
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
