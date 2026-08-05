const common = { fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

export function BookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...common} {...props}>
      <path d="M4 19V6a2 2 0 0 1 2-2h5v16H6a2 2 0 0 0-2 2" />
      <path d="M20 19V6a2 2 0 0 0-2-2h-5v16h5a2 2 0 0 1 2 2" />
      <path d="M12 4v16" />
    </svg>
  )
}

export function BulbIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...common} {...props}>
      <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.4c.6.5 1 1.3 1 2.1V16h6v-.5c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3z" />
    </svg>
  )
}

export function OpenBookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...common} {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4a1 1 0 0 0-1-1H6.5A2.5 2.5 0 0 0 4 5.5v14z" />
      <path d="M12 3v14" />
    </svg>
  )
}

export function MusicIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...common} {...props}>
      <path d="M9 18V5l11-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="17" cy="16" r="3" />
    </svg>
  )
}

export function PaletteIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...common} {...props}>
      <circle cx="13.5" cy="6.5" r=".5" />
      <circle cx="17.5" cy="10.5" r=".5" />
      <circle cx="8.5" cy="7.5" r=".5" />
      <circle cx="6.5" cy="12.5" r=".5" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.5 0 2-1 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.2 0-1 .8-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-4.4-4.5-8-10-8z" />
    </svg>
  )
}

export function FamilyIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...common} {...props}>
      <circle cx="9" cy="7" r="3" />
      <path d="M2 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" />
      <circle cx="18" cy="7" r="2.2" />
      <path d="M17 21v-1a4 4 0 0 0-1-2.6" />
    </svg>
  )
}

export function PrayerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...common} {...props}>
      <path d="M12 21s-7-4.5-9.5-9C.5 8 2 4 6 4c2 0 4 1.5 6 5 2-3.5 4-5 6-5 4 0 5.5 4 3.5 8-2.5 4.5-9.5 9-9.5 9z" />
    </svg>
  )
}

export function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...common} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  )
}

export function HomeworkIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...common} {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4a1 1 0 0 0-1-1H6.5A2.5 2.5 0 0 0 4 5.5v14z" />
      <path d="M9 7h6M9 11h6" />
    </svg>
  )
}

export function ImageIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...common} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  )
}

export function FootprintTrail() {
  const path = 'M12 2c-3 0-4 3-4 6 0 4 2 5 2 8 0 3-2 4-2 6h8c0-2-2-3-2-6 0-3 2-4 2-8 0-3-1-6-4-6z'
  return (
    <div className="trail">
      {[0, 1, 2, 3].map(i => (
        <svg key={i} viewBox="0 0 24 24"><path d={path} /></svg>
      ))}
    </div>
  )
}
