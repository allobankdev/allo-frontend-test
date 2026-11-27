export interface RocketManufacturerApi {
    id?: number
    name?: string
    country_code?: string | null
}

export interface RocketApiItem {
    id: number
    full_name: string
    description: string | null
    image_url: string | null
    launch_cost: string | number | null
    maiden_flight: string | null
    manufacturer: RocketManufacturerApi | null
}

export interface RocketListApiResponse {
    count: number
    next: string | null
    previous: string | null
    results: RocketApiItem[]
}

export interface Rocket {
    id: number
    name: string
    description: string
    imageUrl: string | null
    costPerLaunch: number | null
    country: string | null
    firstFlight: string | null
    isLocal?: boolean
}

export interface NewRocketPayload {
    name: string
    description: string
    imageUrl?: string
    costPerLaunch?: number | null
    country?: string
    firstFlight?: string
}