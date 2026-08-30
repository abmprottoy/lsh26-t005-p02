import { useEffect, useMemo, useState } from 'react'
import './App.css'
import {
  addMedicine,
  checkHealth,
  fetchCompanies,
  fetchDashboard,
  fetchMedicines,
  markReturned,
  markUnreturned,
  type Dashboard,
  type Group,
  type Medicine,
} from './lib/api'

const GROUP_LABEL: Record<Group, string> = {
  expired: 'Expired',
  within30: 'Expiring ≤ 30 days',
  within90: 'Expiring ≤ 90 days',
  safe: 'Safe',
}

const SHELF_LIFE_PRESETS = [
  { label: '6 months', days: 182 },
  { label: '1 year', days: 365 },
  { label: '2 years', days: 730 },
]

function taka(value: number): string {
  return `৳${value.toLocaleString('en-BD', { maximumFractionDigits: 2 })}`
}

function addDays(base: Date, days: number): string {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function App() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [items, setItems] = useState<Medicine[]>([])
  const [companies, setCompanies] = useState<string[]>([])
  const [tab, setTab] = useState<'active' | 'returned'>('active')
  const [search, setSearch] = useState('')
  const [company, setCompany] = useState('')
  const [groupFilter, setGroupFilter] = useState<Group | ''>('')
  const [showAdd, setShowAdd] = useState(false)
  const [loading, setLoading] = useState(true)

  async function reload() {
    setLoading(true)
    const [db, med, comp] = await Promise.all([
      fetchDashboard(),
      fetchMedicines({ status: tab, search: search || undefined, company: company || undefined, group: groupFilter || undefined }),
      fetchCompanies(),
    ])
    setDashboard(db)
    setItems(med.items)
    setCompanies(comp)
    setLoading(false)
  }

  useEffect(() => {
    checkHealth().then((ok) => setBackendStatus(ok ? 'online' : 'offline'))
  }, [])

  useEffect(() => {
    reload().catch(() => setBackendStatus('offline'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, search, company, groupFilter])

  const totalAtRisk = useMemo(() => {
    if (!dashboard) return 0
    return dashboard.groups.expired.value + dashboard.groups.within30.value
  }, [dashboard])

  const maxChartValue = useMemo(() => {
    if (!dashboard) return 1
    return Math.max(1, ...dashboard.chart.map((c) => c.value))
  }, [dashboard])

  async function handleReturn(id: string) {
    await markReturned(id)
    reload()
  }

  async function handleUnreturn(id: string) {
    await markUnreturned(id)
    reload()
  }

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h1>Pharmacy Expiry Shelf Check</h1>
          <p className="subtitle">
            As of {dashboard?.today ?? '…'} · Backend {backendStatus === 'checking' ? 'checking…' : backendStatus === 'online' ? '🟢 online' : '🔴 offline'}
          </p>
        </div>
        <button className="primary" onClick={() => setShowAdd(true)}>
          + Quick add medicine
        </button>
      </header>

      <section className="cards">
        {(['expired', 'within30', 'within90', 'safe'] as Group[]).map((g) => (
          <button
            key={g}
            className={`card card-${g} ${groupFilter === g ? 'card-active' : ''}`}
            onClick={() => setGroupFilter(groupFilter === g ? '' : g)}
          >
            <span className="card-label">{GROUP_LABEL[g]}</span>
            <span className="card-count">{dashboard?.groups[g].count ?? 0}</span>
            <span className="card-value">{taka(dashboard?.groups[g].value ?? 0)}</span>
          </button>
        ))}
      </section>

      <section className="risk-banner">
        <strong>{taka(totalAtRisk)}</strong> at risk right now (expired + expiring within 30 days)
      </section>

      <section className="chart">
        <h2>Value at risk, next 6 months</h2>
        <div className="chart-bars">
          {dashboard?.chart.map((c) => (
            <div className="chart-bar-wrap" key={c.month}>
              <div className="chart-bar" style={{ height: `${(c.value / maxChartValue) * 100}%` }} title={taka(c.value)} />
              <span className="chart-label">{c.month}</span>
              <span className="chart-value">{taka(c.value)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="toolbar">
        <div className="tabs">
          <button className={tab === 'active' ? 'tab tab-active' : 'tab'} onClick={() => setTab('active')}>
            Active stock
          </button>
          <button className={tab === 'returned' ? 'tab tab-active' : 'tab'} onClick={() => setTab('returned')}>
            Returned ({dashboard?.returnedCount ?? 0})
          </button>
        </div>
        <input
          className="search"
          placeholder="Search by medicine name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={company} onChange={(e) => setCompany(e.target.value)}>
          <option value="">All companies</option>
          {companies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {groupFilter && (
          <button className="clear-filter" onClick={() => setGroupFilter('')}>
            Clear group filter: {GROUP_LABEL[groupFilter]} ✕
          </button>
        )}
      </section>

      <section className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Batch</th>
              <th>Qty</th>
              <th>Unit price</th>
              <th>Expiry</th>
              <th>Days left</th>
              <th>Group</th>
              <th>Value</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={10} className="empty">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={10} className="empty">
                  No items found.
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.company}</td>
                <td>{item.batch}</td>
                <td>{item.quantity}</td>
                <td>{taka(item.unit_price_bdt)}</td>
                <td>{item.expiry}</td>
                <td>{item.days_left}</td>
                <td>
                  <span className={`badge badge-${item.group}`}>{GROUP_LABEL[item.group]}</span>
                </td>
                <td>{taka(item.value)}</td>
                <td>
                  {tab === 'active' ? (
                    <button className="link" onClick={() => handleReturn(item.id)}>
                      Mark returned
                    </button>
                  ) : (
                    <button className="link" onClick={() => handleUnreturn(item.id)}>
                      Undo
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {showAdd && (
        <QuickAddModal
          onClose={() => setShowAdd(false)}
          onAdded={() => {
            setShowAdd(false)
            reload()
          }}
        />
      )}
    </div>
  )
}

function QuickAddModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [batch, setBatch] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unitPrice, setUnitPrice] = useState('')
  const [shelfLife, setShelfLife] = useState(SHELF_LIFE_PRESETS[1].days)
  const [expiry, setExpiry] = useState(addDays(new Date(), SHELF_LIFE_PRESETS[1].days))
  const [saving, setSaving] = useState(false)

  function handleShelfLifeChange(days: number) {
    setShelfLife(days)
    setExpiry(addDays(new Date(), days))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await addMedicine({
      name,
      company,
      batch,
      quantity: Number(quantity),
      unit_price_bdt: Number(unitPrice),
      expiry,
    })
    setSaving(false)
    onAdded()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2>Quick add medicine</h2>
        <label>
          Name
          <input required value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Company
          <input required value={company} onChange={(e) => setCompany(e.target.value)} />
        </label>
        <label>
          Batch
          <input required value={batch} onChange={(e) => setBatch(e.target.value)} />
        </label>
        <label>
          Quantity
          <input required type="number" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </label>
        <label>
          Unit price (৳)
          <input required type="number" min="0" step="0.01" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
        </label>
        <label>
          Shelf life
          <select value={shelfLife} onChange={(e) => handleShelfLifeChange(Number(e.target.value))}>
            {SHELF_LIFE_PRESETS.map((p) => (
              <option key={p.days} value={p.days}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Expiry date
          <input required type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
        </label>
        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary" disabled={saving}>
            {saving ? 'Saving…' : 'Add medicine'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default App
