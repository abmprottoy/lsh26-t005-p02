export const API_URL = import.meta.env.VITE_API_URL || 'https://backend.tahsinhasib.workers.dev'

export type Group = 'expired' | 'within30' | 'within90' | 'safe'

export type Medicine = {
  id: string
  name: string
  company: string
  batch: string
  quantity: number
  unit_price_bdt: number
  expiry: string
  returned: boolean
  returned_at: string | null
  days_left: number
  group: Group
  value: number
}

export type DashboardGroups = Record<Group, { count: number; value: number }>

export type Dashboard = {
  today: string
  groups: DashboardGroups
  returnedCount: number
  chart: { month: string; value: number }[]
}

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/health`)
    if (!res.ok) return false
    const data = await res.json()
    return data.status === 'ok'
  } catch {
    return false
  }
}

export async function fetchDashboard(): Promise<Dashboard> {
  return json(await fetch(`${API_URL}/api/dashboard`))
}

export async function fetchMedicines(params: {
  status?: 'active' | 'returned'
  search?: string
  company?: string
  group?: Group
}): Promise<{ today: string; items: Medicine[] }> {
  const qs = new URLSearchParams()
  if (params.status) qs.set('status', params.status)
  if (params.search) qs.set('search', params.search)
  if (params.company) qs.set('company', params.company)
  if (params.group) qs.set('group', params.group)
  return json(await fetch(`${API_URL}/api/medicines?${qs.toString()}`))
}

export async function fetchCompanies(): Promise<string[]> {
  const data = await json<{ companies: string[] }>(await fetch(`${API_URL}/api/companies`))
  return data.companies
}

export async function markReturned(id: string): Promise<void> {
  await fetch(`${API_URL}/api/medicines/${id}/return`, { method: 'POST' })
}

export async function markUnreturned(id: string): Promise<void> {
  await fetch(`${API_URL}/api/medicines/${id}/unreturn`, { method: 'POST' })
}

export async function addMedicine(input: {
  name: string
  company: string
  batch: string
  quantity: number
  unit_price_bdt: number
  expiry: string
}): Promise<void> {
  await fetch(`${API_URL}/api/medicines`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
}

export type ImportItem = {
  id: string
  name: string
  company: string
  batch: string
  quantity: number
  unit_price_bdt: string | number
  expiry: string
}

export type ImportCase = {
  case_id?: string
  today?: string
  items: ImportItem[]
  mark_returned?: string[]
}

export async function importCase(input: ImportCase): Promise<{ ok: boolean; imported: number }> {
  return json(
    await fetch(`${API_URL}/api/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
  )
}

export async function resetDemoData(): Promise<{ ok: boolean; imported: number }> {
  return json(await fetch(`${API_URL}/api/demo/reset`, { method: 'POST' }))
}
