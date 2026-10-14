import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchRockets } from '@/api/launchLibrary'
import type { NewRocketInput, Rocket, RequestStatus } from '@/types/rocket'

export type SortOrder = 'asc' | 'desc'

export const useRocketStore = defineStore('rocket', () => {
  const rockets = ref<Rocket[]>([])
  const status = ref<RequestStatus>('idle')
  const errorMessage = ref('')
  const filterText = ref('')
  const sortOrder = ref<SortOrder>('asc')

  const filteredRockets = computed(() => {
    const query = filterText.value.trim().toLowerCase()
    const filtered = query
      ? rockets.value.filter(rocket => rocket.name.toLowerCase().includes(query))
      : rockets.value.slice()

    return filtered.sort((a, b) => sortOrder.value === 'asc'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name))
  })

  async function loadRockets () {
    status.value = 'loading'
    errorMessage.value = ''
    try {
      rockets.value = await fetchRockets()
      status.value = 'success'
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Something went wrong'
      status.value = 'error'
    }
  }

  function addRocket (input: NewRocketInput) {
    rockets.value = [{ ...input, id: `local-${Date.now()}` }, ...rockets.value]
  }

  function findRocket (id: string): Rocket | undefined {
    return rockets.value.find(rocket => rocket.id === id)
  }

  return {
    rockets,
    status,
    errorMessage,
    filterText,
    sortOrder,
    filteredRockets,
    loadRockets,
    addRocket,
    findRocket,
  }
})
