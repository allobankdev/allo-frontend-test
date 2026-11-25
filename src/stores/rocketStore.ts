/**
 * Fungsi: Store buat nyimpen data roket dari API, roket baru yang ditambah manual (in-memory),
 *         sama status loading/error-nya. Pakai Composition API bawaan Vue biar simpel.
 * Dipakai di:
 *  - src/pages/index.vue (rockets, status, error, loadRockets, addRocket)
 *  - src/pages/rockets/[id].vue (findRocketById)
 */

import { computed, ref } from 'vue'
import { fetchRockets } from '@/services/rocketsApi'
import type { NewRocketInput, Rocket } from '@/types/rocket'

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

const apiRockets = ref<Rocket[]>([])
// shortcut: in-memory only per assignment spec; persist to localStorage/API if reload persistence is needed
const localRockets = ref<Rocket[]>([])
const status = ref<RequestStatus>('idle')
const error = ref<string | null>(null)

export function useRocketStore() {
  const rockets = computed<Rocket[]>(() => [
    ...localRockets.value,
    ...apiRockets.value,
  ])

  async function loadRockets(signal?: AbortSignal) {
    status.value = 'loading'
    error.value = null
    try {
      apiRockets.value = await fetchRockets(signal)
      status.value = 'success'
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      error.value =
        err instanceof Error ? err.message : 'Unexpected error occurred.'
      status.value = 'error'
    }
  }

  function addRocket(input: NewRocketInput) {
    const newRocket: Rocket = {
      ...input,
      id: `local-${Date.now()}`,
      isLocal: true,
    }
    localRockets.value = [newRocket, ...localRockets.value]
  }

  function findRocketById(id: string): Rocket | undefined {
    return rockets.value.find(r => r.id === id)
  }

  return {
    rockets,
    status,
    error,
    loadRockets,
    addRocket,
    findRocketById,
  }
}