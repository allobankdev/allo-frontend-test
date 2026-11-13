export interface Rocket {
  id: number | string
  full_name: string
  description?: string | null
  image_url?: string | null
  launch_cost?: string | number | null
  maiden_flight?: string | null
  manufacturer?: { country_code?: string | null } | null
}