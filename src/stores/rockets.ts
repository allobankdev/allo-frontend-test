import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchRocket, fetchRockets } from '@/services/rocketApi'
import type { NewRocketInput, Rocket, RocketDetailState, RequestStatus } from '@/types/rocket'
import { normalizeRocket } from '@/utils/rocket'

const initialDetailState = (): RocketDetailState => ({
  status: 'idle',
  rocket: null,
  errorMessage: null,
})

const expiredLocalRocketState = (): RocketDetailState => ({
  status: 'error',
  rocket: null,
  errorMessage: 'This custom rocket was only available in the previous browser session. Return to the catalogue to add it again.',
})

export const useRocketStore = defineStore('rockets', () => {
  const rockets = ref<Rocket[]>([])
  const listStatus = ref<RequestStatus>('idle')
  const listError = ref<string | null>(null)
  const filterQuery = ref('')
  const details = ref<Record<string, RocketDetailState>>({})

  const filteredRockets = computed(() => {
    const query = (filterQuery.value || '').trim().toLocaleLowerCase()
    if (!query) return rockets.value

    return rockets.value.filter(rocket =>
      `${rocket.name} ${rocket.description}`.toLocaleLowerCase().includes(query),
    )
  })

  async function loadRockets () {
    listStatus.value = 'loading'
    listError.value = null

    try {
      const apiRockets = (await fetchRockets()).results.map(normalizeRocket)
      const localRockets = rockets.value.filter(rocket => rocket.source === 'local')
      rockets.value = [...localRockets, ...apiRockets]
      listStatus.value = 'success'
    } catch (error) {
      listStatus.value = 'error'
      listError.value = error instanceof Error ? error.message : 'Rocket data could not be loaded.'
    }
  }

  function addRocket (input: NewRocketInput) {
    const rocket: Rocket = {
      id: `local-${crypto.randomUUID()}`,
      source: 'local',
      name: input.name.trim(),
      description: input.description.trim(),
      imageUrl: input.imageUrl?.trim() || null,
      launchCost: input.launchCost?.trim() || null,
      country: input.country?.trim() || null,
      firstFlight: input.firstFlight?.trim() || null,
    }

    rockets.value = [rocket, ...rockets.value]
    details.value[rocket.id] = { status: 'success', rocket, errorMessage: null }
  }

  function getKnownRocket (id: string) {
    return rockets.value.find(rocket => rocket.id === id) || null
  }

  function detailFor (id: string): RocketDetailState {
    const knownRocket = getKnownRocket(id)
    if (knownRocket) return { status: 'success', rocket: knownRocket, errorMessage: null }
    if (id.startsWith('local-')) return expiredLocalRocketState()

    return details.value[id] || initialDetailState()
  }

  async function loadRocket (id: string) {
    if (getKnownRocket(id) || id.startsWith('local-')) return
    if (details.value[id]?.status === 'loading') return

    details.value[id] = { status: 'loading', rocket: null, errorMessage: null }

    try {
      const rocket = normalizeRocket(await fetchRocket(id))
      details.value[id] = { status: 'success', rocket, errorMessage: null }
    } catch (error) {
      details.value[id] = {
        status: 'error',
        rocket: null,
        errorMessage: error instanceof Error ? error.message : 'Rocket details could not be loaded.',
      }
    }
  }

  return {
    details,
    filterQuery,
    filteredRockets,
    listError,
    listStatus,
    rockets,
    addRocket,
    detailFor,
    loadRocket,
    loadRockets,
  }
})
