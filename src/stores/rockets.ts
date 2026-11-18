import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { ApiError, fetchRocketById, fetchSpaceXRockets } from '@/api/launchLibrary'
import { fromNewRocketInput, toRocket } from '@/types/mappers'
import type { LoadStatus, NewRocketInput, Rocket } from '@/types/rocket'

const NETWORK_ERROR = 'Failed to load rocket data. Check your internet connection and try again.'
const NOT_FOUND_ERROR = 'Rocket not found.'

function describeError(error: unknown): string {
  return error instanceof ApiError && error.status === 404 ? NOT_FOUND_ERROR : NETWORK_ERROR
}

export const useRocketStore = defineStore('rockets', () => {
  const apiRockets = ref<Rocket[]>([])
  const localRockets = ref<Rocket[]>([])
  const listStatus = ref<LoadStatus>('idle')
  const listError = ref<string | null>(null)
  const searchQuery = ref('')

  /** State of the rocket currently shown on the detail screen. */
  const detail = ref<{ id: string; status: LoadStatus; rocket: Rocket | null; error: string | null }>({
    id: '',
    status: 'idle',
    rocket: null,
    error: null,
  })

  /** Locally added rockets first so new entries are visible at the top. */
  const allRockets = computed(() => [...localRockets.value, ...apiRockets.value])

  const filteredRockets = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()
    if (!query) return allRockets.value
    return allRockets.value.filter((rocket) =>
      [rocket.name, rocket.description, rocket.country]
        .some((field) => field?.toLowerCase().includes(query)),
    )
  })

  function findRocket(id: string): Rocket | undefined {
    return allRockets.value.find((rocket) => rocket.id === id)
  }

  /** Loads the list once; pass `force` to refetch (used by the retry button). */
  async function loadRockets(force = false) {
    if (!force && (listStatus.value === 'loading' || listStatus.value === 'success')) return

    listStatus.value = 'loading'
    listError.value = null
    try {
      const rockets = await fetchSpaceXRockets()
      apiRockets.value = rockets.map(toRocket)
      listStatus.value = 'success'
    } catch (error) {
      listError.value = describeError(error)
      listStatus.value = 'error'
    }
  }

  /** Resolves a rocket from the cached list, the local list, or the API. */
  async function loadRocketDetail(id: string) {
    const cached = findRocket(id)
    if (cached) {
      detail.value = { id, status: 'success', rocket: cached, error: null }
      return
    }
    if (!id.startsWith('api-')) {
      // Local rockets only live in memory; after a reload they are gone.
      detail.value = { id, status: 'error', rocket: null, error: NOT_FOUND_ERROR }
      return
    }

    detail.value = { id, status: 'loading', rocket: null, error: null }
    try {
      const rocket = toRocket(await fetchRocketById(Number(id.slice('api-'.length))))
      // Ignore the response if the user has already moved to another rocket.
      if (detail.value.id === id) {
        detail.value = { id, status: 'success', rocket, error: null }
      }
    } catch (error) {
      if (detail.value.id === id) {
        detail.value = { id, status: 'error', rocket: null, error: describeError(error) }
      }
    }
  }

  function addLocalRocket(input: NewRocketInput): Rocket {
    const rocket = fromNewRocketInput(input)
    localRockets.value = [rocket, ...localRockets.value]
    return rocket
  }

  return {
    listStatus,
    listError,
    searchQuery,
    detail,
    filteredRockets,
    findRocket,
    loadRockets,
    loadRocketDetail,
    addLocalRocket,
  }
})
