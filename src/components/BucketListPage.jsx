import { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import './BucketListPage.css'

const STORAGE_KEY = 'bucket-list'

const CATEGORIES = ['Travel', 'Food', 'Adventure', 'Romance', 'Home']

const CATEGORY_COLOURS = {
  Travel:    { bg: '#fef3e2', text: '#d97706', border: '#fde68a' },
  Food:      { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
  Adventure: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
  Romance:   { bg: '#fdf2f8', text: '#9d174d', border: '#fbcfe8' },
  Home:      { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
}

const STARTER_ITEMS = [
  { id: 1, title: 'Sunset dhow cruise in Doha', category: 'Romance', note: '', done: false, createdAt: new Date().toISOString() },
  { id: 2, title: 'Weekend in the Maldives', category: 'Travel', note: '', done: false, createdAt: new Date().toISOString() },
  { id: 3, title: 'Cook a new cuisine together at home', category: 'Home', note: '', done: false, createdAt: new Date().toISOString() },
  { id: 4, title: 'Watch the sunrise from the Corniche', category: 'Romance', note: '', done: false, createdAt: new Date().toISOString() },
  { id: 5, title: 'Road trip to Sealine Beach', category: 'Adventure', note: '', done: false, createdAt: new Date().toISOString() },
  { id: 6, title: 'Try a new restaurant every Friday for a month', category: 'Food', note: '', done: false, createdAt: new Date().toISOString() },
  { id: 7, title: 'Recreate our first date', category: 'Romance', note: '', done: false, createdAt: new Date().toISOString() },
  { id: 8, title: 'Take a couples cooking class', category: 'Food', note: '', done: false, createdAt: new Date().toISOString() },
  { id: 9, title: 'Staycation at a Doha 5-star hotel', category: 'Travel', note: '', done: false, createdAt: new Date().toISOString() },
  { id: 10, title: 'Write letters to each other and open them in one year', category: 'Romance', note: '', done: false, createdAt: new Date().toISOString() },
]

function loadItems() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return STARTER_ITEMS
}

function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

function fireConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#b5737a', '#d4a0a6', '#c4714f', '#e8a98c', '#f9f3eb'],
  })
}

export default function BucketListPage() {
  const [items, setItems]     = useState(loadItems)
  const [filter, setFilter]   = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCat, setNewCat]   = useState('Romance')
  const [newNote, setNewNote] = useState('')
  const [editMemory, setEditMemory] = useState(null) // item id being memory-edited
  const [memoryText, setMemoryText] = useState('')
  const [memoryRating, setMemoryRating] = useState(5)
  const formRef = useRef(null)

  useEffect(() => { saveItems(items) }, [items])

  const doneItems = items.filter(i => i.done)
  const todoItems = items.filter(i => !i.done)
  const highlights = doneItems
    .filter(i => i.rating)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)

  const filtered = filter === 'all'
    ? items
    : filter === 'done'
    ? doneItems
    : todoItems

  function addItem() {
    if (!newTitle.trim()) return
    const item = {
      id: Date.now(),
      title: newTitle.trim(),
      category: newCat,
      note: newNote.trim(),
      done: false,
      createdAt: new Date().toISOString(),
    }
    setItems(prev => [item, ...prev])
    setNewTitle('')
    setNewNote('')
    setNewCat('Romance')
    setShowForm(false)
  }

  function markDone(id) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, done: true, doneAt: new Date().toISOString() } : i))
    fireConfetti()
    setEditMemory(id)
    setMemoryText('')
    setMemoryRating(5)
  }

  function saveMemory(id) {
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, rating: memoryRating, memory: memoryText } : i
    ))
    setEditMemory(null)
  }

  function deleteItem(id) {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function undoDone(id) {
    setItems(prev => prev.map(i =>
      i.id === id ? { ...i, done: false, doneAt: null, rating: null, memory: null } : i
    ))
  }

  return (
    <div className="bucket-page">
      {/* Header */}
      <div className="bucket-header">
        <div className="bucket-header-names">Moiz & Maryam</div>
        <h1>Our List</h1>
        <div className="bucket-counter">
          <span className="counter-heart">🤍</span>
          <span>{doneItems.length} thing{doneItems.length !== 1 ? 's' : ''} done together</span>
        </div>
      </div>

      {/* Highlights */}
      {highlights.length > 0 && (
        <div className="highlights-section fade-in">
          <h3 className="section-label">✨ Top Memories</h3>
          <div className="highlights-scroll">
            {highlights.map(item => (
              <div key={item.id} className="highlight-card">
                <div className="highlight-rating">
                  {'♥'.repeat(item.rating)}{'♡'.repeat(5 - item.rating)}
                </div>
                <div className="highlight-title">{item.title}</div>
                {item.memory && <div className="highlight-memory">"{item.memory}"</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filter-row">
        {['all', 'todo', 'done'].map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'todo' ? 'Want To Do' : 'Completed'}
          </button>
        ))}
      </div>

      {/* Add button */}
      <div className="add-row">
        <button className="add-btn" onClick={() => setShowForm(v => !v)}>
          {showForm ? '✕ Cancel' : '+ Add to Our List'}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="add-form fade-in" ref={formRef}>
          <input
            className="form-input"
            placeholder="What do you want to do together?"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()}
            autoFocus
          />
          <select
            className="form-select"
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <textarea
            className="form-textarea"
            placeholder="Add a note (optional)"
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            rows={2}
          />
          <button className="form-submit" onClick={addItem} disabled={!newTitle.trim()}>
            Add 🤍
          </button>
        </div>
      )}

      {/* Memory modal */}
      {editMemory && (
        <div className="memory-overlay">
          <div className="memory-modal fade-in-up">
            <div className="memory-header">🎉 You did it!</div>
            <p className="memory-sub">How was it? Add a memory.</p>
            <div className="heart-rating">
              {[1,2,3,4,5].map(n => (
                <button
                  key={n}
                  className={`heart-btn ${n <= memoryRating ? 'filled' : ''}`}
                  onClick={() => setMemoryRating(n)}
                >
                  {n <= memoryRating ? '♥' : '♡'}
                </button>
              ))}
            </div>
            <textarea
              className="form-textarea"
              placeholder="Write a little memory... (optional)"
              value={memoryText}
              onChange={e => setMemoryText(e.target.value)}
              rows={3}
            />
            <button className="form-submit" onClick={() => saveMemory(editMemory)}>
              Save Memory 🤍
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bucket-list">
        {filtered.length === 0 && (
          <div className="empty-state fade-in">
            <div className="empty-icon">🌸</div>
            <p>Every adventure starts with one idea 🤍</p>
            <p className="empty-sub">Add your first</p>
          </div>
        )}

        {filtered.map((item, idx) => {
          const catStyle = CATEGORY_COLOURS[item.category] || {}
          return (
            <div
              key={item.id}
              className={`bucket-card ${item.done ? 'done' : ''} fade-in`}
              style={{ animationDelay: `${idx * 0.04}s` }}
            >
              <div className="card-top">
                <span
                  className="cat-badge"
                  style={{ background: catStyle.bg, color: catStyle.text, border: `1px solid ${catStyle.border}` }}
                >
                  {item.category}
                </span>
                <button className="delete-btn" onClick={() => deleteItem(item.id)}>✕</button>
              </div>

              <div className={`card-title ${item.done ? 'strikethrough' : ''}`}>
                {item.title}
              </div>

              {item.note && <div className="card-note">{item.note}</div>}

              {item.done && item.rating && (
                <div className="card-rating">
                  <span className="rating-hearts">
                    {'♥'.repeat(item.rating)}{'♡'.repeat(5 - item.rating)}
                  </span>
                  {item.doneAt && (
                    <span className="card-date">
                      {new Date(item.doneAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>
              )}

              {item.done && item.memory && (
                <div className="card-memory">💭 "{item.memory}"</div>
              )}

              <div className="card-actions">
                {!item.done ? (
                  <button className="done-btn" onClick={() => markDone(item.id)}>
                    Mark as Done 🤍
                  </button>
                ) : (
                  <button className="undo-btn" onClick={() => undoDone(item.id)}>
                    Undo
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ height: 24 }} />
    </div>
  )
}
