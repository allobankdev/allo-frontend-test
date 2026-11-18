export interface ScrollPosition {
  left: number
  top: number
}

const STORAGE_KEY = 'rockets:scroll-positions'

const positions = new Map<string, ScrollPosition>()

function persist(): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(positions)))
  } catch {
    // Storage can be unavailable (private mode/quota); the in-memory cache still works.
  }
}

function hydrate(): void {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return

    const parsed = JSON.parse(raw) as Record<string, ScrollPosition>
    for (const [fullPath, position] of Object.entries(parsed)) {
      if (typeof position?.top === 'number' && typeof position?.left === 'number') {
        positions.set(fullPath, position)
      }
    }
  } catch {
    // Ignore corrupted entries and start with an empty cache.
  }
}

hydrate()

export function saveScrollPosition(fullPath: string): void {
  positions.set(fullPath, { left: window.scrollX, top: window.scrollY })
  persist()
}

export function getScrollPosition(fullPath: string): ScrollPosition | undefined {
  return positions.get(fullPath)
}
