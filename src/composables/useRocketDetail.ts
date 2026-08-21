import { ref } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'
import { getRocketById } from '@/services/rocketService'
import type { Rocket } from '@/types/rocket'

export function useRocketDetail(id: number) {
  const store = useRocketStore()
  const rocket = ref<Rocket | null>(null)
  const status = ref<'idle' | 'loading' | 'error' | 'success'>('idle')
  const errorMsg = ref('')

  async function load() {
    const cached = store.allRockets.find((r) => r.id === id)
    if (cached) {
      rocket.value = cached
      status.value = 'success'
      return
    }

    status.value = 'loading'
    try {
      rocket.value = await getRocketById(id)
      status.value = 'success'
    } catch (e) {
      errorMsg.value = (e as Error).message
      status.value = 'error'
    }
  }

  return { rocket, status, errorMsg, load }
}
