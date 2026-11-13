import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchRockets } from '@/api/rocketApi'
import type { Rocket } from '@/types/rocket'

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error'
export const useRocketStore = defineStore('rocket', () => {
  const apiRockets = ref<Rocket[]>([])
  const customRockets = ref<Rocket[]>([])          // in-memory, hilang saat refresh
  const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
  const error = ref<string | null>(null)

  const rockets = computed(() => [...customRockets.value, ...apiRockets.value])

  async function loadRockets() {
    status.value = 'loading'
    error.value = null
    try {
      apiRockets.value = await fetchRockets()
      status.value = 'success'
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Terjadi kesalahan'
      status.value = 'error'
    }
  }

  function addRocket(data: Omit<Rocket, 'id'>) {
    customRockets.value.unshift({ ...data, id: `local-${Date.now()}` })
  }

  const findLocal = (id: string) => customRockets.value.find(r => String(r.id) === id)

  return { rockets, status, error, loadRockets, addRocket, findLocal }
})