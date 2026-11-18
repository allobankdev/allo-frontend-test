import { readJson, writeJson } from '@/utils/storage'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

function createStorageMock(): Storage {
    const data = new Map<string, string>()

    return {
        getItem: (key: string) => data.get(key) ?? null,
        setItem: (key: string, value: string) => {
            data.set(key, value)
        },
        removeItem: (key: string) => {
            data.delete(key)
        },
        clear: () => data.clear(),
        key: (index: number) => [...data.keys()][index] ?? null,
        get length() {
            return data.size
        },
    }
}

describe('storage', () => {
    beforeEach(() => {
        vi.stubGlobal('localStorage', createStorageMock())
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('round-trips JSON values', () => {
        writeJson('rockets:test', [{ id: 'local-1' }])

        expect(readJson('rockets:test', [])).toEqual([{ id: 'local-1' }])
    })

    it('returns the fallback when the key is absent', () => {
        expect(readJson('missing', 'fallback')).toBe('fallback')
    })

    it('returns the fallback when the stored value is corrupted', () => {
        localStorage.setItem('broken', '{not json')

        expect(readJson('broken', [])).toEqual([])
    })

    it('returns the fallback when storage access throws', () => {
        vi.stubGlobal('localStorage', {
            getItem: () => {
                throw new Error('blocked by the browser')
            },
            setItem: () => {
                throw new Error('blocked by the browser')
            },
        })

        expect(readJson('rockets:test', [])).toEqual([])
        expect(() => writeJson('rockets:test', [])).not.toThrow()
    })

    it('does nothing when storage is unavailable', () => {
        vi.stubGlobal('localStorage', undefined)

        expect(readJson('rockets:test', [])).toEqual([])
        expect(() => writeJson('rockets:test', [])).not.toThrow()
    })
})
