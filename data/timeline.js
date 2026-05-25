// Career timeline / journey.
// Rendered by components/Timeline.jsx as an iOS-style vertical timeline.
// Entries are shown newest-first (the component sorts by `year` descending),
// so you can list them in any order here.
//
// Schema for each milestone:
// {
//   year: '2024',                       // string or number — also accepts ranges like '2018–2021'
//   role:        { en: '', cs: '', de: '' },   // job title / headline
//   company:     'Škoda Auto',          // string (or { en, cs, de } if it differs per locale)
//   location:    'Mladá Boleslav, CZ',  // optional — string or { en, cs, de }
//   description: { en: '', cs: '', de: '' },   // 1–2 sentence summary
//   type: 'work' | 'education' | 'project' | 'award',  // drives the dot color + icon
//   current: true,                      // optional — adds a "Now" pulse badge
// }
//
// ⚠️ Patrik: replace the two example milestones below with the real career
// history (roles, education, founding GardenPin, awards…). The section
// auto-hides when this array is empty, so it's safe to ship as-is.

export const timeline = [
  {
    year: '2024',
    role: {
      en: 'AI Project Manager',
      cs: 'AI Project Manager',
      de: 'AI Project Manager',
    },
    company: 'Škoda Auto',
    location: {
      en: 'Mladá Boleslav, Czechia',
      cs: 'Mladá Boleslav, Česko',
      de: 'Mladá Boleslav, Tschechien',
    },
    description: {
      en: 'Driving the integration of AI into procurement — from automated negotiation to digital avatars and agentic workflows.',
      cs: 'Vedu integraci AI do nákupu — od automatizovaného vyjednávání po digitální avatary a agentní workflow.',
      de: 'Treibe die Integration von KI in den Einkauf voran — von automatisierter Verhandlung bis zu digitalen Avataren und agentischen Workflows.',
    },
    type: 'work',
    current: true,
  },
  {
    year: '2023',
    role: {
      en: 'Founded GardenPin',
      cs: 'Založení GardenPinu',
      de: 'Gründung von GardenPin',
    },
    company: 'Side project',
    description: {
      en: 'Built a companion-planting garden planner with an offline-first canvas grid — a weekend idea that turned into a shipped product.',
      cs: 'Postavil jsem plánovač zahrady s doporučeními pro společenskou výsadbu a offline canvas mřížkou — z víkendového nápadu hotový produkt.',
      de: 'Habe einen Gartenplaner mit Mischkultur-Empfehlungen und Offline-Canvas-Raster gebaut — aus einer Wochenendidee wurde ein fertiges Produkt.',
    },
    type: 'project',
  },
];
