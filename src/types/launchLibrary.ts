/** Only the fields of the LL2 v2.2.0 `config/launcher` response that the app reads. */
export interface LauncherConfigDto {
  id: number
  name: string
  full_name: string | null
  description: string | null
  image_url: string | null
  /** Returned as a numeric string, e.g. `"52000000"`. */
  launch_cost: string | null
  maiden_flight: string | null
  manufacturer: {
    name: string
    country_code: string | null
  } | null
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
