export interface RocketRaw {
    id: number
    full_name: string | null
    description: string | null
    image_url: string | null
    launch_cost: string | null
    maiden_flight: string | null
    active: boolean
    manufacturer: { country_code: string | null } | null
}

export interface Rocket {
    id: string
    name: string
    description: string
    imageUrl: string | null
    costPerLaunch: number | null
    country: string | null
    firstFlight: string | null
    active: boolean
    isLocal: boolean
}

export interface RocketListResponse {
    count: number
    next: string | null
    results: RocketRaw[]
}

export interface NewRocketInput {
    name: string
    description: string
    imageUrl?: string | null
    country?: string | null
    costPerLaunch?: number | null
    firstFlight?: string | null
    active?: boolean
}