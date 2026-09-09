import { computed, ref } from 'vue'
import { getSpaceXLaunchers, type Rocket } from '@/services/spaceDevs'

const rockets = ref<Rocket[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const initialized = ref(false)

export function useRockets() {
  const fetchRockets = async (force = false) => {
    if (initialized.value && !force) {
      return
    }

    try {
      loading.value = true
      error.value = null

      const data = await getSpaceXLaunchers()

      rockets.value = data.results || []
      initialized.value = true
    } catch (err) {
      console.error(err)

      error.value = 'Gagal mengambil data roket.'
    } finally {
      loading.value = false
    }
  }

  const addRocket = (rocket: Omit<Rocket, 'id'>) => {
    const newRocket = {
      ...rocket,
      id: `local-${Date.now()}`,
      isLocal: true,
    }

    rockets.value.unshift(newRocket)
  }

  const getRocketById = (id: string | number) => {
    return rockets.value.find(
      (rocket) => String(rocket.id) === String(id)
    )
  }

  const rocketCount = computed(() => rockets.value.length)

  return {
    rockets,
    loading,
    error,
    initialized,
    rocketCount,

    fetchRockets,
    addRocket,
    getRocketById,
  }
}