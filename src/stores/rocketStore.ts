import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Rocket, NewRocketPayload } from '@/types/rocket'
import { fetchRocketList } from '@/api/rocketApi'

export const useRocketStore = defineStore('rocket', () => {
  // --- state ---
  const apiRockets = ref<Rocket[]>([])
  const localRockets = ref<Rocket[]>([])
  const filterKeyword = ref('')
  const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
  const errorMessage = ref('')

  const filteredRockets = computed<Rocket[]>(() => {
    const all = [...localRockets.value, ...apiRockets.value]
    const keyword = (filterKeyword.value ?? '').trim()
    if (!keyword) return all
    return all.filter((r) =>
      r.full_name?.toLowerCase().includes(keyword.toLowerCase()),
    )
  })

  function getRocketById(id: string): Rocket | undefined {
    return [...localRockets.value, ...apiRockets.value].find((r) => r.id === id)
  }

  // --- actions ---
  async function fetchRockets(): Promise<void> {
    status.value = 'loading'
    errorMessage.value = ''

    try {
      apiRockets.value = await fetchRocketList()
      status.value = 'success'
    } catch (err: unknown) {
      console.error(err)
      errorMessage.value = 'Failed to fetch rocket data. Check your internet connection.'
      status.value = 'error'
    }
  }

  function addLocalRocket(payload: NewRocketPayload): void {
    const rocket: Rocket = {
      id: `local-${crypto.randomUUID()}`,
      full_name: payload.full_name,
      description: payload.description || null,
      image_url: payload.image_url || null,
      launch_cost: payload.launch_cost || null,
      maiden_flight: payload.maiden_flight || null,
      manufacturer: { country_code: payload.country_code || null },
      isLocal: true,
    }
    localRockets.value.push(rocket)
  }

  return {
    // state
    apiRockets,
    filterKeyword,
    status,
    errorMessage,
    // getters
    filteredRockets,
    getRocketById,
    // actions
    fetchRockets,
    addLocalRocket,
  }
})
