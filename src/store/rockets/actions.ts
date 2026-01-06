import type { RocketsState, RootState, ErrorType } from '../types'
import type { Rocket, RocketFormData } from '@/types'
import { spacexApi } from '@/services'
import { MutationTypes } from './mutations'

// Action Types
export const ActionTypes = {
  FETCH_ROCKETS: 'fetchRockets',
  FETCH_ROCKET_BY_ID: 'fetchRocketById',
  ADD_CUSTOM_ROCKET: 'addCustomRocket',
  SET_SEARCH_QUERY: 'setSearchQuery',
  SET_COMPANY_FILTER: 'setCompanyFilter',
  SET_COUNTRY_FILTER: 'setCountryFilter',
  SET_ACTIVE_FILTER: 'setActiveFilter',
  CLEAR_FILTERS: 'clearFilters',
  CLEAR_CURRENT_ROCKET: 'clearCurrentRocket'
} as const

// Action context type
export interface ActionContext {
  commit: (type: string, payload?: unknown) => void
  state: RocketsState
  rootState: RootState
}

// Helper to detect error type from error object
const detectErrorType = (error: unknown): ErrorType => {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return 'network'
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    if (message.includes('network') || message.includes('internet') || message.includes('offline')) {
      return 'network'
    }

    if (message.includes('500') || message.includes('502') || message.includes('503') || message.includes('server')) {
      return 'server'
    }

    if (message.includes('404') || message.includes('not found')) {
      return 'notfound'
    }
  }

  return 'generic'
}

// Helper to create a new rocket from form data
const createRocketFromFormData = (formData: RocketFormData): Rocket => ({
  id: `custom-${Date.now()}`,
  name: formData.name,
  description: formData.description,
  flickr_images: formData.flickr_images,
  cost_per_launch: formData.cost_per_launch,
  country: formData.country,
  first_flight: formData.first_flight,
  active: true,
  stages: 0,
  boosters: 0,
  success_rate_pct: 0,
  company: 'Custom',
  wikipedia: '',
  height: { meters: 0, feet: 0 },
  diameter: { meters: 0, feet: 0 },
  mass: { kg: 0, lb: 0 },
  engines: { number: 0, type: 'Unknown', version: 'Unknown' }
})

// Actions implementation
export const actions = {
  async [ActionTypes.FETCH_ROCKETS]({ commit }: ActionContext) {
    commit(MutationTypes.SET_LOADING_STATE, 'loading')
    commit(MutationTypes.SET_ERROR, null)
    commit(MutationTypes.SET_ERROR_TYPE, 'generic')

    try {
      const rockets = await spacexApi.getAllRockets()
      commit(MutationTypes.SET_ROCKETS, rockets)
      commit(MutationTypes.SET_LOADING_STATE, 'success')
    } catch (error) {
      const errorType = detectErrorType(error)
      const message = error instanceof Error ? error.message : 'Failed to fetch rockets'
      commit(MutationTypes.SET_ERROR, message)
      commit(MutationTypes.SET_ERROR_TYPE, errorType)
      commit(MutationTypes.SET_LOADING_STATE, 'error')
    }
  },

  async [ActionTypes.FETCH_ROCKET_BY_ID]({ commit, state }: ActionContext, id: string) {
    // Check custom rockets first
    const customRocket = state.customRockets.find((r: Rocket) => r.id === id)
    if (customRocket) {
      commit(MutationTypes.SET_CURRENT_ROCKET, customRocket)
      commit(MutationTypes.SET_LOADING_STATE, 'success')
      return
    }

    commit(MutationTypes.SET_LOADING_STATE, 'loading')
    commit(MutationTypes.SET_ERROR, null)
    commit(MutationTypes.SET_ERROR_TYPE, 'generic')

    try {
      const rocket = await spacexApi.getRocketById(id)
      commit(MutationTypes.SET_CURRENT_ROCKET, rocket)
      commit(MutationTypes.SET_LOADING_STATE, 'success')
    } catch (error) {
      const errorType = detectErrorType(error)
      const message = error instanceof Error ? error.message : 'Failed to fetch rocket'
      commit(MutationTypes.SET_ERROR, message)
      commit(MutationTypes.SET_ERROR_TYPE, errorType)
      commit(MutationTypes.SET_LOADING_STATE, 'error')
    }
  },

  [ActionTypes.ADD_CUSTOM_ROCKET]({ commit }: ActionContext, formData: RocketFormData) {
    const newRocket = createRocketFromFormData(formData)
    commit(MutationTypes.ADD_CUSTOM_ROCKET, newRocket)
  },

  [ActionTypes.SET_SEARCH_QUERY]({ commit }: ActionContext, query: string) {
    commit(MutationTypes.SET_SEARCH_QUERY, query)
  },

  [ActionTypes.SET_COMPANY_FILTER]({ commit }: ActionContext, company: string) {
    commit(MutationTypes.SET_COMPANY_FILTER, company)
  },

  [ActionTypes.SET_COUNTRY_FILTER]({ commit }: ActionContext, country: string) {
    commit(MutationTypes.SET_COUNTRY_FILTER, country)
  },

  [ActionTypes.SET_ACTIVE_FILTER]({ commit }: ActionContext, filter: 'all' | 'active' | 'inactive') {
    commit(MutationTypes.SET_ACTIVE_FILTER, filter)
  },

  [ActionTypes.CLEAR_FILTERS]({ commit }: ActionContext) {
    commit(MutationTypes.CLEAR_FILTERS)
  },

  [ActionTypes.CLEAR_CURRENT_ROCKET]({ commit }: ActionContext) {
    commit(MutationTypes.CLEAR_CURRENT_ROCKET)
  }
}
