import type { Rocket, RocketApiDto, RocketListResponse } from "@/types/rocket";

const BASE_URL = 'https://lldev.thespacedevs.com/2.2.0/config/launcher/'

function toPositiveNumber(value: string | number | null | undefined): number | null {
    if (value === null || value === undefined) return null
    const parsed = Number(String(value).replace(/[^0-9.]/g, ''))
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

function emptyToNull(value: string | null | undefined): string | null {
    const trimmed = value?.trim()
    return trimmed ? trimmed : null
}


export function mapRocket(dto: RocketApiDto): Rocket {
    return {
        id: String(dto.id),
        name: emptyToNull(dto.full_name) ?? dto.name,
        description: emptyToNull(dto.description),
        imageUrl: emptyToNull(dto.image_url),
        launchCost: toPositiveNumber(dto.launch_cost),
        countryCode: emptyToNull(dto.manufacturer?.country_code),
        maidenFlight: emptyToNull(dto.maiden_flight),
        isLocal: false,
    }
}

async function request<T>(url: string, signal?: AbortSignal): Promise<T>{
    const response = await fetch(url, {signal})
    if (!response.ok) {
        throw new Error (`Request failed with status ${response.status}`)
    }
    return response.json() as Promise<T>
}

export async function fetchRockets(signal?: AbortSignal): Promise<Rocket[]> {
    const query = new URLSearchParams({
        manufacturer__name: 'SpaceX',
        mode: 'detailed',
        limit: '20',
    })
    const data  = await request<RocketListResponse>(`${BASE_URL}?${query.toString()}`, signal)
    return data.results.map(mapRocket)
}

export async function fetchRocketById(id: string, signal?: AbortSignal): Promise<Rocket> {
    const data = await request<RocketApiDto>(`${BASE_URL}${encodeURIComponent(id)}/`, signal)   
    return mapRocket(data)
}