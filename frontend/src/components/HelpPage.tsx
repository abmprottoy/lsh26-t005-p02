import type { ReactNode } from 'react'
import type { View } from './Sidebar'
import { IconAlert, IconBox, IconChevron, IconCheck, IconChevronDown, IconGrid, IconPill, IconReport, IconUndo, IconUpload } from './icons'

function Example({ children }: { children: ReactNode }) {
  return (
    <div className="help-example">
      <strong>Example:</strong> {children}
    </div>
  )
}

function Steps({ items }: { items: string[] }) {
  return (
    <ol className="help-steps">
      {items.map((s, i) => (
        <li key={i}>{s}</li>
      ))}
    </ol>
  )
}

function TryButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="btn-pill btn-pill-primary help-try" onClick={onClick}>
      {label}
      <IconChevron size={13} />
    </button>
  )
}

export function HelpPage({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <div className="data-tools help-page">
      <section className="tool-card">
        <div className="tool-card-head">
          <span className="tool-icon tool-icon-primary">
            <IconPill size={18} />
          </span>
          <div>
            <h2>Welcome to MediTrack</h2>
            <p>
              MediTrack is a shelf-check tool for a pharmacy's medicine stock. It tells you what's expired, what's about to
              expire, and how much money is at risk — so nothing gets forgotten on a shelf until a customer points at it.
              This guide walks through every screen, assuming you've never used the app before.
            </p>
          </div>
        </div>

        <div className="help-quicklinks">
          <span>Jump to:</span>
          <a href="#help-grouping">How grouping works</a>
          <a href="#help-overview">Overview page</a>
          <a href="#help-stock">Stock page</a>
          <a href="#help-returned">Returned page</a>
          <a href="#help-import">Import data</a>
          <a href="#help-reports">Reports</a>
          <a href="#help-faq">Tips &amp; FAQ</a>
        </div>
      </section>

      <details className="help-section" id="help-grouping" open>
        <summary className="help-summary">
          <span className="tool-icon">
            <IconGrid size={16} />
          </span>
          <span className="help-summary-text">How the expiry groups work</span>
          <span className="help-chevron">
            <IconChevronDown size={16} />
          </span>
        </summary>
        <div className="help-body">
          <p>
            Every medicine in stock is automatically placed into one of four groups, worked out from <strong>today's date</strong>{' '}
            and the medicine's expiry date — you never set the group yourself.
          </p>
          <ul className="help-list">
            <li>
              <span className="badge badge-expired">Expired</span> — the expiry date has already passed.
            </li>
            <li>
              <span className="badge badge-within30">Expiring ≤ 30 days</span> — expires today or within the next 30 days.
            </li>
            <li>
              <span className="badge badge-within90">Expiring ≤ 90 days</span> — expires in 31 to 90 days.
            </li>
            <li>
              <span className="badge badge-safe">Safe</span> — more than 90 days away from expiring.
            </li>
          </ul>
          <Example>
            if today is <strong>30 Aug 2026</strong> and a medicine expires on <strong>10 Sep 2026</strong>, that's 11 days
            away, so it falls under <span className="badge badge-within30">Expiring ≤ 30 days</span>.
          </Example>
          <p>
            <strong>Value at risk</strong> is just quantity × unit price. A medicine with 50 units at ৳20 each is worth ৳1,000
            — if it's expired or expiring soon, that ৳1,000 counts toward the "at risk" figure you see across the app.
          </p>
          <TryButton label="See it on the Overview page" onClick={() => onNavigate('overview')} />
        </div>
      </details>

      <details className="help-section" id="help-overview">
        <summary className="help-summary">
          <span className="tool-icon">
            <IconGrid size={16} />
          </span>
          <span className="help-summary-text">Overview page</span>
          <span className="help-chevron">
            <IconChevronDown size={16} />
          </span>
        </summary>
        <div className="help-body">
          <p>The first screen you land on. It's a summary of the whole pharmacy's stock at a glance:</p>
          <ul className="help-list">
            <li>
              <strong>Red banner at the top</strong> — total taka value at risk right now (expired + expiring within 30 days).
            </li>
            <li>
              <strong>Four group cards</strong> — count and value for each group. Click a card to jump straight to the Stock
              page, already filtered to that group.
            </li>
            <li>
              <strong>Stock value composition (donut chart)</strong> — what share of your total stock value sits in each
              group.
            </li>
            <li>
              <strong>Top companies by value at risk (bar chart)</strong> — which suppliers' medicines make up the biggest
              chunk of what's expired or expiring soon.
            </li>
            <li>
              <strong>Value at risk, next 6 months (line chart)</strong> — a forward look at how much value will come due
              each of the next six months, so you can plan ahead instead of reacting.
            </li>
          </ul>
          <Example>
            the "Expired" card shows <strong>6 items, ৳5,824</strong>. Click it → the Stock page opens already filtered to
            just those 6 expired medicines.
          </Example>
          <TryButton label="Go to Overview" onClick={() => onNavigate('overview')} />
        </div>
      </details>

      <details className="help-section" id="help-stock">
        <summary className="help-summary">
          <span className="tool-icon">
            <IconBox size={16} />
          </span>
          <span className="help-summary-text">Stock page</span>
          <span className="help-chevron">
            <IconChevronDown size={16} />
          </span>
        </summary>
        <div className="help-body">
          <p>This is where you browse the full active stock list, search, filter, and act on individual items.</p>
          <Steps
            items={[
              'Click "Stock" in the sidebar (or a group card on Overview).',
              'Type into the search box in the top bar to find a medicine by name — results update as you type.',
              'Use the "All companies" dropdown to filter to one supplier.',
              'Each row shows the medicine, batch, quantity, unit price, expiry date, days left, its group badge, and total value.',
              'Click "Mark returned" on a row once you\'ve physically pulled it and sent it back to the distributor — it moves to the Returned page and stops counting toward active totals.',
              'Use the Prev / Next buttons at the bottom of the table to page through the list (10 rows per page).',
            ]}
          />
          <p>
            <strong>Quick add:</strong> click the "+ Quick add" button (top right) to add a new medicine — name, company,
            batch, quantity, unit price, and a shelf-life preset (6 months / 1 year / 2 years) that auto-fills a sensible
            expiry date for you, which you can still edit by hand.
          </p>
          <Example>
            searching "napa" shows every medicine with "napa" in the name, across all companies, even if you also have the
            company filter set to a specific supplier — both filters apply together.
          </Example>
          <TryButton label="Go to Stock" onClick={() => onNavigate('stock')} />
        </div>
      </details>

      <details className="help-section" id="help-returned">
        <summary className="help-summary">
          <span className="tool-icon">
            <IconUndo size={16} />
          </span>
          <span className="help-summary-text">Returned page</span>
          <span className="help-chevron">
            <IconChevronDown size={16} />
          </span>
        </summary>
        <div className="help-body">
          <p>
            Once you mark something returned on the Stock page, it lands here instead of disappearing. It's excluded from
            every active count and value figure across the app — the loss is already "handled," so it shouldn't keep
            showing up as at-risk.
          </p>
          <p>
            Made a mistake? Click <strong>Undo</strong> on any row here to put it straight back into active stock.
          </p>
          <TryButton label="Go to Returned" onClick={() => onNavigate('returned')} />
        </div>
      </details>

      <details className="help-section" id="help-import">
        <summary className="help-summary">
          <span className="tool-icon">
            <IconUpload size={16} />
          </span>
          <span className="help-summary-text">Import data page</span>
          <span className="help-chevron">
            <IconChevronDown size={16} />
          </span>
        </summary>
        <div className="help-body">
          <p>A way to load a stock list from a JSON file — useful for testing the app against a specific dataset.</p>
          <Steps
            items={[
              'Click "Browse for a JSON file…" and pick a file from your computer.',
              'If the file contains several cases, a dropdown appears — pick which one to load.',
              'Check the preview (item count, "today" date, how many are pre-marked returned).',
              'Click "Import this case" to load it.',
            ]}
          />
          <div className="tool-alert tool-alert-warn">
            <IconAlert size={15} />
            Importing <strong>replaces the entire active stock list</strong> — it doesn't add to what's already there. If you
            want your normal demo data back, use the "Reset to demo data" button on the same page.
          </div>
          <TryButton label="Go to Import data" onClick={() => onNavigate('data')} />
        </div>
      </details>

      <details className="help-section" id="help-reports">
        <summary className="help-summary">
          <span className="tool-icon">
            <IconReport size={16} />
          </span>
          <span className="help-summary-text">Reports page</span>
          <span className="help-chevron">
            <IconChevronDown size={16} />
          </span>
        </summary>
        <div className="help-body">
          <p>
            Generates a print-ready PDF of the current stock position — useful for handing to an owner, a distributor, or
            keeping a dated record.
          </p>
          <p>The PDF includes:</p>
          <ul className="help-list">
            <li>An executive summary (total SKUs, total value at risk)</li>
            <li>A group-by-group breakdown table</li>
            <li>The top 15 items by value at risk</li>
            <li>Value at risk broken down by company</li>
            <li>A full listing of every active item, sorted by expiry date</li>
          </ul>
          <p>
            Click <strong>"Download PDF report"</strong> and it saves straight to your device — no server round-trip needed.
          </p>
          <TryButton label="Go to Reports" onClick={() => onNavigate('reports')} />
        </div>
      </details>

      <details className="help-section" id="help-faq">
        <summary className="help-summary">
          <span className="tool-icon">
            <IconCheck size={16} />
          </span>
          <span className="help-summary-text">Tips &amp; FAQ</span>
          <span className="help-chevron">
            <IconChevronDown size={16} />
          </span>
        </summary>
        <div className="help-body">
          <p>
            <strong>My stock list looks completely different / much smaller than before.</strong> Someone (maybe you)
            probably used the Import data page, which replaces the whole list. Go to Import data → "Reset to demo data" to
            restore the original stock.
          </p>
          <p>
            <strong>What does the dot next to "All systems online" in the sidebar mean?</strong> It shows whether the app can
            reach its backend server right now — green means yes, red means it can't currently load or save data.
          </p>
          <p>
            <strong>Why did an item's group change on its own?</strong> Groups are computed from today's real date every time
            you load the page — a medicine that was "safe" yesterday can become "expiring soon" today just because a day
            passed. Nothing needs to be done manually.
          </p>
          <p>
            <strong>Can I undo a "Mark returned"?</strong> Yes — go to the Returned page and click "Undo" on that row.
          </p>
        </div>
      </details>
    </div>
  )
}
