import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchRockets, fetchRocketById } from '@/services/rocketService'
import type { Rocket, NewRocketForm } from '@/types/rocket'

type FetchStatus = 'idle' | 'loading' | 'success' | 'error'

export const useRocketStore = defineStore('rockets', () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const rockets = ref<Rocket[]>([])
  const localRockets = ref<Rocket[]>([])
  const status = ref<FetchStatus>('idle')
  const errorMessage = ref<string>('')

  // ── Getters ────────────────────────────────────────────────────────────────

  /** Local rockets appear first so newly added ones are immediately visible. */
  const allRockets = computed<Rocket[]>(() => [
    ...localRockets.value,
    ...rockets.value,
  ])

  // ── Actions ────────────────────────────────────────────────────────────────

  async function loadRockets(): Promise<void> {
    status.value = 'loading'
    errorMessage.value = ''

    try {
      rockets.value = await fetchRockets()
      status.value = 'success'
    } catch (err) {
      errorMessage.value = err instanceof Error ? err.message : 'Unknown error occurred.'
      status.value = 'error'
    }
  }

  /**
   * Fetches a single rocket by id and merges it into the `rockets` array if
   * it isn't already present (e.g., when the user lands on the detail page
   * directly without going through the list first).
   */
  async function ensureRocketLoaded(id: number): Promise<void> {
    const alreadyInStore = allRockets.value.some((r) => r.id === id)
    if (alreadyInStore) return

    status.value = 'loading'
    errorMessage.value = ''

    try {
      const rocket = await fetchRocketById(id)
      rockets.value.push(rocket)
      status.value = 'success'
    } catch (err) {
      errorMessage.value = err instanceof Error ? err.message : 'Unknown error occurred.'
      status.value = 'error'
    }
  }

  /** Creates a locally-only rocket with a generated negative id to avoid collisions. */
  function addRocket(form: NewRocketForm): void {
    const localRocket: Rocket = {
      id: -(localRockets.value.length + 1),
      full_name: form.full_name,
      description: form.description || null,
      image_url: form.image_url || null,
      launch_cost: null,
      maiden_flight: null,
      manufacturer: null,
      isLocal: true,
    }
    localRockets.value.unshift(localRocket)
  }

  return {
    // state
    rockets,
    localRockets,
    status,
    errorMessage,
    // getters
    allRockets,
    // actions
    loadRockets,
    ensureRocketLoaded,
    addRocket,
  }
})
