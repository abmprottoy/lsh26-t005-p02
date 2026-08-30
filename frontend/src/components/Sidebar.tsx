import type { ReactNode } from 'react'
import { IconAlert, IconBox, IconGrid, IconPill, IconUndo } from './icons'

export type View = 'overview' | 'stock' | 'returned'

export function Sidebar({
  view,
  onNavigate,
  backendStatus,
  expiredCount,
  returnedCount,
}: {
  view: View
  onNavigate: (v: View) => void
  backendStatus: 'checking' | 'online' | 'offline'
  expiredCount: number
  returnedCount: number
}) {
  const items: { key: View; label: string; icon: ReactNode; badge?: number }[] = [
    { key: 'overview', label: 'Overview', icon: <IconGrid /> },
    { key: 'stock', label: 'Stock', icon: <IconBox />, badge: expiredCount || undefined },
    { key: 'returned', label: 'Returned', icon: <IconUndo />, badge: returnedCount || undefined },
  ]

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">
          <IconPill size={19} />
        </span>
        <div>
          <div className="brand-name">MediTrack</div>
          <div className="brand-sub">Pharmacy ops</div>
        </div>
      </div>

      <div className="nav-group">
        <div className="nav-group-label">Workspace</div>
        <nav className="nav">
          {items.map((item) => (
            <button
              key={item.key}
              className={`nav-item ${view === item.key ? 'nav-item-active' : ''}`}
              onClick={() => onNavigate(item.key)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.key === 'stock' && item.badge ? (
                <span className="nav-badge nav-badge-alert">
                  <IconAlert size={11} />
                  {item.badge}
                </span>
              ) : item.badge ? (
                <span className="nav-badge">{item.badge}</span>
              ) : null}
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <span className={`status-dot status-${backendStatus}`} />
        <span>{backendStatus === 'checking' ? 'Connecting…' : backendStatus === 'online' ? 'All systems online' : 'Backend offline'}</span>
      </div>
    </aside>
  )
}
