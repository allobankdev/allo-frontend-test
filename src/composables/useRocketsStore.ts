import { defineStore } from 'pinia'
import { rocketsInfo, rocketDetails } from '@/composables/api'
import type { ApiRocket } from '@/composables/api'

export type Rocket = {
  id: string
  name: string
  description: string
  images: string[]
  country: string
  first_flight: string
  cost_per_launch: number
  company: string
}

type State = {
  items: Rocket[]
  loading: boolean
  error: string | null
  filterText: string
}

const mapApiRocket = (r: ApiRocket): Rocket => ({
  id: r.id,
  name: r.name ?? '',
  description: r.description ?? '',
  images: Array.isArray(r.flickr_images) ? r.flickr_images : [],
  country: r.country ?? 'Unknown',
  first_flight: r.first_flight ?? 'TBD',
  cost_per_launch: Number(r.cost_per_launch ?? 0),
  company: r.company
})

const uniqById = (list: Rocket[]): Rocket[] => {
  const seen = new Set<string>()
  const out: Rocket[] = []
  for (const it of list) {
    const key = String(it.id)
    if (!seen.has(key)) { seen.add(key); out.push(it) }
  }
  return out
}

export const useRocketsStore = defineStore('rockets', {
  state: (): State => ({ items: [], loading: false, error: null, filterText: '' }),

  getters: {
    filtered(state): Rocket[] {
      const q = state.filterText.trim().toLowerCase()
      if (!q) return state.items
      return state.items.filter(r =>
        (`${r.name ?? ''} ${r.description ?? ''} ${r.country ?? ''}`).toLowerCase().includes(q)
      )
    },
    byId: (s) => (id: string) => s.items.find(r => String(r.id) === String(id)),
  },

  actions: {
    async fetchRockets() {
      if (this.loading) return
      this.loading = true; this.error = null
      try {
        const data = await rocketsInfo()
        const apiMapped = data.map(mapApiRocket)
        const locals = this.items.filter(x => String(x.id).startsWith('local-'))
        this.items = uniqById([...locals, ...apiMapped])
      } catch (e: any) {
        this.error = e?.message ?? 'Unknown error'
      } finally {
        this.loading = false
      }
    },

    async ensureById(id: string) {
      const found = this.byId(id)
      if (found) return found
      try {
        const r = await rocketDetails(id)
        const mapped = mapApiRocket(r)
        this.items = uniqById([mapped, ...this.items])
        return mapped
      } catch (e: any) {
        this.error = e?.message ?? 'Unknown error'
        throw e
      }
    },

    setFilter(t: string) { this.filterText = t },

    addLocal(p: Partial<Rocket>) {
      const rocket: Rocket = {
        id: `local-${Date.now()}`,
        name: p.name ?? 'Untitled Rocket',
        description: p.description ?? '',
        images: Array.isArray(p.images) && p.images.length
          ? (p.images as string[])
          : ['https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=1280&auto=format&fit=crop'],
        country: p.country ?? 'Unknown',
        first_flight: p.first_flight ?? 'TBD',
        cost_per_launch: Number(p.cost_per_launch ?? 0),
        company: p.company ?? ''
      }
      this.items = [rocket, ...this.items]
      return rocket
    },

    retry() { return this.fetchRockets() },
  },
})
