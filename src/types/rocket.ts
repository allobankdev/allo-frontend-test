
  export interface RocketManufacturer {
    name?: string | null
    country_code?: string | null
  }
  
  export interface Rocket {
    id: number | string
    full_name?: string | null
    description?: string | null
    image_url?: string | null
    launch_cost?: number | string | null
    maiden_flight?: string | null
    manufacturer?: RocketManufacturer | null
  }
  
  export interface RocketApiResponse {
    results: Rocket[]
    count: number
    next: string | null
    previous: string | null
  }