/**
 * Launch Library 2 — v2.2.0 response shapes (DTOs).
 *
 * Only the fields this app reads are declared. Every optional field is typed as
 * nullable because the API returns `null` for unknown values (see README).
 * These snake_case types are consumed by `mappers/` only.
 */

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface AgencyDto {
  id: number
  name: string
  /** ISO 3166-1 alpha-3, sometimes comma-separated, e.g. "USA" or "FRA,DEU". */
  country_code?: string | null
}

export interface LauncherConfigDto {
  id: number
  name: string
  full_name?: string | null
  family?: string | null
  variant?: string | null
  description?: string | null
  image_url?: string | null
  /** USD, serialized as a string, e.g. "52000000". */
  launch_cost?: string | null
  /** `YYYY-MM-DD` */
  maiden_flight?: string | null
  manufacturer?: AgencyDto | null
  active?: boolean | null
  reusable?: boolean | null
  /** metres */
  length?: number | null
  /** metres */
  diameter?: number | null
  /** tonnes */
  launch_mass?: number | null
  /** kg */
  leo_capacity?: number | null
  /** kg */
  gto_capacity?: number | null
  /** kN */
  to_thrust?: number | null
  total_launch_count?: number | null
  successful_launches?: number | null
  failed_launches?: number | null
  wiki_url?: string | null
}
