import { useEffect, useState } from 'react'
import './App.css'
import { MedicineTable } from './components/MedicineTable'
import { Overview } from './components/Overview'
import { QuickAddModal } from './components/QuickAddModal'
import { Sidebar, type View } from './components/Sidebar'
import { Topbar } from './components/Topbar'
import { IconPlus } from './components/icons'
import {
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

function App() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [items, setItems] = useState<Medicine[]>([])
  const [companies, setCompanies] = useState<string[]>([])
  const [view, setView] = useState<View>('overview')
  const [search, setSearch] = useState('')
  const [company, setCompany] = useState('')
  const [groupFilter, setGroupFilter] = useState<Group | ''>('')
  const [showAdd, setShowAdd] = useState(false)
  const [loading, setLoading] = useState(true)

  const status = view === 'returned' ? 'returned' : 'active'

  async function reload() {
    setLoading(true)
    const [db, med, comp] = await Promise.all([
      fetchDashboard(),
      fetchMedicines({ status, search: search || undefined, company: company || undefined, group: groupFilter || undefined }),
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
  }, [status, search, company, groupFilter])

  async function handleReturn(id: string) {
    await markReturned(id)
    reload()
  }

  async function handleUnreturn(id: string) {
    await markUnreturned(id)
    reload()
  }

  function goToStock(group: Group) {
    setGroupFilter(group)
    setView('stock')
  }

  function handleGlobalSearch(value: string) {
    setSearch(value)
    if (value && view === 'overview') setView('stock')
  }

  const pageTitle = view === 'overview' ? 'Overview' : view === 'stock' ? 'Active stock' : 'Returned to distributor'
  const pageSubtitle =
    view === 'overview'
      ? 'What is expiring, when, and how much money is at risk.'
      : view === 'stock'
        ? 'Search, filter, and mark items returned to the distributor.'
        : 'Items pulled off the shelf and sent back — excluded from active totals.'

  return (
    <div className="shell">
      <Sidebar
        view={view}
        onNavigate={(v) => {
          setView(v)
          if (v !== 'stock') setGroupFilter('')
        }}
        backendStatus={backendStatus}
        expiredCount={dashboard?.groups.expired.count ?? 0}
        returnedCount={dashboard?.returnedCount ?? 0}
      />

      <div className="content-col">
        <Topbar
          view={view}
          today={dashboard?.today ?? '…'}
          expiredCount={dashboard?.groups.expired.count ?? 0}
          searchValue={search}
          onSearch={handleGlobalSearch}
        />

        <main className="main">
          <header className="page-header">
            <div>
              <h1>{pageTitle}</h1>
              <p className="subtitle">{pageSubtitle}</p>
            </div>
            {view !== 'overview' && (
              <button className="primary" onClick={() => setShowAdd(true)}>
                <IconPlus size={16} />
                Quick add
              </button>
            )}
          </header>

          {view === 'overview' && <Overview dashboard={dashboard} onSelectGroup={goToStock} activeGroup={groupFilter} />}

          {(view === 'stock' || view === 'returned') && (
            <>
              {view === 'stock' && (
                <section className="toolbar">
                  <select value={company} onChange={(e) => setCompany(e.target.value)}>
                    <option value="">All companies</option>
                    {companies.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {search && (
                    <button className="chip" onClick={() => setSearch('')}>
                      Search: {search} ✕
                    </button>
                  )}
                  {groupFilter && (
                    <button className="chip" onClick={() => setGroupFilter('')}>
                      Group: {groupFilter} ✕
                    </button>
                  )}
                </section>
              )}

              <MedicineTable
                items={items}
                loading={loading}
                mode={view === 'stock' ? 'active' : 'returned'}
                onReturn={handleReturn}
                onUnreturn={handleUnreturn}
              />
            </>
          )}
        </main>
      </div>

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

export default App
