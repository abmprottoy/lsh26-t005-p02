import type { Group, Medicine } from '../lib/api'

const GROUP_LABEL: Record<Group, string> = {
  expired: 'Expired',
  within30: 'Expiring ≤ 30 days',
  within90: 'Expiring ≤ 90 days',
  safe: 'Safe',
}

function taka(value: number): string {
  return `৳${value.toLocaleString('en-BD', { maximumFractionDigits: 2 })}`
}

export function MedicineTable({
  items,
  loading,
  mode,
  onReturn,
  onUnreturn,
}: {
  items: Medicine[]
  loading: boolean
  mode: 'active' | 'returned'
  onReturn?: (id: string) => void
  onUnreturn?: (id: string) => void
}) {
  return (
    <div className="table-wrap">
      <table className="sticky-head">
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
                  <button className="link" onClick={() => onReturn?.(item.id)}>
                    Mark returned
                  </button>
                ) : (
                  <button className="link" onClick={() => onUnreturn?.(item.id)}>
                    Undo
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!loading && items.length > 0 && (
        <div className="table-footer">
          Showing {items.length} item{items.length === 1 ? '' : 's'}
        </div>
      )}
    </div>
  )
}
