import {
  computed,
  reactive,
} from 'vue'

import {
  getRockets,
} from '@/services/rocketService'

import type {
  NewRocketInput,
  Rocket,
} from '@/types/rocket'


const state = reactive({
  apiRockets: [] as Rocket[],
  localRockets: [] as Rocket[],

  loading: false,
  error: '',
  loaded: false,
})


const rockets = computed(() => {
  return [
    ...state.localRockets,
    ...state.apiRockets,
  ]
})


async function loadRockets(
  force = false,
) {
  if (
    state.loaded &&
    !force
  ) {
    return
  }

  state.loading = true
  state.error = ''

  try {
    state.apiRockets =
      await getRockets()

    state.loaded = true
  }
  catch (error) {
    state.error =
      error instanceof Error
        ? error.message
        : 'Something went wrong.'
  }
  finally {
    state.loading = false
  }
}


function addRocket(
  input: NewRocketInput,
) {
  const rocket: Rocket = {
    id: `local-${Date.now()}`,

    full_name:
      input.full_name,

    description:
      input.description || null,

    image_url:
      input.image_url || null,

    launch_cost:
      input.launch_cost || null,

    manufacturer: {
      country_code:
        input.country_code || null,
    },

    maiden_flight:
      input.maiden_flight || null,

    isLocal: true,
  }

  state.localRockets.unshift(
    rocket,
  )

  return rocket
}


function findLocalRocket(
  id: string,
) {
  return (
    state.localRockets.find(
      rocket =>
        String(rocket.id) === id,
    ) ?? null
  )
}


export function useRocketStore() {
  return {
    state,
    rockets,

    loadRockets,
    addRocket,
    findLocalRocket,
  }
}