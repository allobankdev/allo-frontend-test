import type { Rocket } from "@/types/rocket";

const STORAGE_KEY = 'rocket-explore:custom-rockets'

function isStoredRocket(value: unknown): value is Rocket {
    if (typeof value !== 'object' || value === null) {
        return false
    }

    const rocket = value as Record<string, unknown>

    return (
        typeof rocket.id === 'string' &&
        typeof rocket.name === 'string' &&
        typeof rocket.description === 'string' &&
        (rocket.imageUrl === null || typeof rocket.imageUrl === 'string') &&
        typeof rocket.launchCost === 'number' &&
        Number.isFinite(rocket.launchCost) &&
        typeof rocket.country === 'string' &&
        typeof rocket.firstFlight === 'string' &&
        typeof rocket.active === 'boolean' &&
        rocket.isCustom === true
    )
}

export function loadCustomRockets(): Rocket[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)

        if (!raw) return []

        const parsed: unknown = JSON.parse(raw)

        if (!Array.isArray(parsed)) return []

        return parsed.filter(isStoredRocket)
    } catch {
        return []
    }
}

export function saveCustomRockets(rockets: Rocket[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rockets))
    } catch {
        return
    }
}