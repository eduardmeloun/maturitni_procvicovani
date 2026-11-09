import type { Activity, Card, Progress, SaveProgressInput, SaveProgressResult, Subject, Topic, User } from './contracts'
export class ApiError extends Error {
  readonly status: number
  constructor(status: number, message: string) { super(message); this.status = status }
}
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`/api${path}`, { ...init, signal: init?.signal || AbortSignal.timeout(15000), credentials: 'same-origin' })
  } catch {
    throw new Error('Server není dostupný nebo požadavek trval příliš dlouho. Zkontroluj připojení a zkus to znovu.')
  }
  if (!response.headers.get('content-type')?.includes('application/json')) throw new ApiError(response.status, 'API nevrátilo JSON. Zkontroluj spuštění serveru.')
  const data = await response.json()
  if (response.status === 401 && !path.startsWith('/auth/') && path !== '/me') window.dispatchEvent(new Event('session-expired'))
  if (!response.ok) throw new ApiError(response.status, data.error?.message || 'Požadavek selhal.')
  return data as T
}
export const api = {
  health: () => request<{ status: string; database: string }>('/health'),
  subjects: () => request<Subject[]>('/subjects'),
  topics: (subjectId?: string) => request<Topic[]>(`/topics${subjectId ? `?subjectId=${encodeURIComponent(subjectId)}` : ''}`),
  me: () => request<User>('/me'),
  cards: (filters: { topicId?: string; status?: Card['status'] } = {}) => {
    const params = new URLSearchParams()
    if (filters.topicId) params.set('topicId', filters.topicId)
    if (filters.status) params.set('status', filters.status)
    return request<Card[]>(`/cards?${params}`)
  },
  progress: () => request<Progress[]>('/progress'),
  activity: () => request<Activity[]>('/activity'),
  saveProgress: (input: SaveProgressInput) => request<SaveProgressResult>('/progress', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input),
  }),
}
