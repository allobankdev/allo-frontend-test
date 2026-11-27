import { ref, shallowRef, watch, type DeepReadonly } from 'vue'
import { fetchRocket } from '@/services/rocketApi'
import { useRockets } from '@/composables/useRockets'
import type { Rocket } from '@/types/rocket'

export function useRocketDetail(getId: () => string) {
  const rocket = shallowRef<DeepReadonly<Rocket> | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const attempt = ref(0)

  const { rockets } = useRockets()

  watch([getId, attempt], async ([rawId], _, onCleanup) => {
    const controller = new AbortController()

    onCleanup(() => controller.abort())

    rocket.value = null
    error.value = null
    loading.value = true

    try {
      const id = Number(rawId)

      if (!/^-?\d+$/.test(rawId) || !Number.isSafeInteger(id) || id === 0) {
        throw new Error('ID roket tidak valid.')
      }

      if (id < 0) {
        const localRocket = rockets.value.find(item => item.id === id)

        if (!localRocket) throw new Error('Roket yang dibuat tidak ada.')

        rocket.value = localRocket
      } else {
        const data = await fetchRocket(id, controller.signal)

        if (!controller.signal.aborted) rocket.value = data
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        error.value = err instanceof Error && err.message !== 'Failed to fetch'
          ? err.message
          : 'Detail roket gagal dimuat.'
      }
    } finally {
      if (!controller.signal.aborted) loading.value = false
    }
  }, { immediate: true })

  function retry() {
    attempt.value++
  }

  return { rocket, loading, error, retry }
}
