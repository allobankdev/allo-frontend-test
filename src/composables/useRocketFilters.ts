// Composables
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketsStore } from '@/stores/rockets'

function getParam (query: Record<string, unknown>, key: string) {
  const value = query[key]
  return Array.isArray(value) ? value[0] ?? '' : (value as string) ?? ''
}

export function useRocketFilters () {
  const rocketsStore = useRocketsStore()
  const route = useRoute()
  const router = useRouter()

  function setParam (key: string, value: string) {
    router.replace({ query: { ...route.query, [key]: value || undefined } })
  }

  const search = computed({
    get: () => getParam(route.query, 'q'),
    set: value => setParam('q', value ?? ''),
  })

  const status = computed({
    get: () => getParam(route.query, 'status') || 'All',
    set: value => setParam('status', value === 'All' ? '' : value),
  })

  const family = computed({
    get: () => getParam(route.query, 'family') || 'All',
    set: value => setParam('family', value === 'All' ? '' : value),
  })

  const country = computed({
    get: () => getParam(route.query, 'country') || 'All',
    set: value => setParam('country', value === 'All' ? '' : value),
  })

  const statusOptions = computed(() => [
    'All',
    ...new Set(rocketsStore.rockets.map(rocket => (rocket.active ? 'Active' : 'Retired'))),
  ])

  const familyOptions = computed(() => [
    'All',
    ...new Set(
      rocketsStore.rockets
        .map(rocket => rocket.family)
        .filter((value): value is string => !!value),
    ),
  ])

  const countryOptions = computed(() => [
    'All',
    ...new Set(
      rocketsStore.rockets
        .map(rocket => rocket.manufacturer?.country_code)
        .filter((value): value is string => !!value),
    ),
  ])

  const filteredRockets = computed(() => {
    const query = search.value.trim().toLowerCase()

    return rocketsStore.rockets.filter(rocket => {
      if (query && !rocket.full_name.toLowerCase().includes(query)) return false
      if (status.value !== 'All' && rocket.active !== (status.value === 'Active')) return false
      if (family.value !== 'All' && rocket.family !== family.value) return false
      if (country.value !== 'All' && rocket.manufacturer?.country_code !== country.value) return false
      return true
    })
  })

  return {
    search,
    status,
    family,
    country,
    statusOptions,
    familyOptions,
    countryOptions,
    filteredRockets,
  }
}
