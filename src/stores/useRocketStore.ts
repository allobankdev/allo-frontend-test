import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getRocketList, toRocket } from '@/services/rocketApi'
import type { NewRocketInput, Rocket } from '@/types/rocket'

export type RocketStoreStatus = 'idle' | 'loading' | 'success' | 'error'

/** crypto.randomUUID() only works in a secure context (HTTPS/localhost) — this fallback keeps addRocket() working outside of one. */
function createLocalId (): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export const useRocketStore = defineStore('rocket', () => {
  const rockets = ref<Rocket[]>([])
  const status = ref<RocketStoreStatus>('idle')
  const errorMessage = ref<string | null>(null)
  const filterText = ref('')

  const filteredRockets = computed(() => {
    const keyword = filterText.value.trim().toLowerCase()
    if (!keyword) return rockets.value
    return rockets.value.filter(rocket => rocket.name.toLowerCase().includes(keyword))
  })

  const rocketById = computed(() => {
    return (id: string) => rockets.value.find(rocket => rocket.id === id)
  })

  async function fetchRockets () {
    if (status.value === 'loading') return

    status.value = 'loading'
    errorMessage.value = null

    try {
      const dtos = await getRocketList()
      const apiRockets = dtos.map(toRocket)
      // Locally-added rockets only exist in memory — a refetch must not drop them.
      const localRockets = rockets.value.filter(rocket => rocket.isLocal)
      rockets.value = [...localRockets, ...apiRockets]
      status.value = 'success'
    } catch (error) {
      status.value = 'error'
      errorMessage.value = error instanceof Error ? error.message : 'Gagal memuat data rocket'
    }
  }

  function addRocket (input: NewRocketInput) {
    const rocket: Rocket = {
      id: `local-${createLocalId()}`,
      name: input.name,
      description: input.description ?? null,
      imageUrl: input.imageUrl ?? null,
      costPerLaunch: input.costPerLaunch ?? null,
      country: input.country ?? null,
      firstFlight: input.firstFlight ?? null,
      isLocal: true,
    }
    rockets.value.unshift(rocket)
    return rocket
  }

  return {
    rockets,
    status,
    errorMessage,
    filterText,
    filteredRockets,
    rocketById,
    fetchRockets,
    addRocket,
  }
})
