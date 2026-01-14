import {defineStore} from 'pinia'
import type {Rocket} from '@/types/Rocket'
import {RocketService} from '@/services/rocket.service'
import {sleep} from '@/utils/networkUtil'
import {useFilterStore} from './useFilterStore'
import type {CreateRocketPayload} from '@/types/api/RocketPayload'

export const useRocketStore = defineStore('rocket', {
  state: () => ({
    items: [] as Rocket[],
    itemsCreated: [] as Rocket[],
    detail: null as Rocket | null,
    countries: [] as string[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    setDetail(data: Rocket) {
      this.detail = data
    },
    addRocket(payload: CreateRocketPayload) {
      const newRocket: Rocket = {
        id: crypto.randomUUID(),
        name: payload.name,
        country: payload.country,
        cost: payload.cost_per_launch ?? 0,
        firstFlight: new Date(payload.first_flight),
        description: payload.description,
        images: !!payload.image
          ? [payload.image]
          : ['https://picsum.photos/800/400'],
      }

      this.itemsCreated = [newRocket, ...this.itemsCreated]
    },
    clear() {
      this.items = []
    },
    async fetchRockets() {
      this.loading = true
      this.error = null

      try {
        // simulation slow connection
        // await sleep(5000)
        const data = await RocketService.getAll()
        this.items = data

        const countries = [
          ...new Set(data.map(item => item.country).filter((country): country is string => country !== null)),
          "Indonesia",
        ]

        this.countries = countries
      } catch (e) {
        this.error = 'Failed to load data'
      } finally {
        this.loading = false
      }
    },
    async fetchRocketDetail(id: string) {
      this.detail = null
      this.loading = true
      this.error = null

      try {
        // simulation slow connection
        // await sleep(5000)
        const data = await RocketService.getDetail(id)
        this.detail = data
      } catch (e) {
        this.error = 'Failed to load data'
      } finally {
        this.loading = false
      }
    },
  },
  getters: {
    filteredItems: (state) => {
      const filter = useFilterStore()

      const sortData = [...state.itemsCreated, ...state.items].filter(item => {
        const matchSearch = !filter.search || item.name.toLowerCase().includes(filter.search.toLowerCase())
        const matchCountry = !filter.country || item.country === filter.country

        return matchSearch && matchCountry
      })

      return sortData
    }
  }
})
