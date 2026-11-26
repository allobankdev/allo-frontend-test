import { API_BASE_URL, ROCKET_LIST_LIMIT, ROCKET_MANUFACTURER } from '@/config/api'
import type { ApiPaginatedResponse, ApiRocket, Rocket } from '@/types/rocket'
import { getJson } from './http'
import { mapApiRocket } from './rocketMapper'

const LAUNCHER_ENDPOINT = `${API_BASE_URL}/config/launcher/`

export async function fetchRockets (signal?: AbortSignal): Promise<Rocket[]> {
    const params = new URLSearchParams({
        manufacturer__name: ROCKET_MANUFACTURER,
        mode: "detailed",
        limit: String(ROCKET_LIST_LIMIT)
    })

    const data = await getJson<ApiPaginatedResponse<ApiRocket>>(`${LAUNCHER_ENDPOINT}?${params}`, signal)

    const results = Array.isArray(data?.results) ? data.results : []
    return results.map(mapApiRocket)
}

export async function fetchRocketById (id: string, signal?: AbortSignal): Promise<Rocket> {
    const data = await getJson<ApiRocket>(`${LAUNCHER_ENDPOINT}${encodeURIComponent(id)}/`, signal)
    return mapApiRocket(data)
}