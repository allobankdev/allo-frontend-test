import type { LocalRocket } from '@/types/rocket'

export const LOCAL_ROCKETS_KEY = 'allo:rockets:v1'

function hasLocalStorage (): boolean {
  return typeof localStorage !== 'undefined'
}

export function loadLocalRockets (): LocalRocket[] {
  if (!hasLocalStorage()) return []
  try {
    const raw = localStorage.getItem(LOCAL_ROCKETS_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is LocalRocket =>
        typeof item === 'object' && item !== null && typeof (item as LocalRocket).id === 'string',
    )
  } catch {
    return []
  }
}

export function saveLocalRockets (rockets: LocalRocket[]): void {
  if (!hasLocalStorage()) return
  try {
    localStorage.setItem(LOCAL_ROCKETS_KEY, JSON.stringify(rockets))
  } catch {
    // Storage full or unavailable — local rockets simply won't persist.
  }
}

export function createLocalId (): `local-${string}` {
  return `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}
