import type { RocketsState, ErrorType } from '../types'
import type { Rocket, LoadingState } from '@/types'

// Mutation Types
export const MutationTypes = {
  SET_ROCKETS: 'SET_ROCKETS',
  SET_CURRENT_ROCKET: 'SET_CURRENT_ROCKET',
  ADD_CUSTOM_ROCKET: 'ADD_CUSTOM_ROCKET',
  SET_LOADING_STATE: 'SET_LOADING_STATE',
  SET_ERROR: 'SET_ERROR',
  SET_ERROR_TYPE: 'SET_ERROR_TYPE',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_COMPANY_FILTER: 'SET_COMPANY_FILTER',
  SET_COUNTRY_FILTER: 'SET_COUNTRY_FILTER',
  SET_ACTIVE_FILTER: 'SET_ACTIVE_FILTER',
  CLEAR_FILTERS: 'CLEAR_FILTERS',
  CLEAR_CURRENT_ROCKET: 'CLEAR_CURRENT_ROCKET'
} as const

// Mutation type definitions
type Mutations = {
  [MutationTypes.SET_ROCKETS]: (state: RocketsState, rockets: Rocket[]) => void
  [MutationTypes.SET_CURRENT_ROCKET]: (state: RocketsState, rocket: Rocket | null) => void
  [MutationTypes.ADD_CUSTOM_ROCKET]: (state: RocketsState, rocket: Rocket) => void
  [MutationTypes.SET_LOADING_STATE]: (state: RocketsState, loadingState: LoadingState) => void
  [MutationTypes.SET_ERROR]: (state: RocketsState, error: string | null) => void
  [MutationTypes.SET_ERROR_TYPE]: (state: RocketsState, errorType: ErrorType) => void
  [MutationTypes.SET_SEARCH_QUERY]: (state: RocketsState, query: string) => void
  [MutationTypes.SET_COMPANY_FILTER]: (state: RocketsState, company: string) => void
  [MutationTypes.SET_COUNTRY_FILTER]: (state: RocketsState, country: string) => void
  [MutationTypes.SET_ACTIVE_FILTER]: (state: RocketsState, filter: 'all' | 'active' | 'inactive') => void
  [MutationTypes.CLEAR_FILTERS]: (state: RocketsState) => void
  [MutationTypes.CLEAR_CURRENT_ROCKET]: (state: RocketsState) => void
}

// Mutations implementation
export const mutations: { [K in keyof Mutations]: Mutations[K] } = {
  [MutationTypes.SET_ROCKETS](state: RocketsState, rockets: Rocket[]) {
    state.rockets = rockets
  },

  [MutationTypes.SET_CURRENT_ROCKET](state: RocketsState, rocket: Rocket | null) {
    state.currentRocket = rocket
  },

  [MutationTypes.ADD_CUSTOM_ROCKET](state: RocketsState, rocket: Rocket) {
    state.customRockets.push(rocket)
  },

  [MutationTypes.SET_LOADING_STATE](state: RocketsState, loadingState: LoadingState) {
    state.loadingState = loadingState
  },

  [MutationTypes.SET_ERROR](state: RocketsState, error: string | null) {
    state.error = error
  },

  [MutationTypes.SET_ERROR_TYPE](state: RocketsState, errorType: ErrorType) {
    state.errorType = errorType
  },

  [MutationTypes.SET_SEARCH_QUERY](state: RocketsState, query: string) {
    state.searchQuery = query
  },

  [MutationTypes.SET_COMPANY_FILTER](state: RocketsState, company: string) {
    state.companyFilter = company
  },

  [MutationTypes.SET_COUNTRY_FILTER](state: RocketsState, country: string) {
    state.countryFilter = country
  },

  [MutationTypes.SET_ACTIVE_FILTER](state: RocketsState, filter: 'all' | 'active' | 'inactive') {
    state.activeFilter = filter
  },

  [MutationTypes.CLEAR_FILTERS](state: RocketsState) {
    state.searchQuery = ''
    state.companyFilter = ''
    state.countryFilter = ''
    state.activeFilter = 'all'
  },

  [MutationTypes.CLEAR_CURRENT_ROCKET](state: RocketsState) {
    state.currentRocket = null
  }
}
