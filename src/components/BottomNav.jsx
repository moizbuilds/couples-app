import './BottomNav.css'

const tabs = [
  { id: 'chat',       emoji: '💬', label: 'Moiz' },
  { id: 'date',       emoji: '📅', label: 'Date Night' },
  { id: 'bucketlist', emoji: '🤍', label: 'Our List' },
]

export default function BottomNav({ activeTab, setActiveTab }) {
  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="nav-emoji">{tab.emoji}</span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
