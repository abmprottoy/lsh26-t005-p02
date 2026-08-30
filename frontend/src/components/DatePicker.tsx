import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { IconCalendar, IconChevron } from './icons'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MARGIN = 8

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
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const wrapRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  function positionPanel() {
    const trigger = triggerRef.current
    if (!trigger) return
    const triggerRect = trigger.getBoundingClientRect()
    const panelRect = panelRef.current?.getBoundingClientRect()
    const panelWidth = panelRect?.width ?? 232
    const panelHeight = panelRect?.height ?? 280

    let left = triggerRect.left
    if (left + panelWidth > window.innerWidth - MARGIN) {
      left = window.innerWidth - panelWidth - MARGIN
    }
    left = Math.max(MARGIN, left)

    let top = triggerRect.bottom + 6
    if (top + panelHeight > window.innerHeight - MARGIN) {
      const above = triggerRect.top - panelHeight - 6
      top = above > MARGIN ? above : MARGIN
    }

    setCoords({ top, left })
  }

  useLayoutEffect(() => {
    if (open) positionPanel()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, viewDate])

  useEffect(() => {
    if (!open) return

    function handlePointer(e: MouseEvent) {
      const target = e.target as Node
      if (wrapRef.current?.contains(target) || panelRef.current?.contains(target)) return
      setOpen(false)
    }

    document.addEventListener('mousedown', handlePointer)
    window.addEventListener('scroll', positionPanel, true)
    window.addEventListener('resize', positionPanel)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      window.removeEventListener('scroll', positionPanel, true)
      window.removeEventListener('resize', positionPanel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

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
    <div className="datepicker" ref={wrapRef}>
      <button
        type="button"
        ref={triggerRef}
        className={`dropdown-trigger ${open ? 'dropdown-trigger-open' : ''}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={value ? '' : 'dropdown-placeholder'}>{value ? formatDisplay(value) : 'Select date'}</span>
        <IconCalendar size={15} />
      </button>

      {open &&
        createPortal(
          <div className="datepicker-panel" ref={panelRef} style={{ top: coords.top, left: coords.left }}>
            <div className="datepicker-nav">
              <button type="button" className="datepicker-nav-btn" onClick={() => setViewDate(new Date(year, month - 1, 1))}>
                <span className="icon-flip">
                  <IconChevron size={13} />
                </span>
              </button>
              <span className="datepicker-month">{viewDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span>
              <button type="button" className="datepicker-nav-btn" onClick={() => setViewDate(new Date(year, month + 1, 1))}>
                <IconChevron size={13} />
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
          </div>,
          document.body
        )}
    </div>
  )
}
