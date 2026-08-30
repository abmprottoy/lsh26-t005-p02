import { useMemo, type ComponentType } from 'react'
import type { Dashboard, Group } from '../lib/api'
import { IconAlert, IconCalendar, IconCheck, IconClock } from './icons'

const GROUP_LABEL: Record<Group, string> = {
  expired: 'Expired',
  within30: 'Expiring ≤ 30 days',
  within90: 'Expiring ≤ 90 days',
  safe: 'Safe',
}

const GROUP_ICON: Record<Group, ComponentType<{ size?: number }>> = {
  expired: IconAlert,
  within30: IconClock,
  within90: IconCalendar,
  safe: IconCheck,
}

function taka(value: number): string {
  return `৳${value.toLocaleString('en-BD', { maximumFractionDigits: 2 })}`
}

export function Overview({
  dashboard,
  onSelectGroup,
  activeGroup,
}: {
  dashboard: Dashboard | null
  onSelectGroup: (g: Group) => void
  activeGroup: Group | ''
}) {
  const totalAtRisk = useMemo(() => {
    if (!dashboard) return 0
    return dashboard.groups.expired.value + dashboard.groups.within30.value
  }, [dashboard])

  const totalItems = useMemo(() => {
    if (!dashboard) return 0
    return Object.values(dashboard.groups).reduce((sum, g) => sum + g.count, 0)
  }, [dashboard])

  const maxChartValue = useMemo(() => {
    if (!dashboard) return 1
    return Math.max(1, ...dashboard.chart.map((c) => c.value))
  }, [dashboard])

  return (
    <>
      <section className="risk-banner">
        <span className="risk-icon">
          <IconAlert size={22} />
        </span>
        <div>
          <div className="risk-value">{taka(totalAtRisk)}</div>
          <div className="risk-label">at risk right now — expired stock plus what expires within 30 days</div>
        </div>
        <div className="risk-meta">
          <div className="risk-meta-value">{totalItems}</div>
          <div className="risk-meta-label">active SKUs tracked</div>
        </div>
      </section>

      <section className="cards">
        {(['expired', 'within30', 'within90', 'safe'] as Group[]).map((g) => {
          const Icon = GROUP_ICON[g]
          return (
            <button
              key={g}
              className={`card card-${g} ${activeGroup === g ? 'card-active' : ''}`}
              onClick={() => onSelectGroup(g)}
            >
              <span className={`card-icon card-icon-${g}`}>
                <Icon size={17} />
              </span>
              <span className="card-label">{GROUP_LABEL[g]}</span>
              <span className="card-count">{dashboard?.groups[g].count ?? 0}</span>
              <span className="card-value">{taka(dashboard?.groups[g].value ?? 0)}</span>
            </button>
          )
        })}
      </section>

      <section className="chart">
        <div className="chart-head">
          <h2>Value at risk, next 6 months</h2>
          <span className="chart-hint">Excludes already-expired stock</span>
        </div>
        <div className="chart-bars">
          {dashboard?.chart.map((c) => (
            <div className="chart-bar-wrap" key={c.month}>
              <span className="chart-value">{taka(c.value)}</span>
              <div className="chart-bar" style={{ height: `${Math.max(2, (c.value / maxChartValue) * 100)}%` }} title={taka(c.value)} />
              <span className="chart-label">{c.month}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
