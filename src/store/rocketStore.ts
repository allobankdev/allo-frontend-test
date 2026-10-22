import { defineStore } from 'pinia'
import { rocketApi } from '@/api/rocketApi'
import { mapApiRocketToRocket, mapFormToRocket } from '@/utils/rocketMapper'

export const RequestStatus = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
}

interface Rocket {
  id: string
  name: string | null
  description: string | null
  imageUrl: string | null
  launchCost: string | null
  country: string | null
  firstFlight: string | null
  source: string
}

export const useRocketStore = defineStore('rocket', {
  state: () => ({
    rockets: [] as Rocket[],
    customRockets: [] as Rocket[],
    status: RequestStatus.IDLE,
    errorMessage: '',
    searchQuery: '',
  }),

  getters: {
    allRockets: (state): Rocket[] => [...state.customRockets, ...state.rockets],

    filteredRockets(state): Rocket[] {
      const query = state.searchQuery.trim().toLowerCase()
      if (!query) return this.allRockets
      return this.allRockets.filter((rocket: { name: string | null }) =>
        (rocket.name ?? '').toLowerCase().includes(query),
      )
    },

    isLoading: (state): boolean => state.status === RequestStatus.LOADING,
    isError: (state): boolean => state.status === RequestStatus.ERROR,
    isSuccess: (state): boolean => state.status === RequestStatus.SUCCESS,

    getRocketById: (state) => (id: string) =>
      [...state.customRockets, ...state.rockets].find(
        (rocket: { id: string }) => String(rocket.id) === String(id),
      ),
  },

  actions: {
    async fetchRockets() {
      this.status = RequestStatus.LOADING
      this.errorMessage = ''
      try {
        const rawRockets = await rocketApi.getRockets()
        this.rockets = rawRockets.map(mapApiRocketToRocket)
        this.status = RequestStatus.SUCCESS
      } catch (error: any) {
        this.status = RequestStatus.ERROR
        this.errorMessage =
          error?.response?.data?.detail ||
          error?.message ||
          'Something went wrong while loading rockets.'
      }
    },

    addRocket(formValues: {
      name: string
      description: string
      imageUrl: string
      launchCost: string
      country: string
      firstFlight: string
    }) {
      const rocket = mapFormToRocket(formValues)
      this.customRockets.unshift(rocket)
      return rocket
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
    },
  },
})
