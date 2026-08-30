import { useEffect, useState } from 'react'
import './App.css'
import { DataTools } from './components/DataTools'
import { Dropdown } from './components/Dropdown'
import { HelpPage } from './components/HelpPage'
import { MedicineTable } from './components/MedicineTable'
import { Overview } from './components/Overview'
import { QuickAddModal } from './components/QuickAddModal'
import { ReportsPage } from './components/ReportsPage'
import { Sidebar, type View } from './components/Sidebar'
import { Topbar } from './components/Topbar'
import { IconPlus, IconSearch } from './components/icons'
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

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem('meditrack-theme')
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // ignore
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const PAGE_COPY: Record<View, { title: string; subtitle: string }> = {
  overview: { title: 'Overview', subtitle: 'What is expiring, when, and how much money is at risk.' },
  stock: { title: 'Active stock', subtitle: 'Search, filter, and mark items returned to the distributor.' },
  returned: { title: 'Returned to distributor', subtitle: 'Items pulled off the shelf and sent back — excluded from active totals.' },
  data: { title: 'Import data', subtitle: 'Load a test file to check the app against it, or reset back to the demo stock list.' },
  reports: { title: 'Reports', subtitle: 'Generate a print-ready stock expiry report.' },
  help: { title: 'Help & Guide', subtitle: 'New here? A walkthrough of every screen, with examples.' },
}

function App() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [items, setItems] = useState<Medicine[]>([])
  const [companies, setCompanies] = useState<string[]>([])
  const [view, setView] = useState<View>('overview')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [company, setCompany] = useState('')
  const [groupFilter, setGroupFilter] = useState<Group | ''>('')
  const [showAdd, setShowAdd] = useState(false)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  const status = view === 'returned' ? 'returned' : 'active'

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('meditrack-theme', theme)
    } catch {
      // ignore
    }
  }, [theme])

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  async function reload() {
    setLoading(true)
    const [db, med, comp] = await Promise.all([
      fetchDashboard(),
      fetchMedicines({ status, search: debouncedSearch || undefined, company: company || undefined, group: groupFilter || undefined }),
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
  }, [status, debouncedSearch, company, groupFilter])

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

  const { title: pageTitle, subtitle: pageSubtitle } = PAGE_COPY[view]

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
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        />

        <main className="main">
          <header className="page-header">
            <div>
              <h1>{pageTitle}</h1>
              <p className="subtitle">{pageSubtitle}</p>
            </div>
            {(view === 'stock' || view === 'returned') && (
              <button className="primary" onClick={() => setShowAdd(true)}>
                <IconPlus size={16} />
                Quick add
              </button>
            )}
          </header>

          {view === 'overview' && <Overview dashboard={dashboard} onSelectGroup={goToStock} activeGroup={groupFilter} />}

          {view === 'data' && <DataTools onChanged={reload} />}

          {view === 'reports' && <ReportsPage />}

          {view === 'help' && <HelpPage onNavigate={setView} />}

          {(view === 'stock' || view === 'returned') && (
            <>
              {view === 'stock' && (
                <section className="toolbar">
                  <div className="search-field">
                    <IconSearch size={16} />
                    <input
                      className="search"
                      placeholder="Search by medicine name…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Dropdown
                    className="dropdown-toolbar"
                    value={company}
                    onChange={setCompany}
                    placeholder="All companies"
                    options={[{ value: '', label: 'All companies' }, ...companies.map((c) => ({ value: c, label: c }))]}
                  />
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
                resetKey={`${view}|${debouncedSearch}|${company}|${groupFilter}`}
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
