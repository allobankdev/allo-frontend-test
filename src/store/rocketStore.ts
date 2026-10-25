import { defineStore } from 'pinia'
import { fetchRockets } from '@/services/rocketService'
import type { Rocket } from '@/services/rocketService'

export const useRocketStore = defineStore('rockets', {
  state: () => ({
    rockets: [] as Rocket[],
    localRockets: [] as Rocket[],
    status: 'idle' as 'idle' | 'loading' | 'success' | 'error',
    error: null as string | null,
    filterText: '',
    nextLocalId: -1,
  }),
  getters: {
    filteredRockets: (state) => {
      const all = [...state.localRockets, ...state.rockets]
      const q = state.filterText.trim().toLowerCase()
      if (!q) {
        return all
      }
      return all.filter((r) =>
        r.fullName.toLowerCase().includes(q) || r.name.toLowerCase().includes(q),
      )
    },
  },
  actions: {
    async fetchRockets () {
      if (this.status === 'success' || this.status === 'loading') {
        return
      }
      this.status = 'loading'
      this.error = null
      try {
        this.rockets = await fetchRockets()
        this.status = 'success'
      }
      catch (e) {
        this.error = e instanceof Error ? e.message : 'Failed to load rockets'
        this.status = 'error'
      }
    },
    addRocket (input: {
      name: string,
      description: string,
      imageUrl: string,
      costPerLaunch: string,
      country: string,
      firstFlight: string,
    }) {
      const cost = Number(input.costPerLaunch)
      this.localRockets.unshift({
        id: this.nextLocalId--,
        name: input.name,
        fullName: input.name,
        description: input.description,
        imageUrl: input.imageUrl || null,
        costPerLaunch: Number.isFinite(cost) && cost > 0 ? cost : null,
        country: input.country.trim() || null,
        firstFlight: input.firstFlight.trim() || null,
      })
    },
  },
})