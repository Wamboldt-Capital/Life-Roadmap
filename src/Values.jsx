import { useMemo, useState } from 'react'
import { uid, VALUE_COLORS, areaById } from './data.js'

const EMPTY_DRAFT = {
  name: '',
  description: '',
  color: VALUE_COLORS[0],
}

export default function Values({ values, setValues, goals }) {
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [showForm, setShowForm] = useState(false)

  const alignment = useMemo(() => {
    const byValue = new Map(values.map((v) => [v.id, []]))
    const orphans = []
    for (const g of goals) {
      const ids = g.valueIds || []
      if (ids.length === 0) {
        orphans.push(g)
      } else {
        for (const id of ids) {
          if (byValue.has(id)) byValue.get(id).push(g)
        }
      }
    }
    const totalLinked = goals.length - orphans.length
    const pct = goals.length
      ? Math.round((totalLinked / goals.length) * 100)
      : 0
    return { byValue, orphans, pct, totalLinked }
  }, [values, goals])

  function openNew() {
    setDraft({
      ...EMPTY_DRAFT,
      color: VALUE_COLORS[values.length % VALUE_COLORS.length],
    })
    setEditingId(null)
    setShowForm(true)
  }
  function openEdit(v) {
    setDraft({ ...v })
    setEditingId(v.id)
    setShowForm(true)
  }
  function closeForm() {
    setShowForm(false)
    setEditingId(null)
    setDraft(EMPTY_DRAFT)
  }
  function save(e) {
    e.preventDefault()
    if (!draft.name.trim()) return
    const clean = {
      ...draft,
      name: draft.name.trim(),
      description: draft.description.trim(),
    }
    if (editingId) {
      setValues((vs) =>
        vs.map((v) => (v.id === editingId ? { ...clean, id: editingId } : v)),
      )
    } else {
      setValues((vs) => [...vs, { ...clean, id: uid() }])
    }
    closeForm()
  }
  function del(id) {
    setValues((vs) => vs.filter((v) => v.id !== id))
    if (editingId === id) closeForm()
  }

  return (
    <>
      <header className="hero">
        <div className="hero__title">
          <span className="hero__emoji">🧭</span>
          <div>
            <h1>Your Values</h1>
            <p className="hero__sub">
              What do you want to be guided by? Tag goals to see alignment.
            </p>
          </div>
        </div>
        <div className="stats">
          <Stat value={values.length} label="Values" />
          <Stat value={alignment.totalLinked} label="Aligned goals" />
          <Stat value={`${alignment.pct}%`} label="Coverage" />
        </div>
      </header>

      <div className="progress">
        <div
          className="progress__bar"
          style={{ width: `${alignment.pct}%` }}
        />
      </div>

      <div className="toolbar toolbar--right">
        <button className="btn btn--primary" onClick={openNew}>
          + Add value
        </button>
      </div>

      {values.length === 0 ? (
        <div className="empty">
          <p>No values yet. Start with 3–5 you want to live by.</p>
          <button className="btn btn--primary" onClick={openNew}>
            Add your first value
          </button>
        </div>
      ) : (
        <div className="values-grid">
          {values.map((v) => {
            const linked = alignment.byValue.get(v.id) || []
            return (
              <article
                key={v.id}
                className="value-card"
                style={{ '--value-accent': v.color }}
              >
                <div className="value-card__top">
                  <h3 className="value-card__name">{v.name}</h3>
                  <span className="value-card__count">
                    {linked.length} {linked.length === 1 ? 'goal' : 'goals'}
                  </span>
                </div>
                {v.description && (
                  <p className="value-card__desc">{v.description}</p>
                )}
                {linked.length > 0 ? (
                  <ul className="linked-goals">
                    {linked.slice(0, 5).map((g) => (
                      <li key={g.id}>
                        <span
                          className="linked-goals__dot"
                          style={{ background: areaById(g.area).color }}
                        />
                        {g.title}
                      </li>
                    ))}
                    {linked.length > 5 && (
                      <li className="hint">+ {linked.length - 5} more</li>
                    )}
                  </ul>
                ) : (
                  <p className="hint">
                    No goals aligned yet — tag a goal on the Roadmap tab.
                  </p>
                )}
                <div className="card__actions">
                  <button className="link" onClick={() => openEdit(v)}>
                    Edit
                  </button>
                  <button
                    className="link link--danger"
                    onClick={() => del(v.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {alignment.orphans.length > 0 && (
        <section className="audit">
          <h2 className="audit__title">
            <span aria-hidden="true">⚠️</span> Goals not aligned to any value
          </h2>
          <p className="hint">
            Open these on the Roadmap tab and tag a value, or ask whether
            they're worth your time.
          </p>
          <ul className="orphans">
            {alignment.orphans.map((g) => {
              const area = areaById(g.area)
              return (
                <li key={g.id} className="orphan">
                  <span
                    className="orphan__area"
                    style={{ color: area.color }}
                  >
                    {area.icon}
                  </span>
                  <span className="orphan__title">{g.title}</span>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {showForm && (
        <div className="modal" onClick={closeForm}>
          <form
            className="sheet"
            onClick={(e) => e.stopPropagation()}
            onSubmit={save}
          >
            <h2>{editingId ? 'Edit value' : 'New value'}</h2>

            <label className="field">
              <span>Name</span>
              <input
                autoFocus
                value={draft.name}
                placeholder="e.g. Family & Connection"
                onChange={(e) =>
                  setDraft({ ...draft, name: e.target.value })
                }
              />
            </label>

            <label className="field">
              <span>Why it matters</span>
              <textarea
                rows={2}
                value={draft.description}
                placeholder="A sentence to ground this value…"
                onChange={(e) =>
                  setDraft({ ...draft, description: e.target.value })
                }
              />
            </label>

            <div className="field">
              <span>Color</span>
              <div className="swatches">
                {VALUE_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={`Color ${c}`}
                    className={`swatch ${draft.color === c ? 'swatch--on' : ''}`}
                    style={{ background: c }}
                    onClick={() => setDraft({ ...draft, color: c })}
                  />
                ))}
              </div>
            </div>

            <div className="sheet__actions">
              <button type="button" className="btn" onClick={closeForm}>
                Cancel
              </button>
              <button type="submit" className="btn btn--primary">
                {editingId ? 'Save changes' : 'Add value'}
              </button>
            </div>
          </form>
        </div>
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
