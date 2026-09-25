/** Missing API values are always `null`, never `undefined` or `''`. */
export interface Rocket {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  /** Cost per launch in USD. */
  costPerLaunch: number | null
  /** Country code as returned by the API, e.g. `USA`. */
  country: string | null
  /** ISO date string (`YYYY-MM-DD`). */
  firstFlight: string | null
  /** Added by the user in this session, not from the API. */
  isLocal: boolean
}

export type NewRocketInput = Omit<Rocket, 'id' | 'isLocal'>

export interface RocketFilters {
  search: string
  country: string | null
}

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

/** `value: null` renders as "Not available". */
export interface RocketSpec {
  label: string
  icon: string
  value: string | null
}
