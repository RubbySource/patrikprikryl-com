'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslations } from 'next-intl';
import { collaborators, universityCollaborators } from '@/data/cocreators';

const avatarColors = [
  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
];

function PersonCard({ person, index, globalIndex }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const colorClass = avatarColors[globalIndex % avatarColors.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group bg-white dark:bg-[#141414] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-[#1A56DB]/20 dark:hover:border-[#1A56DB]/20 transition-all duration-300 hover:shadow-lg hover:shadow-gray-100/50 dark:hover:shadow-black/20"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-sm ${colorClass}`}>
          {person.initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="font-display font-semibold text-base text-[#111111] dark:text-[#F0F0F0] truncate">
              {person.name}
            </h3>
            <a
              href={person.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-[#6B7280] hover:text-[#1A56DB] transition-colors"
              aria-label={`${person.name} on LinkedIn`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
          <p className="text-sm text-[#6B7280] dark:text-gray-400 leading-relaxed">
            {person.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function CoCreators() {
  const t = useTranslations('cocreators');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="section-padding">
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

        {/* Collaborators */}
        <div className="mb-12">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#6B7280] mb-6">
            {t('collaborators_title')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collaborators.map((person, index) => (
              <PersonCard key={index} person={person} index={index} globalIndex={index} />
            ))}
          </div>
        </div>

        {/* University Collaboration */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#6B7280] mb-6">
            {t('university_title')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {universityCollaborators.map((person, index) => (
              <PersonCard
                key={index}
                person={person}
                index={index}
                globalIndex={index + collaborators.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
