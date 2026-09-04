import { defineStore } from 'pinia'
import { fetchLaunchers, fetchLauncherById } from '@/api/ll2'
import type { Launcher } from '@/types/ll2'

export type FetchState = 'idle' | 'loading' | 'success' | 'error'
export type SortDirection = 'none' | 'asc' | 'desc'

export interface VisibleOptions {
  query: string
  country?: string | null
  sort?: SortDirection
}

/**
 * Owns the rocket list and the per-id detail cache. UI components ask the
 * store for current state instead of holding their own fetch state, which is
 * what "implement state management" in the brief calls for.
 *
 * Locally-added rockets (the brief: API is read-only, add lives in the app)
 * are kept in the same `items` array and resolved directly from there in
 * `loadOne`, so navigating to their detail does not hit the API and fail.
 */
export const useLaunchersStore = defineStore('launchers', {
  state: () => ({
    items: [] as Launcher[],
    listState: 'idle' as FetchState,
    listError: null as string | null,

    detailById: {} as Record<string, Launcher>,
    detailState: {} as Record<string, FetchState>,
    detailError: {} as Record<string, string | null>,
  }),

  getters: {
    byId(state) {
      return (id: string): Launcher | undefined =>
        state.detailById[id] ?? state.items.find(r => String(r.id) === id)
    },
    /**
     * Country codes derived from the loaded list, so the filter only ever
     * offers values that actually exist in the data.
     */
    countries(state): string[] {
      return [...new Set(
        state.items
          .map(r => r.manufacturer?.country_code?.trim())
          .filter((c): c is string => !!c),
      )].sort()
    },
    filtered(state) {
      return (options: VisibleOptions): Launcher[] => {
        const q = options.query.trim().toLowerCase()
        const country = options.country?.trim().toUpperCase() || null

        let result = state.items
        if (q) {
          result = result.filter(r =>
            r.full_name.toLowerCase().includes(q) ||
            (r.description ?? '').toLowerCase().includes(q),
          )
        }
        if (country) {
          result = result.filter(r =>
            r.manufacturer?.country_code?.trim().toUpperCase() === country,
          )
        }
        if (options.sort === 'asc' || options.sort === 'desc') {
          result = [...result].sort((a, b) =>
            a.full_name.localeCompare(b.full_name),
          )
          if (options.sort === 'desc') result.reverse()
        }
        return result
      }
    },
  },

  actions: {
    async loadList() {
      if (this.listState === 'loading') return
      this.listState = 'loading'
      this.listError = null
      try {
        this.items = await fetchLaunchers()
        this.listState = 'success'
      } catch (e) {
        this.listError = e instanceof Error ? e.message : 'Unknown error'
        this.listState = 'error'
      }
    },

    async loadOne(id: string) {
      if (this.detailById[id]) return
      const local = this.items.find(r => String(r.id) === id)
      if (local) {
        this.detailById[id] = local
        this.detailState[id] = 'success'
        return
      }
      this.detailState[id] = 'loading'
      try {
        this.detailById[id] = await fetchLauncherById(id)
        this.detailState[id] = 'success'
      } catch (e) {
        this.detailError[id] = e instanceof Error ? e.message : 'Unknown error'
        this.detailState[id] = 'error'
      }
    },

    addLocal(rocket: Launcher) {
      this.items = [rocket, ...this.items]
      this.detailById[String(rocket.id)] = rocket
      this.detailState[String(rocket.id)] = 'success'
    },
  },
})
