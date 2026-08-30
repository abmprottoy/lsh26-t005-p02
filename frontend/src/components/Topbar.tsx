import { useEffect, useRef, useState } from 'react'
import type { View } from './Sidebar'
import { IconBell, IconChevronDown, IconSearch, IconUser } from './icons'

const VIEW_LABEL: Record<View, string> = {
  overview: 'Overview',
  stock: 'Stock',
  returned: 'Returned',
}

export function Topbar({
  view,
  today,
  expiredCount,
  searchValue,
  onSearch,
}: {
  view: View
  today: string
  expiredCount: number
  searchValue: string
  onSearch: (value: string) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="topbar">
      <div className="breadcrumb">
        <span className="breadcrumb-root">MediTrack</span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{VIEW_LABEL[view]}</span>
      </div>

      <div className="topbar-search">
        <IconSearch size={16} />
        <input
          placeholder="Search medicines, batches, companies…"
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
        />
        <kbd>/</kbd>
      </div>

      <div className="topbar-right">
        <span className="topbar-date">{today}</span>

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
