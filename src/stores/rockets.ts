import { defineStore } from 'pinia'
import type { Rocket, RocketApiResponse, NewRocketPayload } from '@/types/rocket'

const API_BASE_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'
const LIST_URL = `${API_BASE_URL}/?manufacturer__name=SpaceX&mode=detailed&limit=20`

export const useRocketStore = defineStore('rockets', {
  state: () => ({
    rockets: [] as Rocket[],
    customRockets: [] as Rocket[],
    isLoading: false,
    error: null as string | null,
    
    // Detail screen state
    selectedRocket: null as Rocket | null,
    isDetailLoading: false,
    detailError: null as string | null,

    // Filter and search state
    searchQuery: '',
    statusFilter: 'all' as 'all' | 'active' | 'retired',
    reusableFilter: 'all' as 'all' | 'reusable' | 'expendable',
    sortBy: 'name-asc' as 'name-asc' | 'name-desc' | 'cost-asc' | 'cost-desc' | 'flight-desc'
  }),

  getters: {
    allRockets: (state): Rocket[] => {
      // Custom rockets appear at the beginning of the list
      return [...state.customRockets, ...state.rockets]
    },

    filteredRockets(): Rocket[] {
      const list = this.allRockets

      return list.filter((rocket) => {
        // Search query filter (matches full_name, name, family, description)
        if (this.searchQuery.trim()) {
          const query = this.searchQuery.toLowerCase().trim()
          const fullName = (rocket.full_name || '').toLowerCase()
          const name = (rocket.name || '').toLowerCase()
          const family = (rocket.family || '').toLowerCase()
          const desc = (rocket.description || '').toLowerCase()

          const matchesQuery =
            fullName.includes(query) ||
            name.includes(query) ||
            family.includes(query) ||
            desc.includes(query)

          if (!matchesQuery) return false
        }

        // Status filter
        if (this.statusFilter === 'active' && rocket.active !== true) {
          return false
        }
        if (this.statusFilter === 'retired' && rocket.active !== false) {
          return false
        }

        // Reusable filter
        if (this.reusableFilter === 'reusable' && rocket.reusable !== true) {
          return false
        }
        if (this.reusableFilter === 'expendable' && rocket.reusable !== false) {
          return false
        }

        return true
      }).sort((a, b) => {
        if (this.sortBy === 'name-asc') {
          return (a.full_name || a.name).localeCompare(b.full_name || b.name)
        }
        if (this.sortBy === 'name-desc') {
          return (b.full_name || b.name).localeCompare(a.full_name || a.name)
        }
        if (this.sortBy === 'cost-asc') {
          const costA = Number(a.launch_cost) || 0
          const costB = Number(b.launch_cost) || 0
          return costA - costB
        }
        if (this.sortBy === 'cost-desc') {
          const costA = Number(a.launch_cost) || 0
          const costB = Number(b.launch_cost) || 0
          return costB - costA
        }
        if (this.sortBy === 'flight-desc') {
          const dateA = a.maiden_flight ? new Date(a.maiden_flight).getTime() : 0
          const dateB = b.maiden_flight ? new Date(b.maiden_flight).getTime() : 0
          return dateB - dateA
        }
        return 0
      })
    },

    totalCount(): number {
      return this.allRockets.length
    },

    filteredCount(): number {
      return this.filteredRockets.length
    }
  },

  actions: {
    async fetchRockets(force = false) {
      if (this.rockets.length > 0 && !force) {
        return
      }

      this.isLoading = true
      this.error = null

      try {
        const response = await fetch(LIST_URL)
        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('API Rate limit tercapai (15 req/jam). Silakan tunggu sebentar dan coba lagi.')
          }
          throw new Error(`Gagal memuat data dari server (HTTP ${response.status})`)
        }

        const data: RocketApiResponse = await response.json()
        this.rockets = data.results || []
      } catch (err: unknown) {
        console.error('fetchRockets error:', err)
        this.error = err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat daftar roket.'
      } finally {
        this.isLoading = false
      }
    },

    async fetchRocketById(id: string | number) {
      this.isDetailLoading = true
      this.detailError = null

      // First check in custom rockets and existing store
      const localMatch = this.allRockets.find((r) => String(r.id) === String(id))
      if (localMatch) {
        this.selectedRocket = localMatch
        this.isDetailLoading = false
        return localMatch
      }

      try {
        const response = await fetch(`${API_BASE_URL}/${id}/`)
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Data roket tidak ditemukan.')
          }
          if (response.status === 429) {
            throw new Error('API Rate limit tercapai. Silakan coba beberapa saat lagi.')
          }
          throw new Error(`Gagal mengambil data roket (HTTP ${response.status})`)
        }

        const data: Rocket = await response.json()
        this.selectedRocket = data
        return data
      } catch (err: unknown) {
        console.error('fetchRocketById error:', err)
        this.detailError = err instanceof Error ? err.message : 'Gagal memuat informasi roket.'
        this.selectedRocket = null
        return null
      } finally {
        this.isDetailLoading = false
      }
    },

    addRocket(payload: NewRocketPayload): Rocket {
      const newId = `custom-${Date.now()}`
      const newRocket: Rocket = {
        id: newId,
        name: payload.full_name,
        full_name: payload.full_name,
        description: payload.description,
        image_url: payload.image_url?.trim() || null,
        launch_cost: payload.launch_cost ? String(payload.launch_cost) : null,
        maiden_flight: payload.maiden_flight?.trim() || null,
        active: payload.active ?? true,
        reusable: payload.reusable ?? true,
        family: 'Custom',
        variant: 'User Added',
        manufacturer: {
          name: 'SpaceX',
          country_code: payload.country_code?.trim() || 'USA'
        },
        is_custom: true
      }

      this.customRockets.unshift(newRocket)
      return newRocket
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
    },

    setStatusFilter(status: 'all' | 'active' | 'retired') {
      this.statusFilter = status
    },

    setReusableFilter(reusable: 'all' | 'reusable' | 'expendable') {
      this.reusableFilter = reusable
    },

    setSortBy(sortBy: 'name-asc' | 'name-desc' | 'cost-asc' | 'cost-desc' | 'flight-desc') {
      this.sortBy = sortBy
    },

    resetFilters() {
      this.searchQuery = ''
      this.statusFilter = 'all'
      this.reusableFilter = 'all'
      this.sortBy = 'name-asc'
    }
  }
})
