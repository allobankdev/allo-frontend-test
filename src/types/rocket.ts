/** Lifecycle of any async load. */
export type LoadStatus = 'idle' | 'loading' | 'success' | 'error'

/** Rocket as used by the UI. Every optional field is `null` when the API omits it. */
export interface Rocket {
  /** `api-<launcherId>` for API rockets, `local-<n>` for rockets added in the app. */
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  /** Cost per launch in USD. */
  launchCost: number | null
  country: string | null
  /** ISO date (YYYY-MM-DD) or null. */
  firstFlight: string | null
  source: 'api' | 'local'
}

/** Input from the "add rocket" form. */
export interface NewRocketInput {
  name: string
  description: string | null
  imageUrl: string | null
  launchCost: number | null
  country: string | null
  firstFlight: string | null
}
