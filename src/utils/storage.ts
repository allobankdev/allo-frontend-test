function getStorage(): Storage | null {
    try {
        if (typeof localStorage === 'undefined') return null
        return localStorage
    } catch {
        return null
    }
}

export function readJson<T>(key: string, fallback: T): T {
    const storage = getStorage()
    if (!storage) return fallback

    try {
        const raw = storage.getItem(key)
        if (!raw) return fallback
        return JSON.parse(raw) as T
    } catch {
        // Corrupted JSON or blocked storage: start from the fallback.
        return fallback
    }
}

export function writeJson(key: string, value: unknown): void {
    const storage = getStorage()
    if (!storage) return

    try {
        storage.setItem(key, JSON.stringify(value))
    } catch {
        // Quota exceeded or storage unavailable; the in-memory state still works.
    }
}
