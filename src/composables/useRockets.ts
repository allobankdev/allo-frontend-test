import { ref } from 'vue'

export interface Rocket {
  id?: string | number
  full_name: string
  description?: string | null
  image_url?: string | null
  launch_cost?: string | null
  maiden_flight?: string | null
  manufacturer?: {
    country_code?: string | null
  } | null
  [key: string]: unknown
}

export const rockets = ref<Rocket[]>([])
export const loading = ref(true)
export const error = ref<string | null>(null)

export const fetchRockets = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await fetch('https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20')
    if (!response.ok) throw new Error('Failed to fetch rocket data')
    const data = await response.json()
    
    const localRockets = rockets.value.filter((r: Rocket) => String(r.id).startsWith('local-'))
    rockets.value = [...localRockets, ...data.results]
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = 'An unknown error occurred'
    }
  } finally {
    loading.value = false
  }
}

export const addLocalRocket = (newRocket: Rocket) => {
  const rocketWithId = { ...newRocket, id: `local-${Date.now()}` }
  rockets.value.unshift(rocketWithId)
}