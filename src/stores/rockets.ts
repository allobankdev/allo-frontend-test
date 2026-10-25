import { defineStore } from 'pinia'
import type { AsyncStatus, NewRocket, Rocket } from '@/types/rocket'

const defaultApiBaseUrl = 'https://lldev.thespacedevs.com/2.2.0/config/launcher/'
const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || defaultApiBaseUrl
const apiBaseUrl = configuredApiBaseUrl.endsWith('/') ? configuredApiBaseUrl : `${configuredApiBaseUrl}/`

export const useRocketStore = defineStore('rockets', {
  state: () => ({
    rockets: [] as Rocket[],
    status: 'idle' as AsyncStatus,
    error: null as string | null,
  }),
  actions: {
    async fetchRockets () {
      if (this.status === 'loading') return
      this.status = 'loading'
      this.error = null
      try {
        const response = await fetch(`${apiBaseUrl}?manufacturer__name=SpaceX&mode=detailed&limit=20`)
        if (!response.ok) throw new Error(`Launch Library responded with ${response.status}`)
        const data = await response.json() as { results: Rocket[] }
        this.rockets = data.results
        this.status = 'success'
      } catch (error) {
        this.status = 'error'
        this.error = error instanceof Error ? error.message : 'An unexpected error occurred.'
      }
    },
    findRocket (id: string) {
      return this.rockets.find(rocket => String(rocket.id) === id)
    },
    addRocket (rocket: NewRocket) {
      this.rockets.unshift({
        id: `local-${Date.now()}`,
        full_name: rocket.full_name,
        description: rocket.description,
        image_url: rocket.image_url?.trim() || null,
        launch_cost: rocket.launch_cost?.trim() || null,
        maiden_flight: rocket.maiden_flight?.trim() || null,
        manufacturer: { country_code: rocket.country_code?.trim().toUpperCase() || null },
      })
    },
  },
})

export async function fetchRocket (id: string): Promise<Rocket> {
  const response = await fetch(`${apiBaseUrl}${encodeURIComponent(id)}/`)
  if (!response.ok) throw new Error(`Launch Library responded with ${response.status}`)
  return await response.json() as Rocket
}
