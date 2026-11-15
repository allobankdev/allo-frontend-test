import { computed, reactive, readonly } from 'vue'
import { fetchRocket, fetchRockets } from '@/services/rockets'
import type { NewRocket, Rocket } from '@/types/rocket'

const state = reactive({
  remote: [] as Rocket[],
  local: [] as Rocket[],
  details: {} as Record<string, Rocket>,
  status: 'idle' as 'idle' | 'loading' | 'success' | 'error',
  error: '',
  search: '',
  family: '',
})
const rockets = computed(() => [...state.local, ...state.remote])
let pendingList: Promise<void> | null = null

async function loadList() {
  if (pendingList) return pendingList
  if (state.status === 'success') return
  state.status = 'loading'
  state.error = ''
  pendingList = (async () => {
    try {
      state.remote = await fetchRockets()
      state.status = 'success'
    } catch (error) {
      state.error = error instanceof Error ? error.message : 'Unable to load rockets.'
      state.status = 'error'
    } finally {
      pendingList = null
    }
  })()
  return pendingList
}

async function getRocket(id: string): Promise<Rocket> {
  const cached = rockets.value.find(rocket => rocket.id === id) ?? state.details[id]
  if (cached) return cached
  if (id.startsWith('local-')) {
    throw new Error('This rocket was saved in a previous session. Add it again from the catalog.')
  }
  const rocket = await fetchRocket(id)
  state.details[id] = rocket
  return rocket
}

function addRocket(input: NewRocket) {
  const rocket: Rocket = { ...input, id: 'local-' + crypto.randomUUID(), local: true }
  state.local.unshift(rocket)
  state.search = ''
  state.family = ''
  return rocket
}

export const rocketStore = {
  state: readonly(state),
  rockets,
  loadList,
  getRocket,
  addRocket,
  setSearch(value: string) { state.search = value },
  setFamily(value: string) { state.family = value },
}
