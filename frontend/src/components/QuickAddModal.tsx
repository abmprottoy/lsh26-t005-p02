import { useState } from 'react'
import { addMedicine } from '../lib/api'
import { DatePicker } from './DatePicker'
import { Dropdown } from './Dropdown'

const SHELF_LIFE_PRESETS = [
  { label: '6 months', days: 182 },
  { label: '1 year', days: 365 },
  { label: '2 years', days: 730 },
]

function addDays(base: Date, days: number): string {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function QuickAddModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
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
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Napa 500" />
        </label>
        <div className="field-row">
          <label>
            Company
            <input required value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Beximco" />
          </label>
          <label>
            Batch
            <input required value={batch} onChange={(e) => setBatch(e.target.value)} placeholder="e.g. F7868" />
          </label>
        </div>
        <div className="field-row">
          <label>
            Quantity
            <input required type="number" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </label>
          <label>
            Unit price (৳)
            <input required type="number" min="0" step="0.01" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
          </label>
        </div>
        <label>
          Shelf life
          <Dropdown
            value={String(shelfLife)}
            onChange={(v) => handleShelfLifeChange(Number(v))}
            options={SHELF_LIFE_PRESETS.map((p) => ({ value: String(p.days), label: p.label }))}
          />
        </label>
        <label>
          Expiry date
          <DatePicker value={expiry} onChange={setExpiry} />
        </label>
        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>
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
