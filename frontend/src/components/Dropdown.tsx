import { useEffect, useRef, useState } from 'react'
import { IconCheck, IconChevronDown } from './icons'

export type DropdownOption = { value: string; label: string }

export function Dropdown({
  value,
  options,
  onChange,
  placeholder = 'Select…',
  className = '',
}: {
  value: string
  options: DropdownOption[]
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  const selected = options.find((o) => o.value === value)

  return (
    <div className={`dropdown ${className}`} ref={ref}>
      <button type="button" className={`dropdown-trigger ${open ? 'dropdown-trigger-open' : ''}`} onClick={() => setOpen((v) => !v)}>
        <span className={selected ? '' : 'dropdown-placeholder'}>{selected ? selected.label : placeholder}</span>
        <IconChevronDown size={15} />
      </button>
      {open && (
        <div className="dropdown-menu">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              className={`dropdown-item ${o.value === value ? 'dropdown-item-active' : ''}`}
              onClick={() => {
                onChange(o.value)
                setOpen(false)
              }}
            >
              <span>{o.label}</span>
              {o.value === value && <IconCheck size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
