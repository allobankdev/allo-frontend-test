import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export interface Rocket {
  id: number | string
  full_name: string | null
  description: string | null
  image_url: string | null
  launch_cost: string | null
  maiden_flight: string | null
  manufacturer: { country_code: string | null } | null
  local?: boolean
}

interface RocketResponse { results: Rocket[] }

const API_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed'

export const useRocketStore = defineStore('rockets', () => {
  const rockets = ref<Rocket[]>([])
  const loading = ref(false)
  const error = ref('')
  let localSequence = 0

  const hasRockets = computed(() => rockets.value.length > 0)
  const byId = (id: string) => rockets.value.find(rocket => String(rocket.id) === id)

  async function fetchRockets (force = false) {
    if (hasRockets.value && !force) return
    loading.value = true
    error.value = ''
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error(`Request failed (${response.status})`)
      const data = await response.json() as RocketResponse
      if (!Array.isArray(data.results)) throw new Error('Invalid API response')
      const locals = rockets.value.filter(rocket => rocket.local)
      rockets.value = [...locals, ...data.results]
    } catch (reason) {
      error.value = reason instanceof Error ? reason.message : 'Unable to load rockets'
    } finally {
      loading.value = false
    }
  }

  function addRocket (rocket: Pick<Rocket, 'full_name' | 'description' | 'image_url' | 'launch_cost' | 'maiden_flight'> & { country: string | null }) {
    const id = `local-${Date.now()}-${++localSequence}`
    rockets.value.unshift({ ...rocket, id, manufacturer: { country_code: rocket.country }, local: true })
    return id
  }

  return { rockets, loading, error, hasRockets, byId, fetchRockets, addRocket }
})
