import { useState } from 'react'
import Anthropic from '@anthropic-ai/sdk'
import './DateNightPage.css'

const MOODS = [
  { id: 'romantic',    emoji: '🌹', label: 'Romantic' },
  { id: 'adventurous', emoji: '🏄', label: 'Adventurous' },
  { id: 'cosy',        emoji: '🕯️', label: 'Cosy' },
  { id: 'foodie',      emoji: '🍽️', label: 'Foodie' },
  { id: 'beach',       emoji: '🏖️', label: 'Beach Vibes' },
  { id: 'spontaneous', emoji: '✨', label: 'Spontaneous' },
]

const BUDGETS = [
  { id: 'splurge',    emoji: '💎', label: 'Splurge' },
  { id: 'midrange',   emoji: '✨', label: 'Mid-range' },
  { id: 'free',       emoji: '🌿', label: 'Free & Creative' },
]

const TIMES = [
  { id: '2h',      label: '2 Hours' },
  { id: 'halfday', label: 'Half Day' },
  { id: 'fullday', label: 'Full Day' },
  { id: 'weekend', label: 'Weekend' },
]

function buildPrompt(mood, budget, time) {
  return `You are planning the perfect date for Moiz and Maryam, a couple living in Doha, Qatar. 

Mood: ${mood}
Budget: ${budget}
Time available: ${time}

Create a fully planned date with these exact sections formatted clearly:

🌟 TITLE
A romantic, creative name for this date (e.g. "Golden Hour in the Pearl")

📖 THEME
One sentence describing the vibe and intention of this date.

🗓️ ITINERARY
Step-by-step plan with approximate times. Use real, specific locations in Doha where relevant (real restaurants, real neighbourhoods, real spots). Make it feel genuinely tailored and possible.

👗 WHAT TO WEAR
A suggestion for Maryam and one for Moiz — make it fun and appropriate to the date.

💌 WHY THIS IS PERFECT FOR YOU TWO
A personalised note about why this specific date suits Moiz and Maryam's life together in Doha. Make it warm and specific.

🎁 THE SURPRISE ELEMENT
One unexpected, special touch to make the date memorable.

Be specific, romantic, practical, and write with warmth. Use real Doha venues where appropriate.`
}

export default function DateNightPage() {
  const [mood, setMood]     = useState(null)
  const [budget, setBudget] = useState(null)
  const [time, setTime]     = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved]   = useState(false)

  function randomise() {
    setMood(MOODS[Math.floor(Math.random() * MOODS.length)].id)
    setBudget(BUDGETS[Math.floor(Math.random() * BUDGETS.length)].id)
    setTime(TIMES[Math.floor(Math.random() * TIMES.length)].id)
    setResult(null)
    setSaved(false)
  }

  async function planDate() {
    if (!mood || !budget || !time) return
    setLoading(true)
    setResult(null)
    setSaved(false)

    const moodLabel   = MOODS.find(m => m.id === mood)?.label
    const budgetLabel = BUDGETS.find(b => b.id === budget)?.label
    const timeLabel   = TIMES.find(t => t.id === time)?.label

    try {
      const client = new Anthropic({
        apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
        dangerouslyAllowBrowser: true,
      })

      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{ role: 'user', content: buildPrompt(moodLabel, budgetLabel, timeLabel) }],
      })

      setResult(response.content[0].text)
    } catch {
      setResult('Something went wrong — check your API key in the .env file and try again 🤍')
    } finally {
      setLoading(false)
    }
  }

  function saveDate() {
    if (!result) return
    const existing = JSON.parse(localStorage.getItem('bucket-list') || '[]')
    const moodLabel = MOODS.find(m => m.id === mood)?.label
    const lines = result.split('\n')
    const titleIdx = lines.findIndex(l => l.trim().startsWith('🌟'))
    const titleLine = titleIdx >= 0 ? lines[titleIdx + 1] : lines[1]
    const newItem = {
      id: Date.now(),
      title: titleLine?.replace(/[*_#]/g, '').trim() || `${moodLabel} Date Night`,
      category: 'Romance',
      note: result.substring(0, 200) + '...',
      done: false,
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem('bucket-list', JSON.stringify([newItem, ...existing]))
    setSaved(true)
  }

  const canPlan = mood && budget && time

  return (
    <div className="date-page">
      <div className="date-header">
        <div className="date-header-names">Moiz & Maryam</div>
        <h1>Date Night</h1>
        <p>Let's plan something beautiful 🌹</p>
      </div>

      <div className="date-section">
        <h3>What's the mood?</h3>
        <div className="mood-grid">
          {MOODS.map(m => (
            <button
              key={m.id}
              className={`mood-card ${mood === m.id ? 'selected' : ''}`}
              onClick={() => setMood(m.id)}
            >
              <span className="mood-emoji">{m.emoji}</span>
              <span className="mood-label">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="date-section">
        <h3>Budget?</h3>
        <div className="budget-row">
          {BUDGETS.map(b => (
            <button
              key={b.id}
              className={`budget-btn ${budget === b.id ? 'selected' : ''}`}
              onClick={() => setBudget(b.id)}
            >
              {b.emoji} {b.label}
            </button>
          ))}
        </div>
      </div>

      <div className="date-section">
        <h3>Time available?</h3>
        <div className="time-row">
          {TIMES.map(t => (
            <button
              key={t.id}
              className={`time-btn ${time === t.id ? 'selected' : ''}`}
              onClick={() => setTime(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="date-actions">
        <button
          className={`plan-btn ${canPlan ? 'ready' : ''}`}
          onClick={planDate}
          disabled={!canPlan || loading}
        >
          {loading ? 'Planning your date...' : '✨ Plan Our Date'}
        </button>
        <button className="surprise-btn" onClick={randomise}>
          🎲 Surprise Me
        </button>
      </div>

      {loading && (
        <div className="date-loading fade-in">
          <div className="loading-hearts">
            <span>🌹</span><span>💫</span><span>🌹</span>
          </div>
          <p>Crafting something special for you two...</p>
        </div>
      )}

      {result && !loading && (
        <div className="date-result fade-in-up">
          <div className="result-card">
            <div className="result-text">
              {result.split('\n').map((line, i) => {
                const bold = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                if (!line.trim()) return <br key={i} />
                return <p key={i} dangerouslySetInnerHTML={{ __html: bold }} />
              })}
            </div>
          </div>
          <div className="result-actions">
            <button className="save-date-btn" onClick={saveDate} disabled={saved}>
              {saved ? '🤍 Saved to Our List!' : '🤍 Save This Date'}
            </button>
          </div>
        </div>
      )}

      <div style={{ height: 24 }} />
    </div>
  )
}
