import { computed, reactive, readonly } from 'vue'
import { getRocketById, getAllRocket } from '@/services/rocketApi'
import type { NewRocketPayload, Rocket } from '@/types/rocket'

interface RocketsState {
  rockets: Rocket[]
  localRockets: Rocket[]
  loading: boolean
  error: string | null
  filter: string
}

const state = reactive<RocketsState>({
  rockets: [],
  localRockets: [],
  loading: false,
  error: null,
  filter: '',
})

let localIdCounter = -1

// hanya pakai state management biasa tidak pakai global state seperti vuex / pinia
export function useRocketsStore () {
  const allRockets = computed(() => [...state.localRockets, ...state.rockets])

  const filteredRockets = computed(() => {
    const query = state.filter.trim().toLowerCase()
    if (!query) return allRockets.value

    return allRockets.value.filter((rocket) => {
      const name = rocket.full_name?.toLowerCase() ?? ''
      const description = rocket.description?.toLowerCase() ?? ''
      return name.includes(query) || description.includes(query)
    })
  })

  async function loadRockets (): Promise<void> {
    state.loading = true
    state.error = null

    try {
       state.rockets = await getAllRocket()
      
    } catch (err) {
      state.error = err instanceof Error ? err.message : 'Something went wrong'
    } finally {
      state.loading = false
    }
  }

  function setFilter (value: string): void {
    state.filter = value
  }

  function addLocalRocket (payload: NewRocketPayload): void {
    const rocket: Rocket = {
      id: localIdCounter--,
      full_name: payload.full_name,
      description: payload.description,
      image_url: payload.image_url ?? null,
      launch_cost: payload.launch_cost ?? null,
      maiden_flight: payload.maiden_flight ?? null,
      manufacturer: payload.country_code
        ? { id: 0, name: 'Custom', country_code: payload.country_code }
        : null,
      isLocal: true,
    }

    state.localRockets.unshift(rocket)
  }

  function getLocalRocketById (id: number): Rocket | undefined {
    return state.localRockets.find((rocket) => rocket.id === id)
  }

  async function getRocketById (id: number): Promise<Rocket> {
    const localRocket = getLocalRocketById(id)
    if (localRocket) return localRocket

    const cached = state.rockets.find((rocket) => rocket.id === id)
    if (cached) return cached

    return getRocketById(id)
  }

  return {
    state: readonly(state),
    allRockets,
    filteredRockets,
    loadRockets,
    setFilter,
    addLocalRocket,
    getLocalRocketById,
    getRocketById,
  }
}
