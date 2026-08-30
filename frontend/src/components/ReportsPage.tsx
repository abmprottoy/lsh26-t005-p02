import { useEffect, useState } from 'react'
import { fetchDashboard, fetchMedicines, type Dashboard, type Medicine } from '../lib/api'
import { IconCheck, IconReport, IconSpinner } from './icons'

const REPORT_SECTIONS = [
  'Executive summary — total SKUs, total stock value, and value at immediate risk',
  'Group breakdown — expired / expiring ≤30d / expiring ≤90d / safe, with counts and taka values',
  'Top 15 items by value at risk',
  'Value at risk by company',
  'Full active stock listing, sorted by expiry date',
]

export function ReportsPage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [items, setItems] = useState<Medicine[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    Promise.all([fetchDashboard(), fetchMedicines({ status: 'active' })])
      .then(([db, med]) => {
        setDashboard(db)
        setItems(med.items)
      })
      .finally(() => setLoading(false))
  }, [])

  const totalItems = dashboard ? Object.values(dashboard.groups).reduce((s, g) => s + g.count, 0) : 0
  const totalAtRisk = dashboard ? dashboard.groups.expired.value + dashboard.groups.within30.value : 0

  async function handleDownload() {
    if (!dashboard) return
    setGenerating(true)
    try {
      const { generateStockReport } = await import('../lib/report')
      generateStockReport(dashboard, items)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="data-tools">
      <section className="tool-card">
        <div className="tool-card-head">
          <span className="tool-icon tool-icon-primary">
            <IconReport size={18} />
          </span>
          <div>
            <h2>Stock Expiry Report</h2>
            <p>A print-ready PDF summarizing the current stock position — built for handing to a distributor, an owner, or an auditor.</p>
          </div>
        </div>

        <ul className="report-sections">
          {REPORT_SECTIONS.map((s) => (
            <li key={s}>
              <IconCheck size={14} />
              <span>{s}</span>
            </li>
          ))}
        </ul>

        {!loading && dashboard && (
          <div className="import-summary">
            <span>
              <strong>{totalItems}</strong> active SKUs as of {dashboard.today}
            </span>
            <span>
              <strong>Tk {totalAtRisk.toLocaleString('en-BD', { maximumFractionDigits: 2 })}</strong> at immediate risk
            </span>
          </div>
        )}

        <button className="primary" onClick={handleDownload} disabled={loading || generating || !dashboard}>
          {generating ? (
            <>
              <IconSpinner size={15} />
              Generating…
            </>
          ) : (
            <>
              <IconReport size={15} />
              Download PDF report
            </>
          )}
        </button>
      </section>
    </div>
  )
}
