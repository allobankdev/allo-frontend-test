import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchRocketById, fetchRockets } from '@/services/rocketService'
import type { Rocket } from '@/types/rocket'

export type NewRocketInput = Omit<Rocket, 'id'>

function parseRocketId(id: number | string): number | null {
  if (typeof id === 'number') {
    return Number.isInteger(id) ? id : null
  }

  const trimmed = id.trim()
  if (trimmed.length === 0) {
    return null
  }

  const parsed = Number(trimmed)
  return Number.isInteger(parsed) ? parsed : null
}

function getReadableErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message.trim().length > 0) {
    return err.message
  }

  return fallback
}

export const useRocketStore = defineStore('rockets', () => {
  // API rocket list state
  const apiRockets = ref<Rocket[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const hasFetched = ref<boolean>(false)

  // Local user-created rockets state (in-memory only)
  const customRockets = ref<Rocket[]>([])

  // Single rocket detail state & cache
  const rocketDetailCache = ref<Record<number, Rocket>>({})
  const isDetailLoading = ref<boolean>(false)
  const detailError = ref<string | null>(null)

  let inFlightListRequest: Promise<Rocket[]> | null = null
  const inFlightDetailRequests = new Map<number, Promise<Rocket | undefined>>()

  /**
   * Combined list of user-created and API rockets, deduplicated by `id`.
   */
  const allRockets = computed<Rocket[]>(() => {
    const seenIds = new Set<number>()
    const combined: Rocket[] = []

    for (const rocket of [...customRockets.value, ...apiRockets.value]) {
      if (!seenIds.has(rocket.id)) {
        seenIds.add(rocket.id)
        combined.push(rocket)
      }
    }

    return combined
  })

  function findRocketById(id: number | string): Rocket | undefined {
    const parsedId = parseRocketId(id)
    if (parsedId === null) {
      return undefined
    }

    const fromCustom = customRockets.value.find(rocket => rocket.id === parsedId)
    if (fromCustom) {
      return fromCustom
    }

    const fromApi = apiRockets.value.find(rocket => rocket.id === parsedId)
    if (fromApi) {
      return fromApi
    }

    return rocketDetailCache.value[parsedId]
  }

  async function loadRockets(force = false): Promise<Rocket[]> {
    if (!force && hasFetched.value && apiRockets.value.length > 0) {
      return apiRockets.value
    }

    if (inFlightListRequest) {
      return inFlightListRequest
    }

    isLoading.value = true
    error.value = null

    inFlightListRequest = (async () => {
      try {
        const rockets = await fetchRockets()
        apiRockets.value = rockets
        hasFetched.value = true
        return rockets
      } catch (err: unknown) {
        error.value = getReadableErrorMessage(err, 'Failed to load SpaceX rockets.')
        return apiRockets.value
      } finally {
        isLoading.value = false
        inFlightListRequest = null
      }
    })()

    return inFlightListRequest
  }

  async function loadRocketById(id: number | string): Promise<Rocket | undefined> {
    const parsedId = parseRocketId(id)
    if (parsedId === null) {
      detailError.value = 'Invalid rocket ID.'
      return undefined
    }

    const existing = findRocketById(parsedId)
    if (existing) {
      detailError.value = null
      return existing
    }

    // Local rockets use negative IDs; if not in `customRockets`, do not query the API.
    if (parsedId <= 0) {
      detailError.value = 'Rocket not found.'
      return undefined
    }

    const existingRequest = inFlightDetailRequests.get(parsedId)
    if (existingRequest) {
      return existingRequest
    }

    isDetailLoading.value = true
    detailError.value = null

    const request = (async () => {
      try {
        const rocket = await fetchRocketById(parsedId)
        rocketDetailCache.value[parsedId] = rocket
        return rocket
      } catch (err: unknown) {
        detailError.value = getReadableErrorMessage(err, 'Failed to load rocket details.')
        return undefined
      } finally {
        inFlightDetailRequests.delete(parsedId)
        isDetailLoading.value = inFlightDetailRequests.size > 0
      }
    })()

    inFlightDetailRequests.set(parsedId, request)
    return request
  }

  function addCustomRocket(rocketInput: NewRocketInput): Rocket {
    const minExistingId = customRockets.value.reduce(
      (minId, rocket) => Math.min(minId, rocket.id),
      0,
    )
    const localId = minExistingId - 1

    const newRocket: Rocket = {
      id: localId,
      full_name: rocketInput.full_name ?? null,
      image_url: rocketInput.image_url ?? null,
      description: rocketInput.description ?? null,
      launch_cost: rocketInput.launch_cost ?? null,
      maiden_flight: rocketInput.maiden_flight ?? null,
      manufacturer: rocketInput.manufacturer ?? null,
    }

    customRockets.value.unshift(newRocket)
    return newRocket
  }

  return {
    apiRockets,
    customRockets,
    rocketDetailCache,
    isLoading,
    error,
    hasFetched,
    isDetailLoading,
    detailError,
    allRockets,
    loadRockets,
    loadRocketById,
    addCustomRocket,
    findRocketById,
  }
})
