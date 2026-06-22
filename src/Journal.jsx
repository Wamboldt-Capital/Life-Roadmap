import { useEffect, useMemo, useState } from 'react'
import {
  MOODS,
  todayISO,
  uid,
  valueById,
  areaById,
  prettyDate,
} from './data.js'

const PROMPTS = [
  'What went well today?',
  'How did I move toward my goals?',
  'What did I learn?',
  'Where did I feel out of alignment with my values?',
  'What am I grateful for?',
]

const emptyDraft = (date) => ({
  date,
  mood: '',
  body: '',
  valueIds: [],
  goalIds: [],
})

export default function Journal({ entries, setEntries, values, goals }) {
  const today = todayISO()
  const todaysEntry = useMemo(
    () => entries.find((e) => e.date === today),
    [entries, today],
  )
  const [draft, setDraft] = useState(() =>
    todaysEntry ? { ...todaysEntry } : emptyDraft(today),
  )
  const [showAll, setShowAll] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (todaysEntry && draft.id !== todaysEntry.id) {
      setDraft({ ...todaysEntry })
    }
  }, [todaysEntry, draft.id])

  const pastEntries = useMemo(
    () =>
      entries
        .filter((e) => e.date !== today)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [entries, today],
  )

  const streak = useMemo(() => computeStreak(entries, today), [entries, today])

  function saveDraft() {
    if (!draft.body.trim() && !draft.mood) return
    const clean = { ...draft, body: draft.body.trim() }
    setEntries((es) => {
      const existing = es.find((e) => e.date === clean.date)
      if (existing) {
        return es.map((e) =>
          e.date === clean.date ? { ...e, ...clean } : e,
        )
      }
      return [
        ...es,
        { id: uid(), createdAt: new Date().toISOString(), ...clean },
      ]
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  function toggle(list, id) {
    return list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
  }

  function deleteEntry(date) {
    setEntries((es) => es.filter((e) => e.date !== date))
    if (draft.date === date) setDraft(emptyDraft(today))
  }

  return (
    <>
      <header className="hero">
        <div className="hero__title">
          <span className="hero__emoji">📓</span>
          <div>
            <h1>Daily Journal</h1>
            <p className="hero__sub">
              Take a few minutes. What's on your mind today?
            </p>
          </div>
        </div>
        <div className="stats">
          <Stat value={entries.length} label="Entries" />
          <Stat value={streak} label="Day streak" />
        </div>
      </header>

      <section className="journal-today">
        <div className="journal-today__head">
          <h2>{prettyDate(today)}</h2>
          <div className="mood-row" role="group" aria-label="Mood">
            {MOODS.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`mood ${draft.mood === m.id ? 'mood--on' : ''}`}
                title={m.label}
                aria-label={m.label}
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    mood: d.mood === m.id ? '' : m.id,
                  }))
                }
              >
                {m.emoji}
              </button>
            ))}
          </div>
        </div>

        <details className="prompts-wrap">
          <summary>Need a prompt?</summary>
          <ul className="prompts">
            {PROMPTS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </details>

        <textarea
          className="journal-body"
          rows={8}
          value={draft.body}
          placeholder="Write whatever comes to mind…"
          onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
        />

        {values.length > 0 && (
          <div className="field">
            <span>Values you leaned into today</span>
            <div className="picker">
              {values.map((v) => {
                const on = draft.valueIds.includes(v.id)
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        valueIds: toggle(d.valueIds, v.id),
                      }))
                    }
                    className={`pick ${on ? 'pick--on' : ''}`}
                    style={
                      on ? { borderColor: v.color, color: v.color } : undefined
                    }
                  >
                    {v.name}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {goals.length > 0 && (
          <div className="field">
            <span>Goals you worked on</span>
            <div className="picker">
              {goals.map((g) => {
                const on = draft.goalIds.includes(g.id)
                const area = areaById(g.area)
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        goalIds: toggle(d.goalIds, g.id),
                      }))
                    }
                    className={`pick ${on ? 'pick--on' : ''}`}
                    style={
                      on
                        ? { borderColor: area.color, color: area.color }
                        : undefined
                    }
                  >
                    {area.icon} {g.title}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="sheet__actions sheet__actions--inline">
          {saved && <span className="saved-flash">Saved ✓</span>}
          <button
            type="button"
            className="btn btn--primary"
            onClick={saveDraft}
          >
            {todaysEntry ? "Update today's entry" : "Save today's entry"}
          </button>
        </div>
      </section>

      {pastEntries.length > 0 && (
        <section className="past">
          <h2 className="past__title">Past entries</h2>
          {(showAll ? pastEntries : pastEntries.slice(0, 5)).map((e) => {
            const mood = MOODS.find((m) => m.id === e.mood)
            const taggedValues = (e.valueIds || [])
              .map((id) => valueById(values, id))
              .filter(Boolean)
            const taggedGoals = (e.goalIds || [])
              .map((id) => goals.find((g) => g.id === id))
              .filter(Boolean)
            return (
              <article key={e.id} className="entry">
                <div className="entry__head">
                  <span className="entry__date">{prettyDate(e.date)}</span>
                  {mood && (
                    <span className="entry__mood" title={mood.label}>
                      {mood.emoji}
                    </span>
                  )}
                  <button
                    className="link link--danger entry__delete"
                    onClick={() => deleteEntry(e.date)}
                  >
                    Delete
                  </button>
                </div>
                {e.body && <p className="entry__body">{e.body}</p>}
                {(taggedValues.length > 0 || taggedGoals.length > 0) && (
                  <div className="entry__tags">
                    {taggedValues.map((v) => (
                      <span
                        key={v.id}
                        className="value-tag"
                        style={{ borderColor: v.color, color: v.color }}
                      >
                        {v.name}
                      </span>
                    ))}
                    {taggedGoals.map((g) => {
                      const area = areaById(g.area)
                      return (
                        <span
                          key={g.id}
                          className="value-tag"
                          style={{
                            borderColor: area.color,
                            color: area.color,
                          }}
                        >
                          {area.icon} {g.title}
                        </span>
                      )
                    })}
                  </div>
                )}
              </article>
            )
          })}
          {pastEntries.length > 5 && !showAll && (
            <button className="btn" onClick={() => setShowAll(true)}>
              Show all {pastEntries.length}
            </button>
          )}
        </section>
      )}
    </>
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

function computeStreak(entries, today) {
  if (entries.length === 0) return 0
  const dates = new Set(entries.map((e) => e.date))
  let streak = 0
  const d = new Date(today + 'T00:00:00')
  while (true) {
    const iso = d.toISOString().slice(0, 10)
    if (dates.has(iso)) {
      streak++
      d.setDate(d.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}
