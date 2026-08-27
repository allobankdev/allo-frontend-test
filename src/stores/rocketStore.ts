import { defineStore } from 'pinia'
import type { Rocket, SpaceXApiResponse } from '@/types/rocket'

// URL endpoint utama SpaceX Launch Library 2.2.0 API
const API_BASE_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'

// Key untuk menyimpan data roket buatan user di localStorage
const CUSTOM_ROCKETS_KEY = 'allo_custom_rockets'

export const useRocketStore = defineStore('rocket', {
  // --- STATE: Tempat menyimpan variabel/data utama aplikasi ---
  state: () => ({
    rockets: [] as Rocket[],             // Semua daftar roket (API + custom)
    customRockets: [] as Rocket[],       // Roket buatan user
    loading: false,                      // Status loading daftar roket
    error: null as string | null,        // Pesan error jika fetch daftar gagal

    selectedRocket: null as Rocket | null, // Roket yang sedang dipilih (Detail view)
    loadingDetail: false,                  // Status loading detail roket
    errorDetail: null as string | null,    // Pesan error jika fetch detail gagal

    searchQuery: '',                     // Kata kunci filter pencarian
  }),

  // --- GETTERS: Variabel komputasi/filter berdasarkan state ---
  getters: {
    // Filter roket berdasarkan nama atau deskripsi dari searchQuery
    filteredRockets(state): Rocket[] {
      if (!state.searchQuery.trim()) {
        return state.rockets
      }
      const query = state.searchQuery.toLowerCase().trim()
      return state.rockets.filter((rocket) => {
        const nameMatch = rocket.full_name?.toLowerCase().includes(query) || rocket.name?.toLowerCase().includes(query)
        const descMatch = rocket.description?.toLowerCase().includes(query)
        return nameMatch || descMatch
      })
    },
  },

  // --- ACTIONS: Fungsi untuk memodifikasi state / panggil API ---
  actions: {
    // Mengambil data roket buatan user dari localStorage
    loadCustomRocketsFromStorage() {
      try {
        const saved = localStorage.getItem(CUSTOM_ROCKETS_KEY)
        if (saved) {
          this.customRockets = JSON.parse(saved)
        }
      } catch (err) {
        console.error('Gagal membaca data roket dari localStorage:', err)
      }
    },

    // Menyimpan roket buatan user ke localStorage
    saveCustomRocketsToStorage() {
      try {
        localStorage.setItem(CUSTOM_ROCKETS_KEY, JSON.stringify(this.customRockets))
      } catch (err) {
        console.error('Gagal menyimpan data roket ke localStorage:', err)
      }
    },

    // Mengambil 20 data roket SpaceX dari API
    async fetchRockets() {
      this.loading = true
      this.error = null

      // Muat data roket lokal terlebih dahulu
      this.loadCustomRocketsFromStorage()

      try {
        const response = await fetch(
          `${API_BASE_URL}/?manufacturer__name=SpaceX&mode=detailed&limit=20`
        )

        if (!response.ok) {
          throw new Error(`Error HTTP ${response.status}: ${response.statusText}`)
        }

        const data: SpaceXApiResponse = await response.json()
        const apiRockets = data.results || []

        // Gabungkan roket lokal (di paling atas) dengan data dari API
        this.rockets = [...this.customRockets, ...apiRockets]
      } catch (err: any) {
        console.error('Gagal mengambil daftar roket:', err)
        this.error = err.message || 'Gagal memuat daftar roket. Silakan coba lagi.'

        // Jika API gagal tapi ada roket buatan user, tampilkan roket user
        if (this.customRockets.length > 0) {
          this.rockets = [...this.customRockets]
        }
      } finally {
        this.loading = false
      }
    },

    // Mengambil data detail 1 roket berdasarkan ID
    async fetchRocketById(id: string | number) {
      this.loadingDetail = true
      this.errorDetail = null
      this.selectedRocket = null

      const strId = String(id)

      // Cek apakah roket sudah ada di memori store (misal: roket buatan user)
      const existing = this.rockets.find((r) => String(r.id) === strId)
      if (existing) {
        this.selectedRocket = existing
        this.loadingDetail = false
        return
      }

      // Jika belum ada di memori, panggil API detail
      try {
        const response = await fetch(`${API_BASE_URL}/${id}/`)

        if (!response.ok) {
          throw new Error(`Error HTTP ${response.status}: ${response.statusText}`)
        }

        const data: Rocket = await response.json()
        this.selectedRocket = data
      } catch (err: any) {
        console.error(`Gagal memuat detail roket #${id}:`, err)
        this.errorDetail = err.message || 'Gagal memuat detail roket. Silakan coba lagi.'
      } finally {
        this.loadingDetail = false
      }
    },

    // Menambahkan roket baru buatan pengguna
    addRocket(newRocketData: Omit<Rocket, 'id'>) {
      const newRocket: Rocket = {
        ...newRocketData,
        id: `custom-${Date.now()}`,
        is_custom: true,
      }

      // Masukkan ke urutan teratas
      this.customRockets.unshift(newRocket)
      this.saveCustomRocketsToStorage()
      this.rockets.unshift(newRocket)
    },
  },
})
