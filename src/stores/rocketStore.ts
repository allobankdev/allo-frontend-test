import { defineStore } from 'pinia'
import type { Rocket } from '@/types/rocket'
import { getRocketList } from '@/services/rocketService'

const STORAGE_KEY = 'hig_local_rockets'

function loadSavedRockets(): Rocket[] {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveRockets(rockets: Rocket[]) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rockets))
    }
  } catch {}
}

export const useRocketStore = defineStore('rocket', {
  state: () => ({
    rockets: [] as Rocket[],
    localRockets: loadSavedRockets() as Rocket[],
    status: 'idle' as 'idle' | 'loading' | 'error' | 'success',
    errorMessage: '',
    filterQuery: '',
  }),

  getters: {
    allRockets: (s): Rocket[] => [...s.localRockets, ...s.rockets],

    filteredRockets(): Rocket[] {
      const q = this.filterQuery.trim().toLowerCase()
      if (!q) return this.allRockets
      return this.allRockets.filter((r) =>
        (r.full_name && r.full_name.toLowerCase().includes(q)) ||
        (r.description && r.description.toLowerCase().includes(q))
      )
    },
  },

  actions: {
    async fetchRockets() {
      if (this.status === 'loading') return
      this.status = 'loading'
      try {
        const data = await getRocketList()
        this.rockets = data.results
        this.status = 'success'
      } catch (e) {
        this.errorMessage = (e as Error).message
        this.status = 'error'
      }
    },

    addLocalRocket(partial: Omit<Rocket, 'id'>) {
      const newRocket: Rocket = { id: Date.now(), ...partial }
      this.localRockets.unshift(newRocket)
      saveRockets(this.localRockets)
    },
  },
})
