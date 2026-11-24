import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchRocketById, fetchRockets } from '@/api/rocketApi'
import type { LoadStatus, NewRocketInput, Rocket } from '@/types/rocket'
import { isAbortError, toErrorMessage } from '@/utils/errorMessage'

function normalizeOptionalString (value: string | null): string | null {
  if (typeof value !== 'string') {
    return null
  }
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export const useRocketStore = defineStore('rockets', () => {
  const apiRockets = ref<Rocket[]>([])
  const localRockets = ref<Rocket[]>([])
  const listStatus = ref<LoadStatus>('idle')
  const listError = ref<string | null>(null)
  const searchQuery = ref('')

  const selectedRocket = ref<Rocket | null>(null)
  const detailStatus = ref<LoadStatus>('idle')
  const detailError = ref<string | null>(null)

  let listController: AbortController | null = null
  let detailController: AbortController | null = null
  let nextLocalId = 1

  const allRockets = computed<Rocket[]>(() => [
    ...localRockets.value,
    ...apiRockets.value,
  ])

  const filteredRockets = computed<Rocket[]>(() => {
    const query = searchQuery.value.trim().toLowerCase()
    if (!query) {
      return allRockets.value
    }
    return allRockets.value.filter(rocket =>
      rocket.name.toLowerCase().includes(query),
    )
  })

  const hasActiveFilter = computed<boolean>(() =>
    searchQuery.value.trim().length > 0,
  )

  async function loadRockets (force = false): Promise<void> {
    if (!force && (listStatus.value === 'loading' || listStatus.value === 'success')) {
      return
    }

    if (listController) {
      listController.abort()
    }

    const controller = new AbortController()
    listController = controller
    listStatus.value = 'loading'
    listError.value = null

    try {
      const results = await fetchRockets(controller.signal)
      if (controller !== listController) {
        return
      }
      apiRockets.value = results
      listStatus.value = 'success'
    } catch (error: unknown) {
      if (controller !== listController) {
        return
      }
      if (isAbortError(error)) {
        listStatus.value = 'idle'
        return
      }
      listError.value = toErrorMessage(error)
      listStatus.value = 'error'
    } finally {
      if (controller === listController) {
        listController = null
      }
    }
  }

  async function retryLoadRockets (): Promise<void> {
    await loadRockets(true)
  }

  async function loadRocketDetail (id: string): Promise<void> {
    if (detailController) {
      detailController.abort()
      detailController = null
    }

    selectedRocket.value = null
    detailError.value = null

    const localMatch = localRockets.value.find(rocket => rocket.id === id)
    if (localMatch) {
      selectedRocket.value = localMatch
      detailStatus.value = 'success'
      return
    }

    if (id.startsWith('local-')) {
      detailError.value = 'Rocket not found.'
      detailStatus.value = 'error'
      return
    }

    const apiMatch = apiRockets.value.find(rocket => rocket.id === id)
    if (apiMatch) {
      selectedRocket.value = apiMatch
      detailStatus.value = 'success'
      return
    }

    const controller = new AbortController()
    detailController = controller
    detailStatus.value = 'loading'

    try {
      const rocket = await fetchRocketById(id, controller.signal)
      if (controller !== detailController) {
        return
      }
      selectedRocket.value = rocket
      detailStatus.value = 'success'
    } catch (error: unknown) {
      if (controller !== detailController) {
        return
      }
      if (isAbortError(error)) {
        detailStatus.value = 'idle'
        return
      }
      detailError.value = toErrorMessage(error)
      detailStatus.value = 'error'
    } finally {
      if (controller === detailController) {
        detailController = null
      }
    }
  }

  function cancelDetailLoad (): void {
    if (detailController) {
      detailController.abort()
      detailController = null
    }
    if (detailStatus.value === 'loading') {
      detailStatus.value = 'idle'
    }
  }

  function addLocalRocket (input: NewRocketInput): Rocket {
    const trimmedName = input.name.trim()
    if (!trimmedName) {
      throw new Error('Rocket name is required')
    }

    const validCost =
      input.launchCost !== null && Number.isFinite(input.launchCost)
        ? input.launchCost
        : null

    const rocket: Rocket = {
      id: `local-${nextLocalId++}`,
      name: trimmedName,
      description: normalizeOptionalString(input.description),
      imageUrl: normalizeOptionalString(input.imageUrl),
      launchCost: validCost,
      country: normalizeOptionalString(input.country),
      maidenFlight: normalizeOptionalString(input.maidenFlight),
      isLocal: true,
    }

    localRockets.value = [rocket, ...localRockets.value]
    return rocket
  }

  return {
    apiRockets,
    localRockets,
    listStatus,
    listError,
    searchQuery,
    selectedRocket,
    detailStatus,
    detailError,
    allRockets,
    filteredRockets,
    hasActiveFilter,
    loadRockets,
    retryLoadRockets,
    loadRocketDetail,
    cancelDetailLoad,
    addLocalRocket,
  }
})
