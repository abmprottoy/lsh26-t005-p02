import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { daysLeft, groupFor, todayISO } from './lib/grouping'

type Bindings = {
  DB: D1Database
}

type MedicineRow = {
  id: string
  name: string
  company: string
  batch: string
  quantity: number
  unit_price_bdt: number
  expiry: string
  returned: number
  returned_at: string | null
  created_at: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/*', cors())

app.get('/', (c) => c.text('Hello Hono!'))
app.get('/api/health', (c) => c.json({ status: 'ok' }))

async function getToday(db: D1Database): Promise<string> {
  const row = await db.prepare('SELECT value FROM settings WHERE key = ?').bind('today_override').first<{ value: string }>()
  return row?.value || todayISO()
}

function withComputed(row: MedicineRow, today: string) {
  const days = daysLeft(today, row.expiry)
  return {
    id: row.id,
    name: row.name,
    company: row.company,
    batch: row.batch,
    quantity: row.quantity,
    unit_price_bdt: row.unit_price_bdt,
    expiry: row.expiry,
    returned: !!row.returned,
    returned_at: row.returned_at,
    days_left: days,
    group: groupFor(days),
    value: row.quantity * row.unit_price_bdt,
  }
}

app.get('/api/medicines', async (c) => {
  const { search, company, group, status } = c.req.query()
  const today = await getToday(c.env.DB)

  let query = 'SELECT * FROM medicines WHERE 1=1'
  const binds: unknown[] = []

  if (status === 'returned') {
    query += ' AND returned = 1'
  } else if (status === 'active' || !status) {
    query += ' AND returned = 0'
  }

  if (search) {
    query += ' AND name LIKE ?'
    binds.push(`%${search}%`)
  }
  if (company) {
    query += ' AND company = ?'
    binds.push(company)
  }

  query += ' ORDER BY expiry ASC'

  const { results } = await c.env.DB.prepare(query).bind(...binds).all<MedicineRow>()
  let items = results.map((r) => withComputed(r, today))

  if (group) {
    items = items.filter((i) => i.group === group)
  }

  return c.json({ today, items })
})

app.get('/api/companies', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT DISTINCT company FROM medicines ORDER BY company').all<{ company: string }>()
  return c.json({ companies: results.map((r) => r.company) })
})

app.get('/api/dashboard', async (c) => {
  const today = await getToday(c.env.DB)
  const { results } = await c.env.DB.prepare('SELECT * FROM medicines WHERE returned = 0').all<MedicineRow>()
  const active = results.map((r) => withComputed(r, today))

  const groups: Record<string, { count: number; value: number }> = {
    expired: { count: 0, value: 0 },
    within30: { count: 0, value: 0 },
    within90: { count: 0, value: 0 },
    safe: { count: 0, value: 0 },
  }
  for (const item of active) {
    groups[item.group].count += 1
    groups[item.group].value += item.value
  }

  const { results: returnedResults } = await c.env.DB.prepare('SELECT COUNT(*) as count FROM medicines WHERE returned = 1').all<{ count: number }>()
  const returnedCount = returnedResults[0]?.count ?? 0

  const [ty, tm] = today.split('-').map(Number)
  const chart: { month: string; value: number }[] = []
  for (let offset = 0; offset < 6; offset++) {
    const d = new Date(Date.UTC(ty, tm - 1 + offset, 1))
    const label = d.toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
    const y = d.getUTCFullYear()
    const m = d.getUTCMonth()
    let value = 0
    for (const item of active) {
      if (item.group === 'expired') continue
      const [ey, em] = item.expiry.split('-').map(Number)
      if (ey === y && em - 1 === m) value += item.value
    }
    chart.push({ month: label, value })
  }

  return c.json({ today, groups, returnedCount, chart })
})

app.post('/api/medicines', async (c) => {
  const body = await c.req.json<{
    id?: string
    name: string
    company: string
    batch: string
    quantity: number
    unit_price_bdt: number
    expiry: string
  }>()

  const id = body.id || `M-${crypto.randomUUID().slice(0, 8)}`

  await c.env.DB.prepare(
    'INSERT INTO medicines (id, name, company, batch, quantity, unit_price_bdt, expiry) VALUES (?, ?, ?, ?, ?, ?, ?)'
  )
    .bind(id, body.name, body.company, body.batch, body.quantity, body.unit_price_bdt, body.expiry)
    .run()

  return c.json({ id }, 201)
})

app.post('/api/medicines/:id/return', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare("UPDATE medicines SET returned = 1, returned_at = datetime('now') WHERE id = ?").bind(id).run()
  return c.json({ ok: true })
})

app.post('/api/medicines/:id/unreturn', async (c) => {
  const id = c.req.param('id')
  await c.env.DB.prepare('UPDATE medicines SET returned = 0, returned_at = NULL WHERE id = ?').bind(id).run()
  return c.json({ ok: true })
})

app.post('/api/import', async (c) => {
  const body = await c.req.json<{
    today?: string
    items: {
      id: string
      name: string
      company: string
      batch: string
      quantity: number
      unit_price_bdt: string | number
      expiry: string
    }[]
    mark_returned?: string[]
  }>()

  await c.env.DB.prepare('DELETE FROM medicines').run()

  const returnedSet = new Set(body.mark_returned || [])
  const statements = body.items.map((item) =>
    c.env.DB.prepare(
      'INSERT INTO medicines (id, name, company, batch, quantity, unit_price_bdt, expiry, returned, returned_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(
      item.id,
      item.name,
      item.company,
      item.batch,
      item.quantity,
      Number(item.unit_price_bdt),
      item.expiry,
      returnedSet.has(item.id) ? 1 : 0,
      returnedSet.has(item.id) ? new Date().toISOString() : null
    )
  )
  if (statements.length) await c.env.DB.batch(statements)

  if (body.today) {
    await c.env.DB.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
      .bind('today_override', body.today)
      .run()
  } else {
    await c.env.DB.prepare('DELETE FROM settings WHERE key = ?').bind('today_override').run()
  }

  return c.json({ ok: true, imported: body.items.length })
})

export default app
