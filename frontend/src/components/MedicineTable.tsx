import { useEffect, useState } from 'react'
import type { Group, Medicine } from '../lib/api'
import { IconChevron, IconRefresh, IconSpinner, IconUndo } from './icons'

const GROUP_LABEL: Record<Group, string> = {
  expired: 'Expired',
  within30: 'Expiring ≤ 30 days',
  within90: 'Expiring ≤ 90 days',
  safe: 'Safe',
}

const PAGE_SIZE = 10

function taka(value: number): string {
  return `৳${value.toLocaleString('en-BD', { maximumFractionDigits: 2 })}`
}

export function MedicineTable({
  items,
  loading,
  mode,
  onReturn,
  onUnreturn,
  resetKey,
}: {
  items: Medicine[]
  loading: boolean
  mode: 'active' | 'returned'
  onReturn?: (id: string) => void
  onUnreturn?: (id: string) => void
  resetKey?: string
}) {
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey])

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const start = (page - 1) * PAGE_SIZE
  const pageItems = items.slice(start, start + PAGE_SIZE)

  return (
    <div className="table-wrap">
      <div className={`table-scroll ${loading ? 'table-scroll-loading' : ''}`}>
        {loading && (
          <div className="table-loading-overlay">
            <IconSpinner size={26} />
          </div>
        )}
        <table>
          <thead>
            <tr>
              <th>Medicine</th>
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
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={10} className="empty">
                  No items found.
                </td>
              </tr>
            )}
            {pageItems.map((item) => (
              <tr key={item.id}>
                <td className="cell-name">{item.name}</td>
                <td>{item.company}</td>
                <td className="cell-muted">{item.batch}</td>
                <td>{item.quantity}</td>
                <td>{taka(item.unit_price_bdt)}</td>
                <td>{item.expiry}</td>
                <td className={item.days_left < 0 ? 'cell-negative' : ''}>{item.days_left}</td>
                <td>
                  <span className={`badge badge-${item.group}`}>{GROUP_LABEL[item.group]}</span>
                </td>
                <td className="cell-value">{taka(item.value)}</td>
                <td>
                  {mode === 'active' ? (
                    <button className="btn-pill btn-pill-primary" onClick={() => onReturn?.(item.id)}>
                      <IconUndo size={13} />
                      Mark returned
                    </button>
                  ) : (
                    <button className="btn-pill btn-pill-ghost" onClick={() => onUnreturn?.(item.id)}>
                      <IconRefresh size={13} />
                      Undo
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && items.length > 0 && (
        <div className="table-footer">
          <span>
            Showing {start + 1}–{Math.min(start + PAGE_SIZE, items.length)} of {items.length} item{items.length === 1 ? '' : 's'}
          </span>
          {totalPages > 1 && (
            <div className="pagination">
              <button className="pagination-btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                <span className="icon-flip">
                  <IconChevron size={13} />
                </span>
                Prev
              </button>
              <span className="pagination-status">
                Page {page} of {totalPages}
              </span>
              <button className="pagination-btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                Next
                <IconChevron size={13} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
