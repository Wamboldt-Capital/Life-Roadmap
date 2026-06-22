export const CURRENT_YEAR = new Date().getFullYear()

export const AREAS = [
  { id: 'career', label: 'Career', color: 'var(--area-career)', icon: '💼' },
  { id: 'health', label: 'Health', color: 'var(--area-health)', icon: '🏃' },
  {
    id: 'relationships',
    label: 'Relationships',
    color: 'var(--area-relationships)',
    icon: '❤️',
  },
  { id: 'finance', label: 'Finance', color: 'var(--area-finance)', icon: '💰' },
  { id: 'growth', label: 'Growth', color: 'var(--area-growth)', icon: '🌱' },
  {
    id: 'adventure',
    label: 'Adventure',
    color: 'var(--area-adventure)',
    icon: '🧭',
  },
]

export const STATUSES = [
  { id: 'planned', label: 'Planned' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
]

export const MOODS = [
  { id: 'great', emoji: '😄', label: 'Great' },
  { id: 'good', emoji: '🙂', label: 'Good' },
  { id: 'okay', emoji: '😐', label: 'Okay' },
  { id: 'low', emoji: '😔', label: 'Low' },
  { id: 'rough', emoji: '😩', label: 'Rough' },
]

export const VALUE_COLORS = [
  '#ec4899',
  '#10b981',
  '#8b5cf6',
  '#f59e0b',
  '#06b6d4',
  '#5b6cff',
  '#ef4444',
  '#fb923c',
  '#0ea5e9',
  '#64748b',
]

export const SEED_VALUES = [
  {
    id: 'v-family',
    name: 'Family & Connection',
    color: '#ec4899',
    description: 'Be present for the people who matter most.',
  },
  {
    id: 'v-health',
    name: 'Health & Vitality',
    color: '#10b981',
    description: 'Take care of body and mind for the long run.',
  },
  {
    id: 'v-growth',
    name: 'Growth & Learning',
    color: '#8b5cf6',
    description: 'Stay curious. Get a little better every week.',
  },
  {
    id: 'v-creativity',
    name: 'Creativity & Craft',
    color: '#f59e0b',
    description: 'Make things. Practice the craft.',
  },
  {
    id: 'v-adventure',
    name: 'Adventure & Curiosity',
    color: '#06b6d4',
    description: 'Try new things. See new places.',
  },
  {
    id: 'v-stewardship',
    name: 'Financial Stewardship',
    color: '#5b6cff',
    description: 'Spend with intention. Build security.',
  },
]

export const SEED_GOALS = [
  {
    id: 'seed-1',
    title: 'Get promoted to senior engineer',
    area: 'career',
    year: CURRENT_YEAR,
    status: 'in-progress',
    notes: 'Lead one major project and mentor a junior teammate.',
    valueIds: ['v-growth'],
  },
  {
    id: 'seed-2',
    title: 'Run a half marathon',
    area: 'health',
    year: CURRENT_YEAR,
    status: 'planned',
    notes: 'Follow a 12-week training plan starting in spring.',
    valueIds: ['v-health'],
  },
  {
    id: 'seed-3',
    title: 'Build a 6-month emergency fund',
    area: 'finance',
    year: CURRENT_YEAR + 1,
    status: 'planned',
    notes: 'Automate savings transfers every payday.',
    valueIds: ['v-stewardship'],
  },
  {
    id: 'seed-4',
    title: 'Take a solo trip abroad',
    area: 'adventure',
    year: CURRENT_YEAR + 1,
    status: 'planned',
    notes: '',
    valueIds: ['v-adventure', 'v-growth'],
  },
  {
    id: 'seed-5',
    title: 'Read 24 books',
    area: 'growth',
    year: CURRENT_YEAR,
    status: 'in-progress',
    notes: 'Two per month — mix of fiction and non-fiction.',
    valueIds: ['v-growth'],
  },
]

export const SEED_ENTRIES = []

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function uid() {
  return crypto.randomUUID()
}

export function areaById(id) {
  return AREAS.find((a) => a.id === id) ?? AREAS[0]
}

export function valueById(values, id) {
  return values.find((v) => v.id === id)
}

export function prettyDate(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}
