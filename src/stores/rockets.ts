import { reactive, computed } from 'vue'
import type { Rocket } from '@/types/rocket'

const API_BASE = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'

const state = reactive({
  rockets: [] as Rocket[],
  customRockets: [] as Rocket[],
  loading: false,
  error: null as string | null,
})

export const useRocketStore = () => {
  const allRockets = computed(() => [...state.customRockets, ...state.rockets])

  const fetchRockets = async () => {
    if (state.rockets.length > 0) return

    state.loading = true
    state.error = null

    try {
      const response = await fetch(`${API_BASE}/?manufacturer__name=SpaceX&mode=detailed&limit=20`)
      if (!response.ok) {
        throw new Error(`Gagal ngambil data roket (${response.status})`)
      }
      const data = await response.json()
      state.rockets = data.results || []
    } catch (err) {
      state.error = err instanceof Error ? err.message : 'Terjadi kendala saat memuat data'
    } finally {
      state.loading = false
    }
  }

  const addRocket = (newRocket: Rocket) => {
    state.customRockets.unshift(newRocket)
  }

  const getRocketById = async (id: number | string): Promise<{ rocket: Rocket | null; error: string | null }> => {
    const existing = allRockets.value.find(r => String(r.id) === String(id))
    if (existing) {
      return { rocket: existing, error: null }
    }

    try {
      const response = await fetch(`${API_BASE}/${id}/`)
      if (!response.ok) {
        throw new Error(`Gagal ngambil detail roket (${response.status})`)
      }
      const data = await response.json()
      return { rocket: data, error: null }
    } catch (err) {
      return {
        rocket: null,
        error: err instanceof Error ? err.message : 'Gagal memuat detail roket',
      }
    }
  }

  return {
    state,
    allRockets,
    fetchRockets,
    addRocket,
    getRocketById,
  }
}
