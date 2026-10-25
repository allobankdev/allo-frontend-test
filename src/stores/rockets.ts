import { defineStore } from 'pinia'
import type { Rocket } from '@/types/rocket'

export type StoreStatus = 'idle' | 'loading' | 'success' | 'error'

interface ApiLauncherResult {
  id: number | string
  full_name?: string
  name?: string
  description?: string
  image_url?: string
  launch_cost?: number | string
  manufacturer?: {
    country_code?: string
  }
  maiden_flight?: string
}

export const useRocketsStore = defineStore('rockets', {
  state: () => ({
    rockets: [] as Rocket[],
    status: 'idle' as StoreStatus,
    errorMessage: null as string | null,
    filterQuery: '',
  }),

  getters: {
    filteredRockets(state): Rocket[] {
      const q = state.filterQuery.trim().toLowerCase()
      if (!q) return state.rockets
      return state.rockets.filter((r) => {
        const name = (r.fullName || '').toLowerCase()
        const desc = (r.description || '').toLowerCase()
        return name.includes(q) || desc.includes(q)
      })
    },

    getRocketById: (state) => {
      return (id: string): Rocket | undefined => {
        return state.rockets.find((r) => String(r.id) === String(id))
      }
    },
  },

  actions: {
    setFilterQuery(query: string) {
      this.filterQuery = query
    },

    async fetchRockets(force = false) {
      // Avoid duplicate fetches if already loaded (unless forced)
      if (this.status === 'success' && !force && this.rockets.length > 0) {
        return
      }

      this.status = 'loading'
      this.errorMessage = null

      try {
        const response = await fetch(
          'https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20'
        )

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        const results: ApiLauncherResult[] = data.results || []

        const apiRockets: Rocket[] = results.map((item) => {
          let formattedCost: string | undefined
          if (item.launch_cost !== null && item.launch_cost !== undefined) {
            const num = Number(item.launch_cost)
            if (!isNaN(num)) {
              formattedCost = `$${num.toLocaleString('en-US')}`
            } else {
              formattedCost = String(item.launch_cost)
            }
          }

          return {
            id: String(item.id),
            fullName: item.full_name || item.name || undefined,
            description: item.description || undefined,
            imageUrl: item.image_url || undefined,
            launchCost: formattedCost,
            country: item.manufacturer?.country_code || undefined,
            maidenFlight: item.maiden_flight || undefined,
            isLocal: false,
          }
        })

        // Retain any existing local rockets added by user
        const localRockets = this.rockets.filter((r) => r.isLocal)
        this.rockets = [...localRockets, ...apiRockets]
        this.status = 'success'
      } catch (err: unknown) {
        this.status = 'error'
        this.errorMessage = (err as Error)?.message || "Couldn't load rocket data."
      }
    },

    retry() {
      this.fetchRockets(true)
    },

    addLocalRocket(payload: Omit<Rocket, 'id' | 'isLocal'>) {
      const newRocket: Rocket = {
        id: `local-${Date.now()}`,
        fullName: payload.fullName || 'Untitled Rocket',
        description: payload.description,
        imageUrl: payload.imageUrl,
        launchCost: payload.launchCost,
        country: payload.country,
        maidenFlight: payload.maidenFlight,
        isLocal: true,
      }
      this.rockets.unshift(newRocket)
    },
  },
})
