import { defineStore } from 'pinia'
import { fetchRockets } from '@/services/spacex'
import type { NewRocketInput, Rocket, SpacexRocket, UiStatus } from '@/types/rocket'

function mapApiRocket (r: SpacexRocket): Rocket {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    active: r.active,
    country: r.country,
    first_flight: r.first_flight,
    cost_per_launch: r.cost_per_launch,
    imageUrl: r.flickr_images?.[0] || '',
    isLocal: false,
  }
}

export type RocketFilters = {
  query: string
  country: string | 'ALL'
  active: 'ALL' | 'ACTIVE' | 'INACTIVE'
}

export const useRocketStore = defineStore('rockets', {
  state: () => ({
    remote: [] as Rocket[],
    local: [] as Rocket[],
    status: 'idle' as UiStatus,
    error: '' as string,
    filters: {
      query: '',
      country: 'ALL',
      active: 'ALL',
    } as RocketFilters,
  }),

  getters: {
    allRockets: (s): Rocket[] => [...s.local, ...s.remote],
    countries: (s): string[] => {
      const set = new Set<string>()
      for (const r of [...s.remote, ...s.local]) {
        if (r.country) set.add(r.country)
      }
      return Array.from(set).sort((a, b) => a.localeCompare(b))
    },
    filteredRockets: (s): Rocket[] => {
      const q = s.filters.query.trim().toLowerCase()
      return [...s.local, ...s.remote].filter((r) => {
        const matchesQuery = !q ||
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.country.toLowerCase().includes(q)

        const matchesCountry = s.filters.country === 'ALL' || r.country === s.filters.country

        const matchesActive =
          s.filters.active === 'ALL' ||
          (s.filters.active === 'ACTIVE' ? (r.active ?? true) : !(r.active ?? false))

        return matchesQuery && matchesCountry && matchesActive
      })
    },
    getById: (s) => {
      return (id: string): Rocket | undefined => [...s.local, ...s.remote].find(r => r.id === id)
    },
  },

  actions: {
    setFilters (patch: Partial<RocketFilters>) {
      this.filters = { ...this.filters, ...patch }
    },

    async loadRockets (opts?: { force?: boolean }) {
      if (!opts?.force && this.remote.length > 0) {
        // Already loaded.
        this.status = 'success'
        return
      }

      this.status = 'loading'
      this.error = ''

      try {
        const controller = new AbortController()
        const data = await fetchRockets({ signal: controller.signal })
        this.remote = data.map(mapApiRocket)
        this.status = 'success'
      } catch (e: any) {
        this.status = 'error'
        this.error = e?.message || 'Unknown error'
      }
    },

    addRocket (input: NewRocketInput) {
      const id = `local-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      this.local.unshift({
        id,
        ...input,
        isLocal: true,
      })
    },
  },
})
