import type { Rocket, RocketApiItem, RocketListApiResponse } from '@/types/rocket'

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher'

function parseLaunchCost(rawCost: string | number | null | undefined): number | null {
    if (rawCost === null || rawCost === undefined || rawCost === '') {
        return null
    }
    const parsed = Number(rawCost)
    return Number.isFinite(parsed) ? parsed : null
}

export function mapApiItemToRocket(item: RocketApiItem): Rocket {
    return {
        id: item.id,
        name: item.full_name?.trim() || 'Unnamed Rocket',
        description: item.description?.trim() || '',
        imageUrl: item.image_url?.trim() || null,
        costPerLaunch: parseLaunchCost(item.launch_cost),
        country: item.manufacturer?.country_code?.trim() || null,
        firstFlight: item.maiden_flight?.trim() || null,
        isLocal: false,
    }
}

export async function fetchSpaceXRockets(): Promise<Rocket[]> {
    const url = `${BASE_URL}/?manufacturer__name=SpaceX&mode=detailed&limit=20`
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Failed to fetch rockets (HTTP ${response.status})`)
    }

    const data: RocketListApiResponse = await response.json()
    return data.results.map(mapApiItemToRocket)
}

export async function fetchRocketDetail(id: number | string): Promise<Rocket> {
    const url = `${BASE_URL}/${id}/`
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Failed to fetch rocket details (HTTP ${response.status})`)
    }

    const data: RocketApiItem = await response.json()
    return mapApiItemToRocket(data)
}