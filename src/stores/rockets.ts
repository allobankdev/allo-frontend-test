import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { NewRocket, Rocket } from '@/types/rocket'
import { HttpError, rocketService } from '@/services/rocket.service'

const toMessage = (cause: unknown) => cause instanceof Error ? cause.message : 'Something went wrong.'

export const useRocketStore = defineStore('rockets', () => {
  const serverRockets = ref<Rocket[]>([])
  const localRockets = ref<Rocket[]>([])
  const cached = ref(false)
  const loading = ref(false)
  const error = ref('')

  const rockets = computed(() => [...localRockets.value, ...serverRockets.value])

  const findRocket = (id: string) => rockets.value.find(rocket => String(rocket.id) === id)

  const getServerRockets = async () => {
    loading.value = true
    error.value = ''

    try {
      serverRockets.value = await rocketService.getAll()
      cached.value = true
    } catch (cause) {
      error.value = toMessage(cause)
    } finally {
      loading.value = false
    }
  }


  const getRocketById = async (id: string) => {
    if (findRocket(id) || id.startsWith('local-')) return

    loading.value = true
    error.value = ''

    try {
      serverRockets.value.push(await rocketService.getById(id))
    } catch (cause) {
      // A 404 is rendered as "not found" by the page, not as a retryable error.
      if (!(cause instanceof HttpError && cause.status === 404)) error.value = toMessage(cause)
    } finally {
      loading.value = false
    }
  }

  const addRocket = (rocket: NewRocket) => {
    localRockets.value.unshift({
      ...rocket,
      id: `local-${Date.now()}`,
    })
  }

  return { rockets, cached, loading, error, findRocket, getServerRockets, getRocketById, addRocket }
})
