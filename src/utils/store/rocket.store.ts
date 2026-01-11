import { defineStore } from 'pinia'
import { rocketService } from '@/utils/services/rocket.services'
import { type RocketListDTO } from '@/utils/dto/rocket.dto'

export const useRocketStore = defineStore('rocket', {
  state: () => ({
    list: [] as RocketListDTO[],
    selected: null as RocketListDTO | null,
    loading: false,
    filters: {
      active: null as boolean | null
    }
  }),

  getters: {
    filteredList(state) {
      if (state.filters.active === null) return state.list
      return state.list.filter(r => r.active === state.filters.active)
    }
  },

  actions: {
    async fetchList() {
      this.loading = true
      this.list = await rocketService.list()
      this.loading = false
    },

    async fetchDetail(id: string) {
      const cached = this.list.find(r => r.id === id)
      this.selected = cached ?? await rocketService.detail(id)
    },

    setActiveFilter(value: boolean | null) {
      this.filters.active = value
    },

    // MOCK ADD (client-side only)
    addRocketMock(payload: RocketListDTO) {
      this.list.unshift(payload)
    }
  }
})
