export interface RocketManufacturer {
  id?: number
  name: string
  country_code: string | null
}

export interface Launcher {
  id: number | string
  name?: string
  full_name: string
  description: string | null
  family: string | null
  variant?: string | null
  active: boolean | null
  image_url: string | null
  launch_cost: string | null
  maiden_flight: string | null
  manufacturer: RocketManufacturer | null
  _local?: false
}

export interface LocalRocketInput {
  full_name: string
  description?: string | null
  family?: string | null
  active?: boolean | null
  image_url?: string | null
  launch_cost?: string | null
  maiden_flight?: string | null
  country_code?: string | null
}

export interface LocalRocket extends Omit<Launcher, 'id' | '_local'> {
  id: `local-${string}`
  _local: true
}

export type Rocket = Launcher | LocalRocket

export interface LauncherListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Launcher[]
}

export type RocketStatusFilter = 'all' | 'active' | 'inactive'

export function isLocalRocket (rocket: Rocket): rocket is LocalRocket {
  return (rocket as LocalRocket)._local === true
}

export function rocketIdString (id: number | string): string {
  return String(id)
}
