/**
 * Shape of the data we care about from the Launch Library 2 API
 * (`/2.2.0/config/launcher/`, `mode=detailed`).
 *
 * Every field except `id` and `full_name` can legitimately be `null` on the
 * real API (see README: "some rockets have missing values for launch_cost,
 * maiden_flight, and image_url"), so the UI must be able to render sensibly
 * when any of them is missing.
 */

export interface RocketManufacturer {
  name?: string
  /** ISO-3166 alpha-3 country code, e.g. "USA". Can be missing. */
  country_code?: string | null
}

export interface Rocket {
  /**
   * Numeric on real API rockets, string on rockets the user adds locally
   * (e.g. "local-<uuid>") since the API is read-only and can't issue us a
   * real id.
   */
  id: number | string
  full_name: string
  description?: string | null
  image_url?: string | null
  /** Numeric string from the API, e.g. "50000000". */
  launch_cost?: string | null
  /** ISO date string, e.g. "2015-12-22". */
  maiden_flight?: string | null
  /** Rocket family, e.g. "Falcon" / "Starship". Used for filtering. */
  family?: string | null
  manufacturer?: RocketManufacturer | null
  /** True for rockets added by the user in this session (not from the API). */
  isLocal?: boolean
}

/** Fields the "add rocket" form collects. */
export interface NewRocketInput {
  full_name: string
  description: string
  image_url: string
  launch_cost: string
  maiden_flight: string
  country_code: string
}
