export interface Rocket {
    id: string
    name: string
    company?: string;
    active?: boolean
    type?: string
    description: string
    flickr_images: string[]
    cost_per_launch: number
    country: string
    first_flight: string
}