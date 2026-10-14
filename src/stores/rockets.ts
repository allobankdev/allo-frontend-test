import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchLauncherById, fetchLaunchers } from '@/api/spacex.client'
import type { Launcher, LocalRocket, LocalRocketInput, Rocket, RocketStatusFilter } from '@/types/rocket'
import { isLocalRocket, rocketIdString } from '@/types/rocket'
import { createLocalId, loadLocalRockets, saveLocalRockets } from '@/utils/storage'

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error'

export const useRocketsStore = defineStore('rockets', () => {
  const items = ref<Rocket[]>([])
  const locals = ref<LocalRocket[]>([])
  const status = ref<LoadStatus>('idle')
  const error = ref<string | null>(null)

  const search = ref('')
  const familyFilter = ref<string>('all')
  const statusFilter = ref<RocketStatusFilter>('all')

  const detailCache = ref<Record<string, Rocket>>({})
  const detailStatus = ref<LoadStatus>('idle')
  const detailError = ref<string | null>(null)

  const families = computed(() => {
    const set = new Set<string>()
    for (const item of items.value) {
      if (item.family && item.family.trim() !== '') set.add(item.family)
    }
    return [...set].sort((a, b) => a.localeCompare(b))
  })

  const filtered = computed(() => {
    const query = search.value.trim().toLowerCase()
    return items.value.filter(item => {
      if (familyFilter.value !== 'all' && item.family !== familyFilter.value) return false
      if (statusFilter.value === 'active' && item.active !== true) return false
      if (statusFilter.value === 'inactive' && item.active !== false) return false
      if (query === '') return true
      const haystack = `${item.full_name} ${item.description ?? ''}`.toLowerCase()
      return haystack.includes(query)
    })
  })

  function byId (id: number | string): Rocket | undefined {
    const key = rocketIdString(id)
    return items.value.find(item => rocketIdString(item.id) === key)
      ?? (detailCache.value[key])
  }

  function mergeLocals () {
    const apiItems = items.value.filter(item => !isLocalRocket(item))
    const apiIds = new Set(apiItems.map(item => rocketIdString(item.id)))
    const freshLocals = locals.value.filter(local => !apiIds.has(rocketIdString(local.id)))
    items.value = [...freshLocals, ...apiItems]
  }

  function loadLocals () {
    locals.value = loadLocalRockets()
    mergeLocals()
  }

  async function loadAll (force = false): Promise<void> {
    if (status.value === 'loading') return
    if (status.value === 'success' && !force) return
    status.value = 'loading'
    error.value = null
    try {
      const launchers: Launcher[] = await fetchLaunchers()
      items.value = launchers
      loadLocals()
      for (const item of items.value) {
        detailCache.value[rocketIdString(item.id)] = item
      }
      status.value = 'success'
    } catch (err) {
      status.value = 'error'
      error.value = err instanceof Error ? err.message : 'Failed to load rockets.'
      // Keep locally added rockets visible even when the API fails.
      loadLocals()
    }
  }

  async function retry (): Promise<void> {
    await loadAll(true)
  }

  function addLocal (input: LocalRocketInput): LocalRocket {
    const local: LocalRocket = {
      id: createLocalId(),
      full_name: input.full_name.trim(),
      description: input.description?.trim() || null,
      family: input.family?.trim() || null,
      variant: null,
      active: input.active ?? null,
      image_url: input.image_url?.trim() || null,
      launch_cost: input.launch_cost?.trim() || null,
      maiden_flight: input.maiden_flight || null,
      manufacturer: {
        name: 'SpaceX',
        country_code: input.country_code?.trim() || null,
      },
      _local: true,
    }
    locals.value = [local, ...locals.value]
    saveLocalRockets(locals.value)
    mergeLocals()
    detailCache.value[rocketIdString(local.id)] = local
    return local
  }

  function resetFilters () {
    search.value = ''
    familyFilter.value = 'all'
    statusFilter.value = 'all'
  }

  /**
   * Cache-first detail: resolves from the list/cache (including local-*
   * ids, which never hit the network), then refreshes numeric ids in
   * the background. Falls back to fetch when uncached.
   */
  async function loadDetail (id: number | string): Promise<Rocket | undefined> {
    const key = rocketIdString(id)
    const cached = byId(key)
    if (key.startsWith('local-')) {
      if (cached) {
        detailCache.value[key] = cached
        detailStatus.value = 'success'
        detailError.value = null
        return cached
      }
      detailStatus.value = 'error'
      detailError.value = 'Rocket not found.'
      return undefined
    }
    if (cached) {
      detailCache.value[key] = cached
      detailStatus.value = 'success'
      detailError.value = null
      // Background refresh; failure keeps the cached value.
      fetchLauncherById(key).then(
        fresh => {
          detailCache.value[key] = fresh
          const index = items.value.findIndex(item => rocketIdString(item.id) === key)
          if (index >= 0) items.value[index] = fresh
        },
        () => {},
      )
      return cached
    }
    detailStatus.value = 'loading'
    detailError.value = null
    try {
      const fresh = await fetchLauncherById(key)
      detailCache.value[key] = fresh
      detailStatus.value = 'success'
      return fresh
    } catch (err) {
      detailStatus.value = 'error'
      detailError.value = err instanceof Error ? err.message : 'Failed to load rocket detail.'
      return undefined
    }
  }

  function retryDetail (id: number | string): Promise<Rocket | undefined> {
    detailStatus.value = 'idle'
    if (!keyStartsWithLocal(rocketIdString(id)) && !byId(id)) {
      return loadDetail(id)
    }
    // Cached/local ids: re-resolve synchronously-ish through loadDetail.
    return loadDetail(id)
  }

  return {
    items,
    locals,
    status,
    error,
    search,
    familyFilter,
    statusFilter,
    families,
    filtered,
    detailCache,
    detailStatus,
    detailError,
    byId,
    loadAll,
    loadLocals,
    retry,
    addLocal,
    resetFilters,
    loadDetail,
    retryDetail,
  }
})

function keyStartsWithLocal (key: string): boolean {
  return key.startsWith('local-')
}
