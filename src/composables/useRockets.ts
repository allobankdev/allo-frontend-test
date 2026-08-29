import { computed } from 'vue'
import { useStore, ActionTypes, GetterTypes } from '@/store'
import type { RocketFormData } from '@/types'
import type { ErrorType } from '@/store/types'

/**
 * Composable for rockets store operations
 * Provides a clean API similar to Pinia's useStore
 */
export function useRockets() {
  const store = useStore()

  // State - direct access
  const rockets = computed(() => store.state.rockets.rockets)
  const customRockets = computed(() => store.state.rockets.customRockets)
  const currentRocket = computed(() => store.state.rockets.currentRocket)
  const error = computed(() => store.state.rockets.error)
  const errorType = computed<ErrorType>(() => store.state.rockets.errorType)
  const searchQuery = computed(() => store.state.rockets.searchQuery)
  const companyFilter = computed(() => store.state.rockets.companyFilter)
  const countryFilter = computed(() => store.state.rockets.countryFilter)
  const activeFilter = computed(() => store.state.rockets.activeFilter)

  // Getters
  const filteredRockets = computed(() => store.getters['rockets/filteredRockets'])
  const availableCompanies = computed(() => store.getters['rockets/availableCompanies'])
  const availableCountries = computed(() => store.getters['rockets/availableCountries'])
  const isLoading = computed(() => store.getters['rockets/isLoading'])
  const hasError = computed(() => store.getters['rockets/hasError'])
  const isSuccess = computed(() => store.getters['rockets/isSuccess'])

  // Actions
  const fetchRockets = () => store.dispatch(`rockets/${ActionTypes.FETCH_ROCKETS}`)
  const fetchRocketById = (id: string) => store.dispatch(`rockets/${ActionTypes.FETCH_ROCKET_BY_ID}`, id)
  const addCustomRocket = (formData: RocketFormData) => store.dispatch(`rockets/${ActionTypes.ADD_CUSTOM_ROCKET}`, formData)
  const setSearchQuery = (query: string) => store.dispatch(`rockets/${ActionTypes.SET_SEARCH_QUERY}`, query)
  const setCompanyFilter = (company: string) => store.dispatch(`rockets/${ActionTypes.SET_COMPANY_FILTER}`, company)
  const setCountryFilter = (country: string) => store.dispatch(`rockets/${ActionTypes.SET_COUNTRY_FILTER}`, country)
  const setActiveFilter = (filter: string) => store.dispatch(`rockets/${ActionTypes.SET_ACTIVE_FILTER}`, filter)
  const clearFilters = () => store.dispatch(`rockets/${ActionTypes.CLEAR_FILTERS}`)
  const clearCurrentRocket = () => store.dispatch(`rockets/${ActionTypes.CLEAR_CURRENT_ROCKET}`)

  return {
    // State
    rockets,
    customRockets,
    currentRocket,
    error,
    errorType,
    searchQuery,
    companyFilter,
    countryFilter,
    activeFilter,

    // Getters
    filteredRockets,
    availableCompanies,
    availableCountries,
    isLoading,
    hasError,
    isSuccess,

    // Actions
    fetchRockets,
    fetchRocketById,
    addCustomRocket,
    setSearchQuery,
    setCompanyFilter,
    setCountryFilter,
    setActiveFilter,
    clearFilters,
    clearCurrentRocket
  }
}
