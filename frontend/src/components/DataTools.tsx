import { useRef, useState } from 'react'
import { importCase, resetDemoData, type ImportCase } from '../lib/api'
import { Dropdown } from './Dropdown'
import { IconAlert, IconCheck, IconFile, IconRefresh, IconUpload } from './icons'

type ParsedFile = {
  fileName: string
  cases: ImportCase[]
}

type Status = { kind: 'success' | 'error'; message: string } | null

function isImportCase(value: unknown): value is ImportCase {
  return !!value && typeof value === 'object' && Array.isArray((value as ImportCase).items)
}

export function DataTools({ onChanged }: { onChanged: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [parsed, setParsed] = useState<ParsedFile | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [parseError, setParseError] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>(null)
  const [busy, setBusy] = useState(false)

  function handleBrowseClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setStatus(null)
    setParseError(null)
    setParsed(null)

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result))
        let cases: ImportCase[] = []

        if (Array.isArray(data?.cases)) {
          cases = data.cases.filter(isImportCase)
          if (cases.length === 0) throw new Error('The "cases" array has no valid case objects (each needs an "items" array).')
        } else if (isImportCase(data)) {
          cases = [data]
        } else {
          throw new Error('Unrecognized format — expected either { "cases": [...] } or a single case object with an "items" array.')
        }

        setParsed({ fileName: file.name, cases })
        setSelectedIndex(0)
      } catch (err) {
        setParseError(err instanceof Error ? err.message : 'Could not parse this file as JSON.')
      }
    }
    reader.onerror = () => setParseError('Could not read the file.')
    reader.readAsText(file)
  }

  async function handleImport() {
    if (!parsed) return
    const kase = parsed.cases[selectedIndex]
    setBusy(true)
    setStatus(null)
    try {
      const result = await importCase(kase)
      setStatus({
        kind: 'success',
        message: `Imported ${result.imported} item${result.imported === 1 ? '' : 's'}${kase.today ? ` (today set to ${kase.today})` : ''}.`,
      })
      onChanged()
    } catch {
      setStatus({ kind: 'error', message: 'Import failed — check the backend is reachable and try again.' })
    } finally {
      setBusy(false)
    }
  }

  async function handleReset() {
    setBusy(true)
    setStatus(null)
    try {
      const result = await resetDemoData()
      setStatus({ kind: 'success', message: `Restored the original demo stock list (${result.imported} items).` })
      onChanged()
    } catch {
      setStatus({ kind: 'error', message: 'Reset failed — check the backend is reachable and try again.' })
    } finally {
      setBusy(false)
    }
  }

  const selectedCase = parsed?.cases[selectedIndex]

  return (
    <div className="data-tools">
      <section className="tool-card">
        <div className="tool-card-head">
          <span className="tool-icon">
            <IconUpload size={18} />
          </span>
          <div>
            <h2>Import a test file</h2>
            <p>
              Browse for a JSON file — either the judges' file with multiple <code>cases</code>, or a single case object with
              an <code>items</code> array. Pick a case and import it to test the app against that exact data and date.
            </p>
          </div>
        </div>

        <input ref={fileInputRef} type="file" accept="application/json,.json" onChange={handleFileChange} hidden />
        <button className="btn-ghost" onClick={handleBrowseClick} disabled={busy}>
          <IconFile size={15} />
          Browse for a JSON file…
        </button>

        {parseError && (
          <div className="tool-alert tool-alert-error">
            <IconAlert size={15} />
            {parseError}
          </div>
        )}

        {parsed && (
          <div className="import-preview">
            <div className="import-preview-file">
              <IconFile size={14} />
              {parsed.fileName} — {parsed.cases.length} case{parsed.cases.length === 1 ? '' : 's'} found
            </div>

            {parsed.cases.length > 1 && (
              <label className="import-case-picker">
                Case to import
                <Dropdown
                  value={String(selectedIndex)}
                  onChange={(v) => setSelectedIndex(Number(v))}
                  options={parsed.cases.map((c, i) => ({
                    value: String(i),
                    label: `${c.case_id ?? `Case ${i + 1}`} — today ${c.today ?? 'real date'} — ${c.items.length} items${
                      c.mark_returned?.length ? `, ${c.mark_returned.length} returned` : ''
                    }`,
                  }))}
                />
              </label>
            )}

            {selectedCase && (
              <div className="import-summary">
                <span>
                  <strong>{selectedCase.items.length}</strong> medicines
                </span>
                <span>
                  today = <strong>{selectedCase.today ?? 'real date'}</strong>
                </span>
                <span>
                  <strong>{selectedCase.mark_returned?.length ?? 0}</strong> pre-marked returned
                </span>
              </div>
            )}

            <div className="tool-alert tool-alert-warn">
              <IconAlert size={15} />
              This replaces the entire active stock list — the current data will be gone until you re-import or reset.
            </div>

            <button className="primary" onClick={handleImport} disabled={busy}>
              {busy ? 'Importing…' : 'Import this case'}
            </button>
          </div>
        )}
      </section>

      <section className="tool-card">
        <div className="tool-card-head">
          <span className="tool-icon tool-icon-primary">
            <IconRefresh size={18} />
          </span>
          <div>
            <h2>Reset to demo data</h2>
            <p>Restore the original 46-medicine demo stock list, dated relative to today. Use this to undo any test import.</p>
          </div>
        </div>
        <button className="btn-ghost" onClick={handleReset} disabled={busy}>
          <IconRefresh size={15} />
          {busy ? 'Working…' : 'Reset to demo data'}
        </button>
      </section>

      {status && (
        <div className={`tool-alert ${status.kind === 'success' ? 'tool-alert-success' : 'tool-alert-error'}`}>
          {status.kind === 'success' ? <IconCheck size={15} /> : <IconAlert size={15} />}
          {status.message}
        </div>
      )}
    </div>
  )
}
