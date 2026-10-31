import { defineStore } from 'pinia'
import axios from 'axios'
import type { Rocket, RocketListResponse, CreateRocketPayload } from '@/types/rocket'

const API_BASE_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'
const STORAGE_KEY = 'allo_spacex_custom_rockets'

export const useRocketStore = defineStore('rocket', {
  state: () => ({
    rockets: [] as Rocket[],
    customRockets: [] as Rocket[],
    selectedRocket: null as Rocket | null,
    searchQuery: '',
    categoryFilter: 'all' as 'all' | 'spacex' | 'custom',
    isLoading: false,
    isDetailLoading: false,
    error: null as string | null,
    detailError: null as string | null,
    hasFetched: false,
  }),

  getters: {
    allRockets: (state): Rocket[] => {
      return [...state.customRockets, ...state.rockets]
    },

    filteredRockets: (state): Rocket[] => {
      const query = state.searchQuery.trim().toLowerCase()
      let list = [...state.customRockets, ...state.rockets]

      if (state.categoryFilter === 'spacex') {
        list = list.filter((r) => !r.isCustom)
      } else if (state.categoryFilter === 'custom') {
        list = list.filter((r) => r.isCustom)
      }

      if (!query) return list

      return list.filter((r) => {
        const fullNameMatch = r.full_name?.toLowerCase().includes(query) ?? false
        const nameMatch = r.name?.toLowerCase().includes(query) ?? false
        const descMatch = r.description?.toLowerCase().includes(query) ?? false
        return fullNameMatch || nameMatch || descMatch
      })
    },

    spacexCount: (state): number => state.rockets.length,
    customCount: (state): number => state.customRockets.length,

    totalCount(): number {
      return this.allRockets.length
    },
  },

  actions: {
    initCustomRockets() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          this.customRockets = JSON.parse(stored)
        }
      } catch (err) {
        console.error('Failed to load custom rockets from localStorage', err)
      }
    },

    async fetchRockets(force = false) {
      // Intelligent Cache: If already loaded and not forced, reuse existing state
      if (!force && this.hasFetched && this.rockets.length > 0) {
        return
      }

      this.isLoading = true
      this.error = null

      try {
        const url = `${API_BASE_URL}/?manufacturer__name=SpaceX&mode=detailed&limit=20`
        const response = await axios.get<RocketListResponse>(url, {
          timeout: 12000,
        })

        if (response.data && Array.isArray(response.data.results)) {
          this.rockets = response.data.results
          this.hasFetched = true
        } else {
          throw new Error('Format data tidak sesuai dari server.')
        }
      } catch (err: unknown) {
        console.error('Error fetching rockets:', err)
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 429) {
            this.error = 'Batas kuota request API tercapai (Rate Limit 429). Silakan tunggu sebentar sebelum mencoba kembali.'
          } else if (err.code === 'ECONNABORTED' || !err.response) {
            this.error = 'Koneksi ke server API SpaceX terputus atau batas waktu habis. Periksa koneksi internet Anda.'
          } else {
            this.error = `Gagal memuat data roket (${err.response.status}: ${err.response.statusText || 'Kesalahan Server'}).`
          }
        } else {
          this.error = 'Terjadi kesalahan tak terduga saat memuat data roket.'
        }
      } finally {
        this.isLoading = false
      }
    },

    async fetchRocketById(id: string | number) {
      this.isDetailLoading = true
      this.detailError = null

      // Check if it's a locally added custom rocket
      const localCustom = this.customRockets.find((r) => String(r.id) === String(id))
      if (localCustom) {
        this.selectedRocket = localCustom
        this.isDetailLoading = false
        return
      }

      // Check if already in cache list
      const cached = this.rockets.find((r) => String(r.id) === String(id))
      if (cached && cached.description && cached.launch_cost !== undefined) {
        this.selectedRocket = cached
        this.isDetailLoading = false
        return
      }

      // If not in cache or missing details, fetch directly from single rocket API
      try {
        const url = `${API_BASE_URL}/${id}/`
        const response = await axios.get<Rocket>(url, { timeout: 12000 })
        this.selectedRocket = response.data
      } catch (err: unknown) {
        console.error(`Error fetching rocket detail for ID ${id}:`, err)
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            this.detailError = 'Roket dengan ID tersebut tidak ditemukan.'
          } else if (err.response?.status === 429) {
            this.detailError = 'Batas kuota request API tercapai. Silakan coba beberapa saat lagi.'
          } else {
            this.detailError = 'Gagal memuat detail roket dari server.'
          }
        } else {
          this.detailError = 'Terjadi kesalahan saat memuat detail roket.'
        }
      } finally {
        this.isDetailLoading = false
      }
    },

    addRocket(payload: CreateRocketPayload) {
      const newRocket: Rocket = {
        id: `custom-${Date.now()}`,
        name: payload.full_name,
        full_name: payload.full_name,
        description: payload.description || 'Roket kustom SpaceX yang ditambahkan secara lokal ke dalam sistem aplikasi.',
        image_url: payload.image_url || null,
        launch_cost: payload.launch_cost || null,
        maiden_flight: payload.maiden_flight || null,
        manufacturer: {
          name: 'SpaceX (Custom Entry)',
          country_code: payload.country_code || 'USA',
        },
        isCustom: true,
      }

      this.customRockets.unshift(newRocket)

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.customRockets))
      } catch (err) {
        console.error('Failed to save custom rockets to localStorage', err)
      }

      return newRocket
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
    },

    setCategoryFilter(category: 'all' | 'spacex' | 'custom') {
      this.categoryFilter = category
    },

    clearError() {
      this.error = null
      this.detailError = null
    },
  },
})
