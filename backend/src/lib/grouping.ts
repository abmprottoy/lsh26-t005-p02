export type Group = 'expired' | 'within30' | 'within90' | 'safe'

export function daysLeft(today: string, expiry: string): number {
  const t = Date.UTC(...parseISO(today))
  const e = Date.UTC(...parseISO(expiry))
  return Math.floor((e - t) / 86_400_000)
}

function parseISO(date: string): [number, number, number] {
  const [y, m, d] = date.split('-').map(Number)
  return [y, m - 1, d]
}

export function groupFor(days: number): Group {
  if (days < 0) return 'expired'
  if (days <= 30) return 'within30'
  if (days <= 90) return 'within90'
  return 'safe'
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}
