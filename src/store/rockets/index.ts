import type { RocketsState, RootState } from '../types'
import { createInitialState } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export const rocketsModule = {
  namespaced: true,
  state: createInitialState,
  mutations,
  actions,
  getters
}

// Re-export types and constants for convenience
export { MutationTypes } from './mutations'
export { ActionTypes } from './actions'
export { GetterTypes } from './getters'
