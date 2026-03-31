import { ref } from 'vue'
import { fetchRockets } from '@/services/spacexService'

const rockets = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useRocketStore() {

  async function loadRockets() {
    loading.value = true
    error.value = null

    try {
      rockets.value = await fetchRockets()
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  function addRocket(newRocket: any) {
    rockets.value.push(newRocket)
  }

  return {
    rockets,
    loading,
    error,
    loadRockets,
    addRocket
  }
}