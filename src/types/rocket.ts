export interface Rocket {
  id: number
  name: string
  full_name: string
  description: string | null
  image_url: string | null
  launch_cost: string | null
  maiden_flight: string | null
  manufacturer: {
    name: string
    country_code: string | null
  } | null
}

export interface LauncherListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Rocket[]
}
