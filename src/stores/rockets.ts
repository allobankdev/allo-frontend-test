import { defineStore } from 'pinia'
import { fetchRocketDetail, fetchRocketList } from '@/api/rockets'
import type { LocalRocketInput, Rocket } from '@/types/rocket'

type LoadStatus = 'idle' | 'loading' | 'success' | 'error'

export const useRocketStore = defineStore('rockets', {
  state: () => ({
    remoteRockets: [] as Rocket[],
    localRockets: [] as Rocket[],
    detailCache: {} as Record<string, Rocket>,
    listStatus: 'idle' as LoadStatus,
    listError: '',
    detailStatus: 'idle' as LoadStatus,
    detailError: '',
  }),
  getters: {
    rockets: state => [...state.localRockets, ...state.remoteRockets],
    byId: state => (id: string) => state.localRockets.find(rocket => rocket.id === id)
      ?? state.remoteRockets.find(rocket => rocket.id === id)
      ?? state.detailCache[id],
  },
  actions: {
    async fetchRockets (force = false) {
      if (this.listStatus === 'loading' || (this.listStatus === 'success' && !force)) return
      this.listStatus = 'loading'
      this.listError = ''
      try {
        this.remoteRockets = await fetchRocketList()
        this.listStatus = 'success'
      } catch (error) {
        this.listError = error instanceof Error ? error.message : 'Unable to load rockets. Please try again.'
        this.listStatus = 'error'
      }
    },
    retryFetch () {
      return this.fetchRockets(true)
    },
    async fetchRocket (id: string, force = false) {
      const cached = this.byId(id)
      if (cached && !force) return cached
      if (id.startsWith('local-')) {
        this.detailStatus = 'error'
        this.detailError = 'This local rocket is no longer available in this session.'
        return
      }
      this.detailStatus = 'loading'
      this.detailError = ''
      try {
        const rocket = await fetchRocketDetail(id)
        this.detailCache[id] = rocket
        this.detailStatus = 'success'
        return rocket
      } catch (error) {
        this.detailError = error instanceof Error ? error.message : 'Unable to load rocket. Please try again.'
        this.detailStatus = 'error'
      }
    },
    addLocalRocket (input: LocalRocketInput) {
      const rocket: Rocket = {
        id: `local-${crypto.randomUUID()}`,
        name: input.name.trim(),
        description: input.description?.trim() || null,
        imageUrl: input.imageUrl?.trim() || null,
        launchCost: input.launchCost?.trim() || null,
        countryCode: input.countryCode?.trim() || null,
        maidenFlight: input.maidenFlight?.trim() || null,
        isLocal: true,
      }
      this.localRockets.unshift(rocket)
      return rocket
    },
  },
})
