import { defineStore } from 'pinia'
import * as api from '@/services/spacex'
import type { NewRocketInput, Rocket } from '@/types/rocket'

const STORAGE_KEY = 'custom-rockets'

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

interface RocketsState {
  rockets: Rocket[]
  customRockets: Rocket[]
  status: RequestStatus
  searchQuery: string
}

function readCustomRockets (): Rocket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Rocket[]) : []
  } catch {
    return []
  }
}

export const useRocketsStore = defineStore('rockets', {
  state: (): RocketsState => ({
    rockets: [],
    customRockets: [],
    status: 'idle',
    searchQuery: '',
  }),

  getters: {
    // Custom (user-added) rockets first so a freshly added rocket is easy to find.
    allRockets (state): Rocket[] {
      return [...state.customRockets, ...state.rockets]
    },

    filteredRockets (): Rocket[] {
      const query = this.searchQuery.trim().toLowerCase()
      if (!query) return this.allRockets
      return this.allRockets.filter(rocket =>
        rocket.name.toLowerCase().includes(query) ||
        rocket.description.toLowerCase().includes(query),
      )
    },
  },

  actions: {
    loadCustomRockets () {
      this.customRockets = readCustomRockets()
    },

    async fetchRockets () {
      this.status = 'loading'
      try {
        this.rockets = await api.getRockets()
        this.status = 'success'
      } catch {
        this.rockets = []
        this.status = 'error'
      }
    },

    addRocket (input: NewRocketInput): Rocket {
      const rocket: Rocket = {
        id: `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: input.name,
        description: input.description,
        flickr_images: input.imageUrl ? [input.imageUrl] : [],
        cost_per_launch: input.cost_per_launch,
        country: input.country,
        first_flight: input.first_flight,
        active: true,
      }
      this.customRockets = [rocket, ...this.customRockets]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.customRockets))
      return rocket
    },

    async getRocketById (id: string): Promise<Rocket | null> {
      const known = this.allRockets.find(rocket => rocket.id === id)
      if (known) return known
      try {
        return await api.getRocketById(id)
      } catch {
        return null
      }
    },
  },
})
