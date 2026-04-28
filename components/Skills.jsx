'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslations } from 'next-intl';

const SKILLS = [
  { name: 'AI / ML',            level: 88, note: 'LLMs, RAG, agentic workflows' },
  { name: 'Project Management', level: 95, note: '13+ years procurement & IT' },
  { name: 'TypeScript',         level: 75, note: 'Day-to-day for side projects' },
  { name: 'Node.js',            level: 78, note: 'APIs, automation, tooling' },
  { name: 'React / Next.js',    level: 80, note: 'App Router, RSC, motion' },
  { name: 'PostgreSQL',         level: 70, note: 'Schema design, query tuning' },
  { name: 'Docker',             level: 65, note: 'Local-first ML, containers' },
  { name: 'Procurement',        level: 98, note: 'Strategic sourcing, negotiation' },
];

function SkillBar({ skill, delay, inView }) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <div>
          <div className="font-semibold text-[var(--text)] text-sm sm:text-base">
            {skill.name}
          </div>
          <div className="text-xs text-[var(--muted)] mt-0.5">{skill.note}</div>
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: delay + 0.6 }}
          className="text-sm font-mono font-bold text-[#1A56DB] tabular-nums"
        >
          {skill.level}%
        </motion.span>
      </div>

      <div className="relative h-2 rounded-full bg-[var(--muted)]/15 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#1A56DB] to-[#3B82F6] rounded-full"
        />
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={inView ? { width: `${skill.level}%`, opacity: [0, 0.6, 0] } : {}}
          transition={{ duration: 1.4, delay: delay + 0.1 }}
          className="absolute inset-y-0 left-0 bg-white/40 rounded-full blur-sm"
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const t = useTranslations('skills');
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="skills" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-semibold tracking-widest uppercase text-[#1A56DB] mb-4 block">
              {t('label')}
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[var(--text)] mb-6 leading-tight">
              {t('title')}
            </h2>
            <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed max-w-lg">
              {t('subtitle')}
            </p>
          </motion.div>

          {/* Bars */}
          <div className="space-y-6">
            {SKILLS.map((skill, i) => (
              <SkillBar
                key={skill.name}
                skill={skill}
                delay={i * 0.08}
                inView={inView}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
