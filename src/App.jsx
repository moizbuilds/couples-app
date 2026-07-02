import { useState } from 'react'
import BottomNav from './components/BottomNav'
import ChatPage from './components/ChatPage'
import DateNightPage from './components/DateNightPage'
import BucketListPage from './components/BucketListPage'
import './App.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('chat')

  return (
    <div className="app-shell">
      <div className="page-container">
        {activeTab === 'chat'       && <ChatPage />}
        {activeTab === 'date'       && <DateNightPage />}
        {activeTab === 'bucketlist' && <BucketListPage />}
      </div>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}
