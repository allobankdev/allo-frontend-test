import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchRocketById, fetchRockets } from '@/services/rocketApi'
import type { LoadStatus, Rocket } from '@/types/rocket'

export interface NewRocketInput {
  name: string
  description: string
  imageUrl: string
  launchCost: number | null
  countryCode: string
  maidenFlight: string
}

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong'
}

function blankToNull(value: string): string | null {
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

export const useRocketStore = defineStore('rocket', () => {
  const remoteRockets = ref<Rocket[]>([])
  const localRockets = ref<Rocket[]>([])
  const listStatus = ref<LoadStatus>('idle')
  const listError = ref<string | null>(null)

  const detail = ref<Rocket | null>(null)
  const detailStatus = ref<LoadStatus>('idle')
  const detailError = ref<string | null>(null)
  const detailCache = ref<Record<string, Rocket>>({})

  const searchQuery = ref<string | null>('')
  const countryFilter = ref<string | null>(null)

  let listController: AbortController | null = null
  let detailController: AbortController | null = null

  const rockets = computed(() => [...localRockets.value, ...remoteRockets.value])

  const countries = computed(() => {
    const codes = rockets.value
      .map((rocket) => rocket.countryCode)
      .filter((code): code is string => code !== null)
    return [...new Set(codes)].sort()
  })

  const filteredRockets = computed(() => {
    const query = (searchQuery.value ?? '').trim().toLowerCase()
    return rockets.value.filter((rocket) => {
      const matchesCountry = !countryFilter.value || rocket.countryCode === countryFilter.value
      const matchesQuery =
        !query ||
        rocket.name.toLowerCase().includes(query) ||
        (rocket.description ?? '').toLowerCase().includes(query)
      return matchesCountry && matchesQuery
    })
  })

  async function loadRockets() {
    listController?.abort()
    const controller = new AbortController()
    listController = controller
    listStatus.value = 'loading'
    listError.value = null
    try {
      remoteRockets.value = await fetchRockets(controller.signal)
      listStatus.value = 'success'
    } catch (error) {
      if (controller.signal.aborted) return
      listError.value = toMessage(error)
      listStatus.value = 'error'
    }
  }

  async function loadDetail(id: string) {
    detailController?.abort()
    detailError.value = null

    const local = localRockets.value.find((rocket) => rocket.id === id)
    if (local) {
      detail.value = local
      detailStatus.value = 'success'
      return
    }

    const cached = detailCache.value[id]
    if (cached) {
      detail.value = cached
      detailStatus.value = 'success'
      return
    }

    const controller = new AbortController()
    detailController = controller
    detail.value = null
    detailStatus.value = 'loading'
    try {
      const rocket = await fetchRocketById(id, controller.signal)
      detailCache.value[id] = rocket
      detail.value = rocket
      detailStatus.value = 'success'
    } catch (error) {
      if (controller.signal.aborted) return
      detailError.value = toMessage(error)
      detailStatus.value = 'error'
    }
  }

  function addRocket(input: NewRocketInput): Rocket {
    const rocket: Rocket = {
      id: `local-${crypto.randomUUID()}`,
      name: input.name.trim(),
      description: blankToNull(input.description),
      imageUrl: blankToNull(input.imageUrl),
      launchCost: input.launchCost && input.launchCost > 0 ? input.launchCost : null,
      countryCode: blankToNull(input.countryCode),
      maidenFlight: blankToNull(input.maidenFlight),
      isLocal: true,
    }
    localRockets.value.unshift(rocket)
    return rocket
  }

  function resetFilters() {
    searchQuery.value = ''
    countryFilter.value = null
  }

  return {
    rockets,
    countries,
    filteredRockets,
    listStatus,
    listError,
    detail,
    detailStatus,
    detailError,
    searchQuery,
    countryFilter,
    loadRockets,
    loadDetail,
    addRocket,
    resetFilters,
  }
})