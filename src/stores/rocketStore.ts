import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Rocket, NewRocketPayload } from '@/types/rocket'
import { fetchSpaceXRockets, fetchRocketById as apiFetchRocketById } from '@/services/rocketApi'

export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error'

export const useRocketStore = defineStore('rockets', () => {
  // State
  const rockets = ref<Rocket[]>([])
  const customRockets = ref<Rocket[]>([])
  const searchQuery = ref('')
  const familyFilter = ref('All')
  const status = ref<LoadingStatus>('idle')
  const errorMessage = ref<string | null>(null)

  const detailCache = ref<Record<string, Rocket>>({})
  const detailStatus = ref<LoadingStatus>('idle')
  const detailError = ref<string | null>(null)

  // Getters
  const allRockets = computed<Rocket[]>(() => {
    return [...customRockets.value, ...rockets.value]
  })

  const availableFamilies = computed<string[]>(() => {
    const families = new Set<string>()
    allRockets.value.forEach(rocket => {
      if (rocket.family) {
        families.add(rocket.family)
      }
    })
    return ['All', ...Array.from(families).sort()]
  })

  const filteredRockets = computed<Rocket[]>(() => {
    const q = searchQuery.value.trim().toLowerCase()
    const family = familyFilter.value

    return allRockets.value.filter(rocket => {
      // Family filter
      if (family !== 'All' && rocket.family !== family) {
        return false
      }

      // Search query filter (matches name, full_name, or description)
      if (!q) return true

      const nameMatch = (rocket.full_name || rocket.name || '').toLowerCase().includes(q)
      const descMatch = (rocket.description || '').toLowerCase().includes(q)
      const familyMatch = (rocket.family || '').toLowerCase().includes(q)

      return nameMatch || descMatch || familyMatch
    })
  })

  // Actions
  async function loadRockets(force = false) {
    if (status.value === 'loading') return
    if (!force && rockets.value.length > 0) {
      status.value = 'success'
      return
    }

    status.value = 'loading'
    errorMessage.value = null

    try {
      const data = await fetchSpaceXRockets()
      rockets.value = data

      // Populate detailCache with detailed rockets received from list API (since mode=detailed was used)
      data.forEach(item => {
        detailCache.value[String(item.id)] = item
      })

      status.value = 'success'
    } catch (err: unknown) {
      status.value = 'error'
      errorMessage.value = err instanceof Error ? err.message : 'Unknown error occurred while fetching rockets'
    }
  }

  async function getRocketById(id: string | number): Promise<Rocket | null> {
    const idStr = String(id)

    // 1. Check custom rockets first
    const customMatch = customRockets.value.find(r => String(r.id) === idStr)
    if (customMatch) {
      return customMatch
    }

    // 2. Check detail cache
    if (detailCache.value[idStr]) {
      return detailCache.value[idStr]
    }

    // 3. Fetch from API if not found
    detailStatus.value = 'loading'
    detailError.value = null

    try {
      const fetched = await apiFetchRocketById(id)
      detailCache.value[idStr] = fetched
      detailStatus.value = 'success'
      return fetched
    } catch (err: unknown) {
      detailStatus.value = 'error'
      detailError.value = err instanceof Error ? err.message : 'Could not fetch rocket details'
      return null
    }
  }

  function addRocket(payload: NewRocketPayload): Rocket {
    const newRocket: Rocket = {
      id: `custom-${Date.now()}`,
      name: payload.full_name,
      full_name: payload.full_name,
      description: payload.description || 'No description provided.',
      image_url: payload.image_url || null,
      launch_cost: payload.launch_cost || null,
      maiden_flight: payload.maiden_flight || null,
      family: payload.family || 'Custom',
      active: payload.active ?? true,
      reusable: payload.reusable ?? false,
      manufacturer: {
        id: 121,
        name: 'SpaceX',
        country_code: payload.country_code || 'USA',
      },
      isCustom: true,
    }

    customRockets.value.unshift(newRocket)
    detailCache.value[String(newRocket.id)] = newRocket
    return newRocket
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  function setFamilyFilter(family: string) {
    familyFilter.value = family
  }

  return {
    rockets,
    customRockets,
    searchQuery,
    familyFilter,
    status,
    errorMessage,
    detailStatus,
    detailError,
    detailCache,
    allRockets,
    availableFamilies,
    filteredRockets,
    loadRockets,
    getRocketById,
    addRocket,
    setSearchQuery,
    setFamilyFilter,
  }
})
