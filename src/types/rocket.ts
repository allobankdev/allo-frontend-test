export interface Rocket {
    id: string
    name: string
    description: string | null
    imageUrl: string | null
    launchCost: number | null
    countryCode: string | null
    maidenFlight: string | null
    isLocal: boolean
}

export interface RocketApiDto {
    id: number
    name: string
    full_name: string | null
    description: string | null
    image_url: string | null
    launch_cost: string | number | null
    maiden_flight: string | null
    manufacturer: { country_code: string | null} | null
}

export interface RocketListResponse {
    results: RocketApiDto[]
}

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error'
