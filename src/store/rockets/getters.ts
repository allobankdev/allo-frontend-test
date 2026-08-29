import type { RocketsState } from '../types'
import type { Rocket } from '@/types'

// Getter Types
export const GetterTypes = {
  FILTERED_ROCKETS: 'filteredRockets',
  AVAILABLE_COMPANIES: 'availableCompanies',
  AVAILABLE_COUNTRIES: 'availableCountries',
  IS_LOADING: 'isLoading',
  HAS_ERROR: 'hasError',
  IS_SUCCESS: 'isSuccess',
  ALL_ROCKETS: 'allRockets'
} as const

// Helper functions for filtering
const filterBySearch = (rockets: Rocket[], query: string): Rocket[] => {
  if (!query.trim()) return rockets
  const lowerQuery = query.toLowerCase()
  return rockets.filter(rocket =>
    rocket.name.toLowerCase().includes(lowerQuery) ||
    rocket.description.toLowerCase().includes(lowerQuery) ||
    rocket.country.toLowerCase().includes(lowerQuery)
  )
}

const filterByCompany = (rockets: Rocket[], company: string): Rocket[] => {
  if (!company) return rockets
  return rockets.filter(rocket => rocket.company === company)
}

const filterByCountry = (rockets: Rocket[], country: string): Rocket[] => {
  if (!country) return rockets
  return rockets.filter(rocket => rocket.country === country)
}

const filterByActiveStatus = (rockets: Rocket[], status: string): Rocket[] => {
  if (status === 'all') return rockets
  const isActive = status === 'active'
  return rockets.filter(rocket => rocket.active === isActive)
}

const getUniqueValues = (rockets: Rocket[], selector: (rocket: Rocket) => string): string[] => {
  return [...new Set(rockets.map(selector))].sort()
}

// Helper to get all rockets from state
const getAllRockets = (state: RocketsState): Rocket[] => {
  return [...state.rockets, ...state.customRockets]
}

// Getters interface for type safety
export interface Getters {
  [GetterTypes.ALL_ROCKETS]: Rocket[]
  [GetterTypes.FILTERED_ROCKETS]: Rocket[]
  [GetterTypes.AVAILABLE_COMPANIES]: string[]
  [GetterTypes.AVAILABLE_COUNTRIES]: string[]
  [GetterTypes.IS_LOADING]: boolean
  [GetterTypes.HAS_ERROR]: boolean
  [GetterTypes.IS_SUCCESS]: boolean
}

// Getters implementation
export const getters = {
  [GetterTypes.ALL_ROCKETS](state: RocketsState): Rocket[] {
    return getAllRockets(state)
  },

  [GetterTypes.FILTERED_ROCKETS](state: RocketsState): Rocket[] {
    let result = getAllRockets(state)

    result = filterBySearch(result, state.searchQuery)
    result = filterByCompany(result, state.companyFilter)
    result = filterByCountry(result, state.countryFilter)
    result = filterByActiveStatus(result, state.activeFilter)

    return result
  },

  [GetterTypes.AVAILABLE_COMPANIES](state: RocketsState): string[] {
    const allRockets = getAllRockets(state)
    return getUniqueValues(allRockets, r => r.company)
  },

  [GetterTypes.AVAILABLE_COUNTRIES](state: RocketsState): string[] {
    const allRockets = getAllRockets(state)
    return getUniqueValues(allRockets, r => r.country)
  },

  [GetterTypes.IS_LOADING](state: RocketsState): boolean {
    return state.loadingState === 'loading'
  },

  [GetterTypes.HAS_ERROR](state: RocketsState): boolean {
    return state.loadingState === 'error'
  },

  [GetterTypes.IS_SUCCESS](state: RocketsState): boolean {
    return state.loadingState === 'success'
  }
}
