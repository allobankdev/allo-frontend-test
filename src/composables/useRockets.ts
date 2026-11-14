import { computed, ref } from 'vue'
import type { Rocket } from '@/types/rocket'

const API = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'
const rockets = ref<Rocket[]>([])
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const error = ref('')
let request: Promise<void> | undefined

async function loadRockets(force = false) {
  if (status.value === 'success' && !force) return
  if (request && !force) return request
  status.value = 'loading'
  error.value = ''
  request = (async () => {
    try {
      const response = await fetch(`${API}/?manufacturer__name=SpaceX&mode=detailed&limit=20`)
      if (!response.ok) throw new Error(`Request failed (${response.status})`)
      const data = await response.json()
      if (!Array.isArray(data.results)) throw new Error('The rocket response was not valid.')
      rockets.value = data.results
      status.value = 'success'
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Unable to load rockets.'
      status.value = 'error'
    } finally {
      request = undefined
    }
  })()
  return request
}

async function getRocket(id: string) {
  const existing = rockets.value.find(rocket => String(rocket.id) === id)
  if (existing) return existing

  // The detail page can also be opened directly or refreshed, in which case
  // the in-memory list is empty. Load the collection before falling back to
  // the single-item endpoint.
  await loadRockets()
  const fromList = rockets.value.find(rocket => String(rocket.id) === id)
  if (fromList) return fromList

  const response = await fetch(`${API}/${encodeURIComponent(id)}/`)
  if (!response.ok) throw new Error(`Could not load this rocket (${response.status}).`)
  return await response.json() as Rocket
}

function addRocket(rocket: Rocket) {
  rockets.value = [{ ...rocket, id: `local-${Date.now()}` }, ...rockets.value]
}

export function useRockets() {
  return { rockets, status, error, loadRockets, getRocket, addRocket }
}

export function useRocketFilter() {
  const query = ref('')
  const filteredRockets = computed(() => {
    const normalized = query.value.trim().toLowerCase()
    if (!normalized) return rockets.value
    return rockets.value.filter(rocket =>
      `${rocket.full_name ?? ''} ${rocket.description ?? ''}`.toLowerCase().includes(normalized),
    )
  })
  return { query, filteredRockets }
}
