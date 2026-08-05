export default function TopNav({ view, setView }) {
  return (
    <div className="topnav">
      <div className="brand">🐾 Sunday School Worksheet Studio</div>
      <button className={`nav-btn ${view === 'editor' ? 'active' : ''}`} onClick={() => setView('editor')}>✏️ New / Edit</button>
      <button className={`nav-btn ${view === 'library' ? 'active' : ''}`} onClick={() => setView('library')}>📚 Library</button>
    </div>
  )
}
