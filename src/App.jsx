import { useEffect, useMemo, useState } from 'react'
import './App.css'

const AREAS = [
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

const STATUSES = [
  { id: 'planned', label: 'Planned' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
]

const STORAGE_KEY = 'life-roadmap.goals.v1'

const CURRENT_YEAR = new Date().getFullYear()

const SEED_GOALS = [
  {
    id: 'seed-1',
    title: 'Get promoted to senior engineer',
    area: 'career',
    year: CURRENT_YEAR,
    status: 'in-progress',
    notes: 'Lead one major project and mentor a junior teammate.',
  },
  {
    id: 'seed-2',
    title: 'Run a half marathon',
    area: 'health',
    year: CURRENT_YEAR,
    status: 'planned',
    notes: 'Follow a 12-week training plan starting in spring.',
  },
  {
    id: 'seed-3',
    title: 'Build a 6-month emergency fund',
    area: 'finance',
    year: CURRENT_YEAR + 1,
    status: 'planned',
    notes: 'Automate savings transfers every payday.',
  },
  {
    id: 'seed-4',
    title: 'Take a solo trip abroad',
    area: 'adventure',
    year: CURRENT_YEAR + 1,
    status: 'planned',
    notes: '',
  },
  {
    id: 'seed-5',
    title: 'Read 24 books',
    area: 'growth',
    year: CURRENT_YEAR,
    status: 'in-progress',
    notes: 'Two per month — mix of fiction and non-fiction.',
  },
]

function loadGoals() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore corrupt storage
  }
  return SEED_GOALS
}

function areaById(id) {
  return AREAS.find((a) => a.id === id) ?? AREAS[0]
}

const EMPTY_DRAFT = {
  title: '',
  area: 'career',
  year: CURRENT_YEAR,
  status: 'planned',
  notes: '',
}

export default function App() {
  const [goals, setGoals] = useState(loadGoals)
  const [filter, setFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals))
  }, [goals])

  const visibleGoals = useMemo(
    () => (filter === 'all' ? goals : goals.filter((g) => g.area === filter)),
    [goals, filter],
  )

  const goalsByYear = useMemo(() => {
    const map = new Map()
    for (const goal of visibleGoals) {
      if (!map.has(goal.year)) map.set(goal.year, [])
      map.get(goal.year).push(goal)
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0])
  }, [visibleGoals])

  const stats = useMemo(() => {
    const total = goals.length
    const done = goals.filter((g) => g.status === 'done').length
    const inProgress = goals.filter((g) => g.status === 'in-progress').length
    const pct = total ? Math.round((done / total) * 100) : 0
    return { total, done, inProgress, pct }
  }, [goals])

  function openNew() {
    setDraft(EMPTY_DRAFT)
    setEditingId(null)
    setShowForm(true)
  }

  function openEdit(goal) {
    setDraft({ ...goal })
    setEditingId(goal.id)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setDraft(EMPTY_DRAFT)
  }

  function saveDraft(e) {
    e.preventDefault()
    if (!draft.title.trim()) return
    const clean = { ...draft, title: draft.title.trim(), year: Number(draft.year) }
    if (editingId) {
      setGoals((gs) => gs.map((g) => (g.id === editingId ? { ...clean, id: editingId } : g)))
    } else {
      setGoals((gs) => [...gs, { ...clean, id: crypto.randomUUID() }])
    }
    closeForm()
  }

  function deleteGoal(id) {
    setGoals((gs) => gs.filter((g) => g.id !== id))
    if (editingId === id) closeForm()
  }

  function cycleStatus(goal) {
    const order = STATUSES.map((s) => s.id)
    const next = order[(order.indexOf(goal.status) + 1) % order.length]
    setGoals((gs) => gs.map((g) => (g.id === goal.id ? { ...g, status: next } : g)))
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero__title">
          <span className="hero__emoji">🗺️</span>
          <div>
            <h1>Life Roadmap</h1>
            <p className="hero__sub">Map your goals across the years ahead.</p>
          </div>
        </div>

        <div className="stats">
          <Stat value={stats.total} label="Goals" />
          <Stat value={stats.inProgress} label="In progress" />
          <Stat value={`${stats.pct}%`} label="Complete" />
        </div>
      </header>

      <div className="progress">
        <div className="progress__bar" style={{ width: `${stats.pct}%` }} />
      </div>

      <div className="toolbar">
        <div className="filters">
          <button
            className={`chip ${filter === 'all' ? 'chip--active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          {AREAS.map((a) => (
            <button
              key={a.id}
              className={`chip ${filter === a.id ? 'chip--active' : ''}`}
              style={filter === a.id ? { borderColor: a.color, color: a.color } : undefined}
              onClick={() => setFilter(a.id)}
            >
              <span className="chip__icon">{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>
        <button className="btn btn--primary" onClick={openNew}>
          + Add goal
        </button>
      </div>

      {goalsByYear.length === 0 ? (
        <div className="empty">
          <p>No goals here yet.</p>
          <button className="btn btn--primary" onClick={openNew}>
            Add your first goal
          </button>
        </div>
      ) : (
        <div className="timeline">
          {goalsByYear.map(([year, items]) => (
            <section key={year} className="timeline__year">
              <div className="timeline__marker">
                <span className="timeline__dot" />
                <h2>{year}</h2>
              </div>
              <div className="cards">
                {items.map((goal) => {
                  const area = areaById(goal.area)
                  return (
                    <article
                      key={goal.id}
                      className={`card card--${goal.status}`}
                      style={{ '--card-accent': area.color }}
                    >
                      <div className="card__top">
                        <span className="card__area" style={{ color: area.color }}>
                          {area.icon} {area.label}
                        </span>
                        <button
                          className={`status status--${goal.status}`}
                          onClick={() => cycleStatus(goal)}
                          title="Click to change status"
                        >
                          {STATUSES.find((s) => s.id === goal.status)?.label}
                        </button>
                      </div>
                      <h3 className="card__title">{goal.title}</h3>
                      {goal.notes && <p className="card__notes">{goal.notes}</p>}
                      <div className="card__actions">
                        <button className="link" onClick={() => openEdit(goal)}>
                          Edit
                        </button>
                        <button className="link link--danger" onClick={() => deleteGoal(goal.id)}>
                          Delete
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal" onClick={closeForm}>
          <form className="sheet" onClick={(e) => e.stopPropagation()} onSubmit={saveDraft}>
            <h2>{editingId ? 'Edit goal' : 'New goal'}</h2>

            <label className="field">
              <span>Goal</span>
              <input
                autoFocus
                value={draft.title}
                placeholder="What do you want to achieve?"
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </label>

            <div className="field-row">
              <label className="field">
                <span>Area</span>
                <select
                  value={draft.area}
                  onChange={(e) => setDraft({ ...draft, area: e.target.value })}
                >
                  {AREAS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.icon} {a.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Target year</span>
                <input
                  type="number"
                  min={CURRENT_YEAR - 5}
                  max={CURRENT_YEAR + 30}
                  value={draft.year}
                  onChange={(e) => setDraft({ ...draft, year: e.target.value })}
                />
              </label>

              <label className="field">
                <span>Status</span>
                <select
                  value={draft.status}
                  onChange={(e) => setDraft({ ...draft, status: e.target.value })}
                >
                  {STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="field">
              <span>Notes</span>
              <textarea
                rows={3}
                value={draft.notes}
                placeholder="Why it matters, first steps, milestones…"
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              />
            </label>

            <div className="sheet__actions">
              <button type="button" className="btn" onClick={closeForm}>
                Cancel
              </button>
              <button type="submit" className="btn btn--primary">
                {editingId ? 'Save changes' : 'Add goal'}
              </button>
            </div>
          </form>
        </div>
      )}

      <footer className="footer">
        Saved locally in your browser · {stats.done} of {stats.total} goals complete
      </footer>
    </div>
  )
}

function Stat({ value, label }) {
  return (
    <div className="stat">
      <span className="stat__value">{value}</span>
      <span className="stat__label">{label}</span>
    </div>
  )
}
