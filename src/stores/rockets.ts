import { computed, ref } from 'vue'
import type { Rocket } from '@/types/rocket'
import { fetchRockets } from '@/services/rocketService'

export type LoadStatus = 'idle' | 'loading' | 'error' | 'success'

// State (module-scope = singleton)
const status = ref<LoadStatus>('idle')
const apiRockets = ref<Rocket[]>([])
const localRockets = ref<Rocket[]>([])
const keyword = ref('')

// Computed
const allRockets = computed(() => [...localRockets.value, ...apiRockets.value])

const filteredRockets = computed(() => {
  const query = keyword.value.trim().toLowerCase()
  if (!query) return allRockets.value
  return allRockets.value.filter((rocket) =>
    rocket.name.toLowerCase().includes(query),
  )
})

// Actions
async function loadRockets() {
  if (status.value === 'success' || status.value === 'loading') return

  status.value = 'loading'
  try {
    apiRockets.value = await fetchRockets()
    status.value = 'success'
  } catch {
    apiRockets.value = []
    status.value = 'error'
  }
}

function retry() {
  status.value = 'idle'
  loadRockets()
}

function addRocket(name: string, description: string, image: string | null) {
  localRockets.value = [
    {
      id: `local-${Date.now()}`,
      name,
      description,
      image,
      launchCost: null,
      country: null,
      firstFlight: null,
      isLocal: true,
    },
    ...localRockets.value,
  ]
}

export function useRockets() {
  return {
    status,
    keyword,
    allRockets,
    filteredRockets,
    loadRockets,
    retry,
    addRocket,
  }
}
