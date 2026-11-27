import { computed, readonly, ref } from 'vue'
import { fetchRockets } from '@/services/rocketApi'
import type { NewRocketInput, Rocket } from '@/types/rocket'

const rockets = ref<Rocket[]>([])
const localRockets = ref<Rocket[]>([])
const allRockets = computed(() => [...localRockets.value, ...rockets.value])
const loading = ref(false)
const error = ref<string | null>(null)

let newId = -1

export function useRockets() {
  function addRocket(input: NewRocketInput) {
    const name = input.name.trim()
    const description = input.description.trim()

    if (!name || !description) throw new Error('Nama dan deskripsi wajib diisi.')

    const rocket: Rocket = {
      id: newId--,
      url: '',
      name,
      full_name: name,
      description,
      image_url: input.image_url?.trim() || null,
      family: input.family?.trim() || '',
      active: input.active,
      reusable: input.reusable,
      manufacturer: null,
      program: [],
      variant: '',
      alias: '',
      min_stage: null,
      max_stage: null,
      length: null,
      diameter: null,
      maiden_flight: null,
      launch_cost: null,
      launch_mass: null,
      leo_capacity: null,
      gto_capacity: null,
      to_thrust: null,
      apogee: null,
      vehicle_range: null,
      info_url: null,
      wiki_url: null,
      total_launch_count: null,
      consecutive_successful_launches: null,
      successful_launches: null,
      failed_launches: null,
      pending_launches: null,
      attempted_landings: null,
      successful_landings: null,
      failed_landings: null,
      consecutive_successful_landings: null,
    }

    localRockets.value.unshift(rocket)
  }

  async function loadRockets() {
    if (loading.value) return

    loading.value = true
    error.value = null

    try {
      const data = await fetchRockets()
      rockets.value = data.results
    } catch {
      error.value = 'Daftar roket gagal dimuat.'
    } finally {
      loading.value = false
    }
  }

  return {
    rockets: readonly(allRockets),
    loading: readonly(loading),
    error: readonly(error),
    loadRockets,
    addRocket,
  }
}
