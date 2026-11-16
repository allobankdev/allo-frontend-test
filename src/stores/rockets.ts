import { defineStore } from 'pinia'
import { fetchSpaceXRockets, fetchRocketDetail } from '@/services/rocketService'
import type { RocketItem, CreateRocketPayload } from '@/types/rocket'

export type ActiveFilter = 'all' | 'active' | 'retired'
export type SortOption = 'name-asc' | 'name-desc' | 'flight-desc' | 'cost-desc' | 'cost-asc'

export const useRocketStore = defineStore('rockets', {
  state: () => ({
    rockets: [] as RocketItem[],
    customRockets: [] as RocketItem[],
    loading: false,
    error: null as string | null,
    searchQuery: '',
    filterActive: 'all' as ActiveFilter,
    sortBy: 'flight-desc' as SortOption,

    selectedRocket: null as RocketItem | null,
    detailLoading: false,
    detailError: null as string | null,
  }),

  getters: {
    allRockets: (state): RocketItem[] => {
      return [...state.customRockets, ...state.rockets]
    },

    filteredRockets(): RocketItem[] {
      let list = [...this.allRockets]

      if (this.searchQuery.trim()) {
        const query = this.searchQuery.trim().toLowerCase()
        list = list.filter((r) => {
          const nameMatch = r.full_name?.toLowerCase().includes(query) || r.name?.toLowerCase().includes(query)
          const descMatch = r.description?.toLowerCase().includes(query)
          const countryMatch = r.manufacturer?.country_code?.toLowerCase().includes(query)
          return nameMatch || descMatch || countryMatch
        })
      }

      if (this.filterActive === 'active') {
        list = list.filter((r) => r.active === true)
      } else if (this.filterActive === 'retired') {
        list = list.filter((r) => r.active === false)
      }

      list.sort((a, b) => {
        if (this.sortBy === 'name-asc') {
          return (a.full_name || a.name || '').localeCompare(b.full_name || b.name || '')
        }
        if (this.sortBy === 'name-desc') {
          return (b.full_name || b.name || '').localeCompare(a.full_name || a.name || '')
        }
        if (this.sortBy === 'flight-desc') {
          const dateA = a.maiden_flight ? new Date(a.maiden_flight).getTime() : 0
          const dateB = b.maiden_flight ? new Date(b.maiden_flight).getTime() : 0
          return dateB - dateA
        }
        if (this.sortBy === 'cost-desc') {
          const costA = a.launch_cost ? Number(a.launch_cost) : 0
          const costB = b.launch_cost ? Number(b.launch_cost) : 0
          return costB - costA
        }
        if (this.sortBy === 'cost-asc') {
          const costA = a.launch_cost ? Number(a.launch_cost) : Infinity
          const costB = b.launch_cost ? Number(b.launch_cost) : Infinity
          return costA - costB
        }
        return 0
      })

      return list
    },

    getRocketById: (state) => {
      return (id: number | string): RocketItem | undefined => {
        return (
          state.customRockets.find((r) => String(r.id) === String(id)) ||
          state.rockets.find((r) => String(r.id) === String(id))
        )
      }
    },
  },

  actions: {
    async fetchRockets(force = false) {
      if (this.rockets.length > 0 && !force) {
        return
      }

      this.loading = true
      this.error = null

      try {
        const data = await fetchSpaceXRockets()
        this.rockets = data
      } catch (err: unknown) {
        this.error = err instanceof Error ? err.message : 'An unexpected error occurred while loading rockets.'
      } finally {
        this.loading = false
      }
    },

    async fetchRocketDetail(id: number | string) {
      this.detailLoading = true
      this.detailError = null

      const cached = this.getRocketById(id)
      if (cached && (cached.isCustom || cached.description)) {
        this.selectedRocket = cached
        this.detailLoading = false
        return
      }

      if (String(id).startsWith('custom-')) {
        if (cached) {
          this.selectedRocket = cached
        } else {
          this.detailError = 'Custom rocket not found.'
        }
        this.detailLoading = false
        return
      }

      try {
        const detail = await fetchRocketDetail(id)
        this.selectedRocket = detail

        const index = this.rockets.findIndex((r) => String(r.id) === String(id))
        if (index !== -1) {
          this.rockets[index] = { ...this.rockets[index], ...detail }
        }
      } catch (err: unknown) {
        if (cached) {
          this.selectedRocket = cached
        } else {
          this.detailError = err instanceof Error ? err.message : 'Failed to load rocket details.'
        }
      } finally {
        this.detailLoading = false
      }
    },

    addRocket(payload: CreateRocketPayload) {
      const newId = `custom-${Date.now()}`
      const newRocket: RocketItem = {
        id: newId,
        name: payload.full_name,
        full_name: payload.full_name,
        description: payload.description?.trim() || null,
        image_url: payload.image_url?.trim() || null,
        launch_cost: payload.launch_cost ? String(payload.launch_cost) : null,
        maiden_flight: payload.maiden_flight || null,
        manufacturer: {
          name: 'SpaceX / Custom',
          country_code: payload.country_code?.trim().toUpperCase() || 'USA',
        },
        active: payload.active ?? true,
        reusable: payload.reusable ?? true,
        isCustom: true,
      }

      this.customRockets.unshift(newRocket)
      return newRocket
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
    },

    setFilterActive(status: ActiveFilter) {
      this.filterActive = status
    },

    setSortBy(sort: SortOption) {
      this.sortBy = sort
    },

    clearFilters() {
      this.searchQuery = ''
      this.filterActive = 'all'
      this.sortBy = 'flight-desc'
    },
  },
})
