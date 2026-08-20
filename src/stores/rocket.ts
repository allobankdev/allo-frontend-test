import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { getRocket, getRockets } from '@/services/rocketApi'
import type {
  DetailLoadState,
  LoadStatus,
  NewRocketInput,
  Rocket,
  RocketId,
} from '@/types/rocket'
import { getRequestErrorMessage, isAbortError } from '@/utils/rocket'

interface LoadOptions {
  force?: boolean
  signal?: AbortSignal
}

export const useRocketStore = defineStore('rockets', () => {
  const remoteRockets = ref<Rocket[]>([])
  const localRockets = ref<Rocket[]>([])
  const rocketDetails = ref<Record<string, Rocket>>({})
  const listStatus = ref<LoadStatus>('idle')
  const listError = ref<string | null>(null)
  const detailStates = reactive<Record<string, DetailLoadState>>({})

  let listRequestId = 0
  const detailRequestIds = new Map<string, number>()

  const rockets = computed(() => [
    ...localRockets.value,
    ...remoteRockets.value,
  ])

  function findRocket (id: RocketId): Rocket | undefined {
    const key = String(id)
    return rocketDetails.value[key]
      ?? rockets.value.find(rocket => String(rocket.id) === key)
  }

  function getDetailState (id: RocketId): DetailLoadState {
    return detailStates[String(id)] ?? { status: 'idle', error: null }
  }

  async function loadRockets (options: LoadOptions = {}): Promise<void> {
    if (listStatus.value === 'success' && !options.force) return

    const requestId = ++listRequestId
    listStatus.value = 'loading'
    listError.value = null

    try {
      const response = await getRockets(options.signal)
      if (requestId !== listRequestId) return

      remoteRockets.value = response
      listStatus.value = 'success'
    } catch (error) {
      if (requestId !== listRequestId) return

      if (isAbortError(error)) {
        listStatus.value = remoteRockets.value.length > 0 ? 'success' : 'idle'
        return
      }

      listStatus.value = 'error'
      listError.value = getRequestErrorMessage(error)
    }
  }

  async function loadRocket (
    id: RocketId,
    options: LoadOptions = {},
  ): Promise<void> {
    const key = String(id)
    const existing = findRocket(id)

    if (existing?.is_local) {
      rocketDetails.value[key] = existing
      detailStates[key] = { status: 'success', error: null }
      return
    }

    if (detailStates[key]?.status === 'success' && !options.force) return

    const requestId = (detailRequestIds.get(key) ?? 0) + 1
    detailRequestIds.set(key, requestId)
    detailStates[key] = { status: 'loading', error: null }

    try {
      const response = await getRocket(id, options.signal)
      if (detailRequestIds.get(key) !== requestId) return

      rocketDetails.value[key] = response
      detailStates[key] = { status: 'success', error: null }
    } catch (error) {
      if (detailRequestIds.get(key) !== requestId) return

      if (isAbortError(error)) {
        detailStates[key] = { status: 'idle', error: null }
        return
      }

      detailStates[key] = {
        status: 'error',
        error: getRequestErrorMessage(error),
      }
    }
  }

  function addRocket (input: NewRocketInput): Rocket {
    const id = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const rocket: Rocket = {
      id,
      full_name: input.fullName.trim(),
      description: input.description.trim() || null,
      image_url: input.imageUrl.trim() || null,
      launch_cost: input.launchCost.trim() || null,
      maiden_flight: input.maidenFlight || null,
      manufacturer: {
        name: 'Local entry',
        country_code: input.countryCode.trim().toUpperCase() || null,
      },
      is_local: true,
    }

    localRockets.value.unshift(rocket)
    rocketDetails.value[String(id)] = rocket
    detailStates[String(id)] = { status: 'success', error: null }

    return rocket
  }

  return {
    rockets,
    listStatus,
    listError,
    addRocket,
    findRocket,
    getDetailState,
    loadRocket,
    loadRockets,
  }
})
