import type { Rocket, LoadingState } from '@/types'

// Error types for better UX
export type ErrorType = 'network' | 'server' | 'notfound' | 'generic'

// Rockets Module State
export interface RocketsState {
  rockets: Rocket[]
  customRockets: Rocket[]
  currentRocket: Rocket | null
  loadingState: LoadingState
  error: string | null
  errorType: ErrorType
  searchQuery: string
  companyFilter: string
  countryFilter: string
  activeFilter: 'all' | 'active' | 'inactive'
}

// Root State
export interface RootState {
  rockets: RocketsState
}
