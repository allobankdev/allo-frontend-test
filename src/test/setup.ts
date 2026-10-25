import { beforeEach } from 'vitest'

/**
 * In-memory Storage so store tests exercise the persistence paths on plain
 * Node, without pulling jsdom into the devDependencies.
 */
class MemoryStorage implements Storage {
  private readonly entries = new Map<string, string>()

  get length(): number {
    return this.entries.size
  }

  clear(): void {
    this.entries.clear()
  }

  getItem(key: string): string | null {
    return this.entries.get(key) ?? null
  }

  key(index: number): string | null {
    return [...this.entries.keys()][index] ?? null
  }

  removeItem(key: string): void {
    this.entries.delete(key)
  }

  setItem(key: string, value: string): void {
    this.entries.set(key, String(value))
  }
}

beforeEach(() => {
  // `localStorage` is a read-only window property, so it is swapped via
  // defineProperty; every test starts from an empty storage.
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: new MemoryStorage(),
  })
})
