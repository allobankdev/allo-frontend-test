/**
 * Domain model used by the whole UI.
 *
 * Convention: a missing value is always `null` (never `undefined` or `""`),
 * so components have exactly one "missing" case to render.
 */

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

export type RocketSource = 'api' | 'local'

export interface RocketSpecs {
  heightMeters: number | null
  diameterMeters: number | null
  massTonnes: number | null
  leoCapacityKg: number | null
  gtoCapacityKg: number | null
  thrustKilonewtons: number | null
}

export interface RocketLaunchStats {
  total: number | null
  successful: number | null
  failed: number | null
}

export interface Rocket {
  /** API ids are numeric strings; user-added rockets start with `local-`. */
  id: string
  name: string
  family: string | null
  description: string | null
  imageUrl: string | null
  /** USD */
  launchCost: number | null
  /** ISO 3166-1 alpha-3 codes. Empty when unknown. */
  countryCodes: string[]
  /** `YYYY-MM-DD` */
  firstFlight: string | null
  manufacturer: string | null
  isActive: boolean | null
  isReusable: boolean | null
  specs: RocketSpecs
  launches: RocketLaunchStats
  wikiUrl: string | null
  source: RocketSource
}

/** Values collected by the "Add rocket" form. */
export interface NewRocketInput {
  name: string
  description: string | null
  imageUrl: string | null
  launchCost: number | null
  countryCode: string | null
  firstFlight: string | null
  isActive: boolean
  isReusable: boolean
}
