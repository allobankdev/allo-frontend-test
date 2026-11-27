export interface RocketMenuFacturer {
    id?: number
    name?: string
    country_code?: string | null
}

export interface Rocket {
    id: number
    full_name: string
    image_url: string | null
    launch_cost: string | null
    maiden_flight: string | null
    manufacturer?: RocketMenuFacturer | null
    family?: string | null
    active?: boolean
    reusable?: boolean
    isLocal?: boolean
}

export interface RocketListResponse {
    count: number
    next: string | null
    previous: string | null
    results: Rocket[]
}

export interface NewRocketPayload {
    full_name: string
    description: string
    image_url: string | null
    launch_cost: string | null
    country_code: string | null
    family: string | null
    active: boolean
}

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'