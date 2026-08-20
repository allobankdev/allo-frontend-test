import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Rocket, NewRocketInput } from '@/types/rocket'
import { fetchRocketList, fetchRocketById as apiFetchRocketById } from '@/services/rocket.service'

export const useRocketStore = defineStore('rockets', () => {
  const rockets = ref<Rocket[]>([])
  const selectedRocket = ref<Rocket | null>(null)
  const initialized = ref(false)

  const listLoading = ref(false)
  const listError = ref<string | null>(null)

  const detailLoading = ref(false)
  const detailError = ref<string | null>(null)

  async function fetchRockets(signal?: AbortSignal, force = false): Promise<void> {
    if (initialized.value && !force) return

    listLoading.value = true
    listError.value = null

    try {
      rockets.value = await fetchRocketList(signal)
      initialized.value = true
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      listError.value =
        err instanceof Error ? err.message : 'Failed to load rockets. Please try again.'
    } finally {
      listLoading.value = false
    }
  }

  async function fetchRocketById(id: string | number, signal?: AbortSignal): Promise<void> {
    const cached = findRocketById(id)
    if (cached) {
      selectedRocket.value = cached
      return
    }

    if (String(id).startsWith('local-')) {
      detailError.value = 'This locally-added rocket could not be found in the current session.'
      selectedRocket.value = null
      return
    }

    detailLoading.value = true
    detailError.value = null

    try {
      const rocket = await apiFetchRocketById(id, signal)
      selectedRocket.value = rocket

      const exists = rockets.value.some((r) => String(r.id) === String(id))
      if (!exists) {
        rockets.value.push(rocket)
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      detailError.value =
        err instanceof Error ? err.message : 'Failed to load rocket details. Please try again.'
      selectedRocket.value = null
    } finally {
      detailLoading.value = false
    }
  }

  function findRocketById(id: string | number): Rocket | undefined {
    return rockets.value.find((r) => String(r.id) === String(id))
  }

  function addRocket(input: NewRocketInput): Rocket {
    const newRocket: Rocket = {
      id: `local-${crypto.randomUUID()}`,
      name: input.name.trim(),
      description: input.description.trim() || null,
      imageUrl: input.imageUrl.trim() || null,
      launchCost: input.launchCost.trim() || null,
      country: input.country.trim() || null,
      maidenFlight: input.maidenFlight.trim() || null,
      isLocal: true,
    }

    rockets.value = [newRocket, ...rockets.value]
    return newRocket
  }

  function clearErrors(): void {
    listError.value = null
    detailError.value = null
  }

  function clearSelectedRocket(): void {
    selectedRocket.value = null
    detailError.value = null
  }

  return {
    rockets,
    selectedRocket,
    initialized,
    listLoading,
    listError,
    detailLoading,
    detailError,
    fetchRockets,
    fetchRocketById,
    findRocketById,
    addRocket,
    clearErrors,
    clearSelectedRocket,
  }
})
