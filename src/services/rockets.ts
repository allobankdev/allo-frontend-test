import type { Rocket, RocketListResponse, RocketRaw } from '@/types/rocket'
import { getJson } from './http'
import { parseNullableNumber } from '@/utils/number'

const ROCKETS_PATH = '/config/launcher/'

export function toRocket(raw: RocketRaw): Rocket {
    return {
        id: String(raw.id),
        name: raw.full_name?.trim() || 'Unnamed rocket',
        description: raw.description?.trim() || '',
        imageUrl: raw.image_url?.trim() || null,
        costPerLaunch: parseNullableNumber(raw.launch_cost),
        country: raw.manufacturer?.country_code?.trim() || null,
        firstFlight: raw.maiden_flight?.trim() || null,
        active: Boolean(raw.active),
        isLocal: false,
    }
}

export async function fetchRockets(): Promise<Rocket[]> {
    const data = await getJson<RocketListResponse>(ROCKETS_PATH, {
        manufacturer__name: 'SpaceX',
        mode: 'detailed',
        limit: 20,
    })
    return data.results.map(toRocket)
}

export async function fetchRocketById(id: string): Promise<Rocket> {
    const raw = await getJson<RocketRaw>(`${ROCKETS_PATH}${encodeURIComponent(id)}/`)
    return toRocket(raw)
}
