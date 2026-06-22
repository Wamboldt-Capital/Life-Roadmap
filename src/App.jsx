import { useEffect, useState } from 'react'
import './App.css'
import { SEED_GOALS, SEED_VALUES, SEED_ENTRIES } from './data.js'
import Roadmap from './Roadmap.jsx'
import Values from './Values.jsx'
import Journal from './Journal.jsx'

const STORAGE = {
  goals: 'life-roadmap.goals.v1',
  values: 'life-roadmap.values.v1',
  entries: 'life-roadmap.entries.v1',
  tab: 'life-roadmap.tab.v1',
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore corrupt storage
  }
  return fallback
}

function migrateGoals(goals) {
  return goals.map((g) => ({ valueIds: [], ...g }))
}

const TABS = [
  { id: 'roadmap', label: 'Roadmap', icon: '🗺️' },
  { id: 'values', label: 'Values', icon: '🧭' },
  { id: 'journal', label: 'Journal', icon: '📓' },
]

export default function App() {
  const [tab, setTab] = useState(() => load(STORAGE.tab, 'roadmap'))
  const [goals, setGoals] = useState(() =>
    migrateGoals(load(STORAGE.goals, SEED_GOALS)),
  )
  const [values, setValues] = useState(() => load(STORAGE.values, SEED_VALUES))
  const [entries, setEntries] = useState(() =>
    load(STORAGE.entries, SEED_ENTRIES),
  )

  useEffect(() => {
    localStorage.setItem(STORAGE.tab, JSON.stringify(tab))
  }, [tab])
  useEffect(() => {
    localStorage.setItem(STORAGE.goals, JSON.stringify(goals))
  }, [goals])
  useEffect(() => {
    localStorage.setItem(STORAGE.values, JSON.stringify(values))
  }, [values])
  useEffect(() => {
    localStorage.setItem(STORAGE.entries, JSON.stringify(entries))
  }, [entries])

  const doneCount = goals.filter((g) => g.status === 'done').length

  return (
    <div className="app">
      <header className="appbar">
        <div className="brand">
          <span className="brand__emoji">🗺️</span>
          <span className="brand__name">Life Roadmap</span>
        </div>
        <nav className="tabs" aria-label="Main">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`tab ${tab === t.id ? 'tab--active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span className="tab__icon" aria-hidden="true">
                {t.icon}
              </span>
              <span className="tab__label">{t.label}</span>
            </button>
          ))}
        </nav>
      </header>

      <main>
        {tab === 'roadmap' && (
          <Roadmap goals={goals} setGoals={setGoals} values={values} />
        )}
        {tab === 'values' && (
          <Values values={values} setValues={setValues} goals={goals} />
        )}
        {tab === 'journal' && (
          <Journal
            entries={entries}
            setEntries={setEntries}
            values={values}
            goals={goals}
          />
        )}
      </main>

      <footer className="footer">
        Saved locally in your browser · {doneCount} of {goals.length} goals
        complete · {entries.length} journal{' '}
        {entries.length === 1 ? 'entry' : 'entries'}
      </footer>
    </div>
  )
}
