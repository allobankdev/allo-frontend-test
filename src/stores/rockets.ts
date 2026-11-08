/**
 * Rockets store: the single place that talks to the API.
 *
 * - `remoteRockets` come from Launch Library (fetched once per session, cached).
 * - `localRockets` are added by the user and live in memory only (the API is read-only).
 */

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as rocketsApi from '@/api/rockets.api'
import { getErrorMessage, isAbortError } from '@/api/http'
import { createLocalRocket, mapLauncherToRocket } from '@/mappers/rocket.mapper'
import type { NewRocketInput, RequestStatus, Rocket } from '@/types/rocket'

interface FetchRocketsOptions {
  /** Refetch even when the list is already loaded (Retry / refresh). */
  force?: boolean
  signal?: AbortSignal
}

export const useRocketsStore = defineStore('rockets', () => {
  // ── State ──
  const remoteRockets = ref<Rocket[]>([])
  const localRockets = ref<Rocket[]>([])
  const listStatus = ref<RequestStatus>('idle')
  const listError = ref<string | null>(null)

  // ── Getters ──
  /** User-added rockets first, so a newly added rocket is immediately visible. */
  const allRockets = computed(() => [...localRockets.value, ...remoteRockets.value])

  function getRocketById (id: string): Rocket | undefined {
    return allRockets.value.find(rocket => rocket.id === id)
  }

  // ── Actions ──
  async function fetchRockets ({ force = false, signal }: FetchRocketsOptions = {}): Promise<void> {
    if (listStatus.value === 'success' && !force) return

    listStatus.value = 'loading'
    listError.value = null

    try {
      const dtos = await rocketsApi.getRockets(signal)
      remoteRockets.value = dtos.map(mapLauncherToRocket)
      listStatus.value = 'success'
    } catch (error) {
      if (isAbortError(error)) {
        // The page was left mid-request: not an error, just start over next time.
        listStatus.value = 'idle'
        return
      }
      listError.value = getErrorMessage(error)
      listStatus.value = 'error'
    }
  }

  /** Fetches one rocket and caches it. Errors are thrown so the caller owns its UI state. */
  async function fetchRocketById (id: string, signal?: AbortSignal): Promise<Rocket> {
    const rocket = mapLauncherToRocket(await rocketsApi.getRocketById(id, signal))
    upsertRemoteRocket(rocket)
    return rocket
  }

  function addRocket (input: NewRocketInput): Rocket {
    const rocket = createLocalRocket(input)
    localRockets.value = [rocket, ...localRockets.value]
    return rocket
  }

  function upsertRemoteRocket (rocket: Rocket): void {
    const index = remoteRockets.value.findIndex(item => item.id === rocket.id)
    if (index === -1) {
      remoteRockets.value = [...remoteRockets.value, rocket]
    } else {
      remoteRockets.value = remoteRockets.value.map(item => (item.id === rocket.id ? rocket : item))
    }
  }

  return {
    remoteRockets,
    localRockets,
    listStatus,
    listError,
    allRockets,
    getRocketById,
    fetchRockets,
    fetchRocketById,
    addRocket,
  }
})
