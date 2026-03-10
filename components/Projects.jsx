'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslations } from 'next-intl';
import { projects } from '@/data/projects';

function ProjectCard({ project, index, t }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative group rounded-2xl p-6 sm:p-8 border transition-all duration-300
        ${project.featured
          ? 'bg-[#111111] dark:bg-white/5 border-[#1A56DB]/30 hover:border-[#1A56DB] shadow-lg shadow-blue-500/10 md:col-span-2'
          : 'bg-white dark:bg-[#141414] border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-xl hover:shadow-gray-100/50 dark:hover:shadow-black/20'
        }
      `}
    >
      {project.featured && (
        <span className="absolute top-4 right-4 text-xs font-semibold tracking-widest uppercase text-[#1A56DB] bg-[#1A56DB]/10 px-2.5 py-1 rounded-full">
          {t('featured')}
        </span>
      )}

      <div className="flex flex-col h-full gap-4">
        <div>
          <span className={`text-xs font-semibold tracking-wider uppercase mb-3 block ${
            project.featured ? 'text-blue-400' : 'text-[#6B7280]'
          }`}>
            {project.tag}
          </span>
          <h3 className={`font-display font-bold text-xl sm:text-2xl mb-3 ${
            project.featured ? 'text-white' : 'text-[#111111] dark:text-[#F0F0F0]'
          }`}>
            {project.title}
          </h3>
          <p className={`text-sm sm:text-base leading-relaxed ${
            project.featured ? 'text-gray-300' : 'text-[#6B7280] dark:text-gray-400'
          }`}>
            {project.description}
          </p>
        </div>

        <div className="mt-auto pt-2">
          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 hover:gap-3 ${
                project.featured ? 'text-[#1A56DB] hover:text-blue-400' : 'text-[#1A56DB] hover:text-[#1340B0]'
              }`}
            >
              {t('open')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ) : (
            <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${
              project.featured ? 'text-gray-400' : 'text-[#6B7280]'
            }`}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {t('internal')}
            </span>
          )}
        </div>
      </div>

      {/* Hover glow effect */}
      <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none ${
        project.featured
          ? 'shadow-[0_0_40px_rgba(26,86,219,0.15)]'
          : 'shadow-[0_8px_40px_rgba(0,0,0,0.08)]'
      }`} />
    </motion.div>
  );
}

export default function Projects() {
  const t = useTranslations('projects');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="projects" className="section-padding bg-gray-50/50 dark:bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-[#1A56DB] mb-4 block">
            {t('label')}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#111111] dark:text-[#F0F0F0]">
            {t('title')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
