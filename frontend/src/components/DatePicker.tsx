import { useEffect, useRef, useState } from 'react'
import { IconCalendar, IconChevron } from './icons'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function toISO(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function parseISO(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatDisplay(s: string): string {
  return parseISO(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function DatePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => (value ? parseISO(value) : new Date()))
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (value) setViewDate(parseISO(value))
  }, [value])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const startWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayISO = toISO(new Date())

  const cells: (number | null)[] = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  function selectDay(d: number) {
    onChange(toISO(new Date(year, month, d)))
    setOpen(false)
  }

  return (
    <div className="datepicker" ref={ref}>
      <button type="button" className={`dropdown-trigger ${open ? 'dropdown-trigger-open' : ''}`} onClick={() => setOpen((v) => !v)}>
        <span className={value ? '' : 'dropdown-placeholder'}>{value ? formatDisplay(value) : 'Select date'}</span>
        <IconCalendar size={15} />
      </button>

      {open && (
        <div className="datepicker-panel">
          <div className="datepicker-nav">
            <button type="button" className="datepicker-nav-btn" onClick={() => setViewDate(new Date(year, month - 1, 1))}>
              <span className="icon-flip">
                <IconChevron size={14} />
              </span>
            </button>
            <span className="datepicker-month">{viewDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span>
            <button type="button" className="datepicker-nav-btn" onClick={() => setViewDate(new Date(year, month + 1, 1))}>
              <IconChevron size={14} />
            </button>
          </div>

          <div className="datepicker-weekdays">
            {WEEKDAYS.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>

          <div className="datepicker-grid">
            {cells.map((d, i) => {
              if (d === null) return <span key={i} className="datepicker-cell datepicker-cell-empty" />
              const iso = toISO(new Date(year, month, d))
              const isToday = iso === todayISO
              const isSelected = iso === value
              return (
                <button
                  type="button"
                  key={i}
                  className={`datepicker-cell ${isSelected ? 'datepicker-cell-selected' : ''} ${
                    isToday && !isSelected ? 'datepicker-cell-today' : ''
                  }`}
                  onClick={() => selectDay(d)}
                >
                  {d}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
