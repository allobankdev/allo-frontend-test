import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchRocketById, fetchRockets } from '@/services/rocketApi'
import type { NewRocket, RequestStatus, Rocket } from '@/types/rocket'

const LOCAL_PREFIX = 'local-'
const messageOf = (e: unknown) => (e instanceof Error ? e.message : 'Something went wrong.')

export const useRocketStore = defineStore('rocket', () => {
  // ---------- state ----------
  const rockets = ref<Rocket[]>([])
  const filter = ref('')
  const listStatus = ref<RequestStatus>('idle')
  const listError = ref<string | null>(null)
  const detailStatus = ref<RequestStatus>('idle')
  const detailError = ref<string | null>(null)

  // ---------- getters ----------
  const filteredRockets = computed(() => {
    const q = filter.value.trim().toLowerCase()
    if (!q) return rockets.value
    return rockets.value.filter(
      r => r.name.toLowerCase().includes(q) || (r.description ?? '').toLowerCase().includes(q),
    )
  })

  const getById = (id: string) => rockets.value.find(r => r.id === id)
  const isLocalId = (id: string) => id.startsWith(LOCAL_PREFIX)

  // ---------- actions ----------
  async function loadRockets () {
    if (listStatus.value === 'loading') return
    listStatus.value = 'loading'
    listError.value = null
    try {
      const remote = await fetchRockets()
      // pertahankan rocket lokal yang sudah ditambahkan user
      const local = rockets.value.filter(r => isLocalId(r.id))
      rockets.value = [...local, ...remote]
      listStatus.value = 'succeeded'
    } catch (e) {
      listError.value = messageOf(e)
      listStatus.value = 'failed'
    }
  }

  async function loadRocketById (id: string) {
    detailStatus.value = 'loading'
    detailError.value = null
    try {
      const rocket = await fetchRocketById(id)
      const index = rockets.value.findIndex(r => r.id === rocket.id)
      if (index >= 0) rockets.value[index] = rocket
      else rockets.value.push(rocket)
      detailStatus.value = 'succeeded'
    } catch (e) {
      detailError.value = messageOf(e)
      detailStatus.value = 'failed'
    }
  }

  /** API read-only: rocket baru hanya hidup di memori (hilang saat refresh). */
  function addRocket (payload: NewRocket) {
    rockets.value.unshift({ ...payload, id: `${LOCAL_PREFIX}${Date.now()}` })
  }

  return {
    rockets, filter, listStatus, listError, detailStatus, detailError,
    filteredRockets, getById, isLocalId,
    loadRockets, loadRocketById, addRocket,
  }
})
