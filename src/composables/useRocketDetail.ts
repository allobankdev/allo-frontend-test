import { ref } from 'vue'
import type { RequestStatus, Rocket } from '@/types/rocket'
import { useRocketsStore } from '@/stores/rockets'

const DETAIL_API_BASE = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'

export function useRocketDetail () {
  const store = useRocketsStore()

  const rocket = ref<Rocket | null>(null)
  const status = ref<RequestStatus>('idle')
  const errorMessage = ref<string | null>(null)

  async function fetchRocket (id: number) {
    status.value = 'loading'
    errorMessage.value = null
    rocket.value = null

    try {
      const cached = store.findById(id)
      if (cached) {
        rocket.value = cached
        status.value = 'success'
        return
      }

      const response = await fetch(`${DETAIL_API_BASE}/${id}/`)

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`)
      }

      rocket.value = await response.json()
      status.value = 'success'
    } catch (err) {
      errorMessage.value = err instanceof Error ? err.message : 'Unknown error occurred'
      status.value = 'error'
    }
  }

  return {
    rocket,
    status,
    errorMessage,
    fetchRocket,
  }
}
