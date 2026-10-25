import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getRockets } from '@/services/rocketService'
import type { Rocket } from '@/types/rocket'

export const useRocketStore = defineStore('rocket', () => {
  const rockets = ref<Rocket[]>([])
  const localRockets = ref<Rocket[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const searchQuery = ref('')
  const countryFilter = ref('all')
  const sortBy = ref<'name-asc' | 'name-desc' | 'cost-high' | 'cost-low'>('name-asc')

  const allRockets = computed(() => [...localRockets.value, ...rockets.value])

  const countryOptions = computed(() => {
    const countries = allRockets.value
      .map((rocket) => rocket.manufacturer?.country_code)
      .filter((country): country is string => Boolean(country))

    return [...new Set(countries)].sort()
  })

  const filteredRockets = computed(() => {
    const keyword = searchQuery.value.trim().toLowerCase()

    return allRockets.value
      .filter((rocket) => {
        const name = rocket.full_name.toLowerCase()
        const description = rocket.description?.toLowerCase() ?? ''
        const country = rocket.manufacturer?.country_code ?? ''

        const matchesSearch =
          !keyword || name.includes(keyword) || description.includes(keyword)

        const matchesCountry =
          countryFilter.value === 'all' || country === countryFilter.value

        return matchesSearch && matchesCountry
      })
      .sort((a, b) => {
        if (sortBy.value === 'name-asc') {
          return a.full_name.localeCompare(b.full_name)
        }

        if (sortBy.value === 'name-desc') {
          return b.full_name.localeCompare(a.full_name)
        }

        const costA = Number(a.launch_cost ?? 0)
        const costB = Number(b.launch_cost ?? 0)

        if (sortBy.value === 'cost-high') {
          return costB - costA
        }

        if (sortBy.value === 'cost-low') {
          return costA - costB
        }

        return 0
      })
  })

  async function fetchRockets() {
    loading.value = true
    error.value = null

    try {
      rockets.value = await getRockets()
    } catch {
      error.value = 'Failed to load rockets. Please try again.'
    } finally {
      loading.value = false
    }
  }

  function addRocket(rocket: Rocket) {
    localRockets.value.unshift(rocket)
  }

  function getLocalRocketById(id: string | number) {
    return localRockets.value.find((rocket) => String(rocket.id) === String(id))
  }

  function resetFilters() {
    searchQuery.value = ''
    countryFilter.value = 'all'
    sortBy.value = 'name-asc'
  }

  return {
    rockets,
    localRockets,
    loading,
    error,
    searchQuery,
    countryFilter,
    sortBy,
    allRockets,
    countryOptions,
    filteredRockets,
    fetchRockets,
    addRocket,
    getLocalRocketById,
    resetFilters,
  }
})