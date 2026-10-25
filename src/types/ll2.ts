/**
 * Subset of the Launch Library 2 /config/launcher payload (v2.2.0) that the UI
 * actually reads. Several fields are optional because the API returns them
 * as null for some rockets — see the README.
 */
export interface Launcher {
  id: number
  full_name: string
  description?: string
  image_url?: string
  launch_cost?: number
  maiden_flight?: string
  manufacturer?: {
    name?: string
    country_code?: string
  }
}
