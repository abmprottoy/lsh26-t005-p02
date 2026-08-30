export const API_URL = import.meta.env.VITE_API_URL || 'https://backend.tahsinhasib.workers.dev'

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
