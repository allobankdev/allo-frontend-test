import { computed, reactive } from 'vue'
import { getRockets } from '@/services/rocketApi'
import type { Rocket } from '@/types/rocket'

interface RocketState {
  rockets: Rocket[]
  loading: boolean
  error: string | null
  loaded: boolean
}

const state = reactive<RocketState>({ rockets: [], loading: false, error: null, loaded: false })
let listRequest: Promise<void> | null = null

export function useRockets() {
  const rockets = computed(() => state.rockets)

  async function fetchRockets() {
    if (listRequest) return listRequest

    state.loading = true
    state.error = null

    listRequest = (async () => {
      try {
        state.rockets = await getRockets()
        state.loaded = true
      } catch (error) {
        state.error = error instanceof Error ? error.message : 'Unable to load rocket data.'
      } finally {
        state.loading = false
        listRequest = null
      }
    })()

    return listRequest
  }

  function addRocket(rocket: Rocket) {
    state.rockets = [rocket, ...state.rockets]
  }

  return { rockets, state, fetchRockets, addRocket }
}

export type { Rocket } from '@/types/rocket'
