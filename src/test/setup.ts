/**
 * Test setup: provide a deterministic in-memory localStorage.
 *
 * Node 26 exposes an experimental native `localStorage` that is not usable without a
 * backing file and shadows jsdom's implementation, so we install our own for tests.
 */
class MemoryStorage implements Storage {
  private store = new Map<string, string>()

  get length () {
    return this.store.size
  }

  clear () {
    this.store.clear()
  }

  getItem (key: string) {
    return this.store.has(key) ? this.store.get(key)! : null
  }

  key (index: number) {
    return Array.from(this.store.keys())[index] ?? null
  }

  removeItem (key: string) {
    this.store.delete(key)
  }

  setItem (key: string, value: string) {
    this.store.set(key, String(value))
  }
}

Object.defineProperty(globalThis, 'localStorage', {
  value: new MemoryStorage(),
  configurable: true,
})
