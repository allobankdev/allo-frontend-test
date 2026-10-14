/**
 * stores/rockets.ts
 *
 * Shared rocket state: SpaceX rockets from the API, rockets added locally
 * during this session, and the status of the list request.
 */

import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchRocketById, fetchSpaceXRockets } from '@/services/rocketService'
import type { RequestStatus } from '@/types/request'
import type { NewRocketInput, Rocket } from '@/types/rocket'
import { AppError, toAppError } from '@/utils/errors'

// API ids are numeric, so ids with this prefix can never collide with them.
const LOCAL_ID_PREFIX = 'local-'
let localRocketCount = 0

function createLocalId (): string {
  localRocketCount += 1
  return `${LOCAL_ID_PREFIX}${Date.now()}-${localRocketCount}`
}

export const useRocketsStore = defineStore('rockets', () => {
  // State
  const apiRockets = ref<Rocket[]>([])
  const localRockets = ref<Rocket[]>([])
  const status = ref<RequestStatus>('idle')
  const errorMessage = ref<string | null>(null)

  // Getters
  /** Local rockets first, so a newly added rocket shows at the top of the list. */
  const rockets = computed(() => [...localRockets.value, ...apiRockets.value])

  function getRocketById (id: string): Rocket | undefined {
    return rockets.value.find(rocket => rocket.id === id)
  }

  // Actions
  /** Loads the list once per session. Calling it again after a failure is the retry. */
  async function fetchRockets (): Promise<void> {
    if (status.value === 'loading' || status.value === 'success') return

    status.value = 'loading'
    errorMessage.value = null
    try {
      apiRockets.value = await fetchSpaceXRockets()
      status.value = 'success'
    } catch (error) {
      errorMessage.value = toAppError(error).message
      status.value = 'error'
    }
  }

  /**
   * Finds a rocket for the detail screen. The list is fetched with `mode=detailed`,
   * so a rocket already in state has every field and needs no request. Otherwise
   * (e.g. after a page refresh) the single rocket is fetched from the API.
   */
  async function fetchRocketDetail (id: string): Promise<Rocket> {
    const rocket = getRocketById(id)
    if (rocket) return rocket

    if (id.startsWith(LOCAL_ID_PREFIX)) {
      throw new AppError(
        'This rocket was added locally and is no longer available. Locally added rockets are cleared when the page is refreshed.',
        { retryable: false },
      )
    }
    if (!/^\d+$/.test(id)) {
      throw new AppError('This rocket could not be found.', { retryable: false })
    }
    return fetchRocketById(id)
  }

  function addRocket (input: NewRocketInput): Rocket {
    const rocket: Rocket = { ...input, id: createLocalId(), source: 'local' }
    localRockets.value.unshift(rocket)
    return rocket
  }

  return {
    apiRockets,
    localRockets,
    status,
    errorMessage,
    rockets,
    getRocketById,
    fetchRockets,
    fetchRocketDetail,
    addRocket,
  }
})
