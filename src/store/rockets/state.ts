import type { RocketsState } from '../types'

export const createInitialState = (): RocketsState => ({
  rockets: [],
  customRockets: [],
  currentRocket: null,
  loadingState: 'idle',
  error: null,
  errorType: 'generic',
  searchQuery: '',
  companyFilter: '',
  countryFilter: '',
  activeFilter: 'all'
})
