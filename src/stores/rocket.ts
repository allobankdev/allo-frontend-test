import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { NewRocketInput, Rocket } from '../types/rocket'

// lldev.thespacedevs.com is the development host: same data as production,
// far more generous rate limit (see README). mode=detailed + limit=20 are
// both required, or the API omits detail fields / paginates to 10 results.
const API_BASE = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'
const ROCKET_LIST_URL = `${API_BASE}/?manufacturer__name=SpaceX&mode=detailed&limit=20`

export const useRocketStore = defineStore('rocket', () => {
  // --- STATE ---
  const rockets = ref<Rocket[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const searchQuery = ref('')
  /** null = "all families" */
  const familyFilter = ref<string | null>(null)

  // --- GETTERS ---
  const families = computed(() => {
    const unique = new Set(
      rockets.value.map((rocket) => rocket.family).filter((family): family is string => !!family),
    )
    return Array.from(unique).sort()
  })

  const filteredRockets = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()

    return rockets.value.filter((rocket) => {
      const matchesQuery =
        !query ||
        rocket.full_name.toLowerCase().includes(query) ||
        (rocket.description ?? '').toLowerCase().includes(query)

      const matchesFamily = !familyFilter.value || rocket.family === familyFilter.value

      return matchesQuery && matchesFamily
    })
  })

  function findRocketById(id: string): Rocket | undefined {
    return rockets.value.find((rocket) => String(rocket.id) === id)
  }

  // --- ACTIONS ---
  async function fetchRockets() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(ROCKET_LIST_URL)
      if (!response.ok) throw new Error(`Gagal mengambil data roket (status ${response.status})`)

      const data = await response.json()
      const localRockets = rockets.value.filter((rocket) => rocket.isLocal)
      rockets.value = [...localRockets, ...(data.results as Rocket[])]
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Terjadi kesalahan jaringan'
    } finally {
      loading.value = false
    }
  }

  /**
   * Resolves a single rocket for the detail screen.
   *
   * The list endpoint already returns every field the detail screen needs
   * (mode=detailed), so we reuse whatever is already in the store instead of
   * firing a second request. This also naturally supports locally-added
   * rockets, which don't exist on the (read-only) API and would otherwise
   * 404 if we always hit the single-rocket endpoint.
   *
   * We only fall back to the single-rocket endpoint if the id genuinely
   * isn't in the store yet (e.g. the user opened the detail URL directly).
   */
  async function fetchRocketDetail(id: string): Promise<Rocket | null> {
    loading.value = true
    error.value = null
    try {
      if (rockets.value.length === 0) {
        await fetchRockets()
        if (error.value) return null
      }

      const existing = findRocketById(id)
      if (existing) return existing

      // Not in the list we have (and not a local rocket) - try fetching it
      // directly by id as a last resort.
      const response = await fetch(`${API_BASE}/${id}/`)
      if (!response.ok) {
        error.value = 'Roket tidak ditemukan.'
        return null
      }
      const rocket = (await response.json()) as Rocket
      return rocket
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Terjadi kesalahan jaringan'
      return null
    } finally {
      loading.value = false
    }
  }

  function addRocket(input: NewRocketInput) {
    const rocket: Rocket = {
      id: `local-${crypto.randomUUID()}`,
      full_name: input.full_name.trim(),
      description: input.description.trim() || null,
      image_url: input.image_url.trim() || null,
      launch_cost: input.launch_cost.trim() || null,
      maiden_flight: input.maiden_flight.trim() || null,
      family: 'Ditambahkan pengguna',
      manufacturer: input.country_code.trim() ? { country_code: input.country_code.trim() } : null,
      isLocal: true,
    }
    rockets.value.unshift(rocket)
    return rocket
  }

  return {
    rockets,
    loading,
    error,
    searchQuery,
    familyFilter,
    families,
    filteredRockets,
    fetchRockets,
    fetchRocketDetail,
    addRocket,
    findRocketById,
  }
})
