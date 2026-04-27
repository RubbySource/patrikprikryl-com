'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { projects } from '@/data/projects';

function ProjectCard({ project, index, total, t, locale }) {
  const tag = project.tag[locale] ?? project.tag.en;
  const title = project.title[locale] ?? project.title.en;
  const description = project.description[locale] ?? project.description.en;

  const isExternal = !!project.url;
  const Wrapper = isExternal ? 'a' : 'article';
  const wrapperProps = isExternal
    ? {
        href: project.url,
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-label': `${title} — open in new tab`,
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      data-animate
      style={{
        '--card-accent': project.bgTo,
        '--reveal-delay': `${index * 100}ms`,
      }}
      className="project-card group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A56DB]"
    >
      {/* Background */}
      <div className="project-card__bg">
        {project.image ? (
          <Image
            src={project.image}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div
            style={{
              background: `linear-gradient(145deg, ${project.bgFrom} 0%, ${project.bgTo} 100%)`,
            }}
          />
        )}
      </div>
      <div className="project-card__overlay" />

      {/* Top row — counter + badges */}
      <div className="flex items-start justify-between gap-3">
        <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/50 mt-1">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {project.featured && (
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-white bg-[#1A56DB] px-3 py-1 rounded-full shadow-sm shadow-blue-500/20">
              {t('featured')}
            </span>
          )}
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/95 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
            {tag}
          </span>
        </div>
      </div>

      {/* Spacer keeps title pinned to the bottom */}
      <div className="flex-1" />

      {/* Title + description */}
      <div className="space-y-3 max-w-[44ch]">
        <h3 className="font-display font-bold text-3xl sm:text-4xl text-white leading-[1.05] tracking-tight">
          {title}
        </h3>
        <p className="text-sm sm:text-[15px] text-white/75 leading-relaxed">
          {description}
        </p>
      </div>

      {/* GitHub / external icon — subtle corner pill */}
      {isExternal && (
        <span
          aria-hidden="true"
          className="absolute bottom-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/75 transition-all duration-300 group-hover:text-white group-hover:bg-white/20 group-hover:border-white/40"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.16c-3.2.7-3.87-1.37-3.87-1.37-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.95 10.95 0 015.74 0c2.18-1.49 3.14-1.18 3.14-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.26 5.7.41.36.78 1.07.78 2.16v3.2c0 .31.2.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
          </svg>
        </span>
      )}
    </Wrapper>
  );
}

export default function Projects() {
  const t = useTranslations('projects');
  const locale = useLocale();

  return (
    <section id="projects" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 md:mb-16" data-animate>
          <span className="text-xs font-semibold tracking-widest uppercase text-[#1A56DB] mb-4 block">
            {t('label')}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#111111] dark:text-[#F0F0F0]">
            {t('title')}
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
              index={index}
              total={projects.length}
              t={t}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
