import { useEffect, useState } from 'react'
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore'
import { db, WORKSHEETS_COLLECTION } from '../firebaseClient'

const AGE_LABEL = { young: '0–5 years', older: '6–12 years' }

function niceDate(iso) {
  if (!iso) return '—'
  return new Date(iso + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function Library({ onView, onEdit, refreshToken }) {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [ageFilter, setAgeFilter] = useState('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [search, setSearch] = useState('')

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const q = query(collection(db, WORKSHEETS_COLLECTION), orderBy('weekDate', 'desc'))
      const snap = await getDocs(q)
      setDocs(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [refreshToken])

  async function handleDelete(id) {
    if (!window.confirm('Delete this worksheet from the shared library? This cannot be undone.')) return
    try {
      await deleteDoc(doc(db, WORKSHEETS_COLLECTION, id))
      setDocs(prev => prev.filter(d => d.id !== id))
    } catch (err) {
      console.error(err)
      alert('Could not delete — please try again.')
    }
  }

  function clearFilters() {
    setAgeFilter('all'); setFromDate(''); setToDate(''); setSearch('')
  }

  const filtered = docs.filter(d => {
    if (ageFilter !== 'all' && d.ageGroup !== ageFilter) return false
    if (fromDate && d.weekDate < fromDate) return false
    if (toDate && d.weekDate > toDate) return false
    if (search) {
      const q = search.toLowerCase()
      const hay = `${d.theme || ''} ${d.topic || ''}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })

  return (
    <div className="stage">
      <div className="lib-wrap">
        <div className="lib-filters">
          <label>Age group
            <select value={ageFilter} onChange={e => setAgeFilter(e.target.value)}>
              <option value="all">All ages</option>
              <option value="young">0–5 years</option>
              <option value="older">6–12 years</option>
            </select>
          </label>
          <label>From
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
          </label>
          <label>To
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
          </label>
          <label>Search theme / topic
            <input type="text" placeholder="e.g. Noah" value={search} onChange={e => setSearch(e.target.value)} />
          </label>
          <button className="btn btn-ghost" onClick={clearFilters} type="button">Clear filters</button>
          <button className="btn btn-teal" onClick={load} type="button">↻ Refresh</button>
        </div>

        {loading && <div className="empty-state">Loading…</div>}
        {!loading && error && (
          <div className="empty-state">
            Could not load the library ({error}).<br />
            Check your Firebase config in .env.local and that Firestore rules allow read access.
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">No worksheets found. Save one from the editor, or adjust your filters.</div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="lib-grid">
            {filtered.map(d => (
              <div className="lib-card" key={d.id}>
                <span className={`lib-badge ${d.ageGroup}`}>{AGE_LABEL[d.ageGroup]}</span>
                <div className="lib-date">{niceDate(d.weekDate)}</div>
                <div className="lib-title">{d.theme || 'Untitled'} — {d.topic || ''}</div>
                <div className="lib-verse">"{(d.verseText || '').replace(/^"|"$/g, '')}"</div>
                <div className="lib-actions">
                  <button className="btn btn-teal" onClick={() => onView(d)} type="button">👁 View / Print</button>
                  <button className="btn btn-ghost" onClick={() => onEdit(d)} type="button">✏️ Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(d.id)} type="button">🗑</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
