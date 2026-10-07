import { computed, reactive, readonly } from 'vue'
import { fetchRocket, fetchRockets } from '../services/rockets'
import type { LoadStatus, NewRocket, Rocket } from '../types/rocket'

const state = reactive({
  remote: [] as Rocket[],
  local: [] as Rocket[],
  details: {} as Record<string, Rocket>,
  status: 'idle' as LoadStatus,
  error: '',
  filter: '',
})

const rockets = computed(() => [...state.local, ...state.remote])
const filteredRockets = computed(() => {
  const query = state.filter.trim().toLocaleLowerCase()
  return rockets.value.filter(rocket => rocket.name.toLocaleLowerCase().includes(query))
})

async function loadList(force = false) {
  if (state.status === 'loading' || (state.status === 'success' && !force)) return
  state.status = 'loading'
  state.error = ''
  try {
    state.remote = await fetchRockets()
    state.status = 'success'
  } catch (error) {
    state.status = 'error'
    state.error = error instanceof Error ? error.message : 'Daftar roket tidak dapat dimuat.'
  }
}

async function loadDetail(id: string, signal: AbortSignal): Promise<Rocket> {
  const local = state.local.find(rocket => rocket.id === id)
  if (local) return local
  if (id.startsWith('local-')) {
    throw new Error('Roket tambahan tidak tersedia. Data tambahan hanya tersimpan selama aplikasi berjalan.')
  }
  if (!/^\d+$/.test(id)) throw new Error('Pengenal roket tidak valid.')
  if (state.details[id]) return state.details[id]
  const rocket = await fetchRocket(id, signal)
  if (!signal.aborted) state.details[id] = rocket
  return rocket
}

function addRocket(input: NewRocket): Rocket {
  const name = input.name.trim()
  if (!name) throw new Error('Nama roket wajib diisi.')
  const rocket = { ...input, name, id: `local-${crypto.randomUUID()}` }
  state.local.unshift(rocket)
  // A previous filter must not hide the newly added rocket.
  state.filter = ''
  return rocket
}

export const rocketStore = {
  state: readonly(state),
  rockets,
  filteredRockets,
  loadList,
  loadDetail,
  addRocket,
  setFilter(value: string) { state.filter = value },
}
