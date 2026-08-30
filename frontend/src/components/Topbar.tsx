import { useEffect, useRef, useState } from 'react'
import type { View } from './Sidebar'
import { IconBell, IconChevronDown, IconClock, IconMoon, IconSun, IconUser } from './icons'

const VIEW_LABEL: Record<View, string> = {
  overview: 'Overview',
  stock: 'Stock',
  returned: 'Returned',
  data: 'Import data',
  reports: 'Reports',
  help: 'Help & Guide',
}

function parseISODate(iso: string): Date | null {
  const parts = iso.split('-').map(Number)
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null
  const [y, m, d] = parts
  return new Date(y, m - 1, d)
}

export function Topbar({
  view,
  today,
  expiredCount,
  theme,
  onToggleTheme,
}: {
  view: View
  today: string
  expiredCount: number
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const dateObj = parseISODate(today)
  const dateLabel = dateObj ? dateObj.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : today
  const timeLabel = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <header className="topbar">
      <div className="breadcrumb">
        <span className="breadcrumb-root">MediTrack</span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{VIEW_LABEL[view]}</span>
      </div>

      <div className="topbar-right">
        <div className="topbar-clock">
          <IconClock size={14} />
          <span className="topbar-clock-date">{dateLabel}</span>
          <span className="topbar-clock-sep">·</span>
          <span className="topbar-clock-time">{timeLabel}</span>
        </div>

        <button
          className="icon-btn"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={onToggleTheme}
        >
          {theme === 'dark' ? <IconSun size={17} /> : <IconMoon size={17} />}
        </button>

        <button className="icon-btn" aria-label="Notifications">
          <IconBell size={18} />
          {expiredCount > 0 && <span className="icon-btn-dot" />}
        </button>

        <div className="profile-menu" ref={menuRef}>
          <button className="profile-btn" onClick={() => setMenuOpen((v) => !v)}>
            <span className="avatar">
              <IconUser size={15} />
            </span>
            <span className="profile-info">
              <span className="profile-name">Rahman Pharmacy</span>
              <span className="profile-role">Shelf manager</span>
            </span>
            <IconChevronDown size={14} />
          </button>
          {menuOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-item profile-dropdown-header">Signed in as Pharmacist</div>
              <button className="profile-dropdown-item">Settings</button>
              <button className="profile-dropdown-item">Help &amp; docs</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
