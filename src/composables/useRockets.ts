import { computed, ref } from 'vue'
import type { Rocket, RocketForm } from '@/types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0'
const LIST_URL = `${BASE_URL}/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20`

const rockets = ref<Rocket[]>([])
const customRockets = ref<Rocket[]>([])
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const error = ref<string | null>(null)

const allRockets = computed<Rocket[]>(() => [
  ...customRockets.value,
  ...rockets.value,
])

async function getJson<T> (url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }
  return response.json()
}

function toMessage (err: unknown): string {
  return err instanceof Error ? err.message : 'Unknown error'
}

function findById (id: number | string): Rocket | null {
  return allRockets.value.find(rocket => String(rocket.id) === String(id)) ?? null
}

async function fetchRockets (): Promise<void> {
  status.value = 'loading'
  error.value = null
  try {
    const data = await getJson<{ results: Rocket[] }>(LIST_URL)
    rockets.value = data.results
    status.value = 'success'
  } catch (err) {
    error.value = toMessage(err)
    status.value = 'error'
  }
}

async function fetchRocket (id: number | string): Promise<Rocket | null> {
  status.value = 'loading'
  error.value = null
  try {
    const rocket = await getJson<Rocket>(`${BASE_URL}/config/launcher/${id}/`)
    if (!findById(rocket.id)) {
      rockets.value.push(rocket)
    }
    status.value = 'success'
    return rocket
  } catch (err) {
    error.value = toMessage(err)
    status.value = 'error'
    return null
  }
}

function addRocket (form: RocketForm): void {
  customRockets.value.unshift({
    id: -Date.now(),
    full_name: form.full_name,
    description: form.description || null,
    image_url: form.image_url || null,
    launch_cost: form.launch_cost || null,
    maiden_flight: form.maiden_flight || null,
    manufacturer: form.country_code ? { country_code: form.country_code } : null,
  })
}

export function useRockets () {
  return {
    rockets,
    customRockets,
    allRockets,
    status,
    error,
    findById,
    fetchRockets,
    fetchRocket,
    addRocket,
  }
}
