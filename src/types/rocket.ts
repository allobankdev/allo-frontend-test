export interface Rocket {
  id: string
  full_name?: string | null
  description?: string | null
  image_url?: string | null
  launch_cost?: number | string | null
  maiden_flight?: string | null
  manufacturer?: { country_code?: string | null } | null
  [key: string]: unknown
}
