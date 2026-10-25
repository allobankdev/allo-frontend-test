export interface Manufacturer {
    id: number
    name: string
    country_code: string

}

export interface Rocket {
    id: number
    full_name: string
    description: string
    image_url: string | null
    launch_cost: string | null
    maiden_flight: string |null
    manufacturer: Manufacturer

}

