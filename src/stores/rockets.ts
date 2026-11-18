import { fetchRocketById, fetchRockets } from "@/services/rockets";
import type { NewRocketInput, Rocket } from "@/types/rocket";
import { readJson, writeJson } from "@/utils/storage";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error'
export type StatusFilter = 'all' | 'active' | 'retired'

export const ADDED_ROCKETS_STORAGE_KEY = 'rockets:added'

function isStoredRocket(value: unknown): value is Rocket {
    if (!value || typeof value !== 'object') return false

    const rocket = value as Partial<Rocket>
    return typeof rocket.id === 'string'
        && typeof rocket.name === 'string'
        && typeof rocket.description === 'string'
}

export function loadStoredRockets(): Rocket[] {
    const stored = readJson<unknown>(ADDED_ROCKETS_STORAGE_KEY, [])
    if (!Array.isArray(stored)) return []

    return stored.filter(isStoredRocket).map((rocket) => ({
        ...rocket,
        imageUrl: rocket.imageUrl ?? null,
        costPerLaunch: typeof rocket.costPerLaunch === 'number' ? rocket.costPerLaunch : null,
        country: rocket.country ?? null,
        firstFlight: rocket.firstFlight ?? null,
        active: Boolean(rocket.active),
        isLocal: true,
    }))
}

export function matchesRocketFilter(
    rocket: Rocket,
    query: string,
    status: StatusFilter,
): boolean {
    const normalizedQuery = query.trim().toLowerCase()

    const matchesQuery =
        normalizedQuery === ''
        || rocket.name.toLowerCase().includes(normalizedQuery)
        || rocket.description.toLowerCase().includes(normalizedQuery)

    const matchesStatus =
        status === 'all' || (status === 'active' ? rocket.active : !rocket.active)

    return matchesQuery && matchesStatus
}

export const useRocketStore = defineStore('rockets', () => {
    const fetchedRockets = ref<Rocket[]>([])
    const addedRockets = ref<Rocket[]>(loadStoredRockets())
    const status = ref<LoadStatus>('idle')
    const errorMessage = ref('')
    const searchQuery = ref('')
    const statusFilter = ref<StatusFilter>('all')

    const rockets = computed<Rocket[]>(() => [...addedRockets.value, ...fetchedRockets.value])

    const filteredRockets = computed<Rocket[]>(() =>
        rockets.value.filter((rocket) => matchesRocketFilter(
            rocket,
            searchQuery.value,
            statusFilter.value,
        )),
    )

    const hasActiveFilter = computed(
        () => searchQuery.value.trim() !== '' || statusFilter.value !== 'all',
    )

    watch(
        addedRockets,
        (value) => writeJson(ADDED_ROCKETS_STORAGE_KEY, value),
        { deep: true },
    )

    async function loadRockets(force = false): Promise<void> {
        if (status.value === 'loading') return
        if (!force && status.value === 'success') return

        status.value = 'loading'
        errorMessage.value = ''

        try {
            fetchedRockets.value = await fetchRockets()
            status.value = 'success'
        } catch (error) {
            errorMessage.value =
                error instanceof Error ? error.message : 'Something went wrong while loading rockets.'
            status.value = 'error'
        }
    }

    async function getRocket(id: string): Promise<Rocket> {
        const cached = rockets.value.find((rocket) => rocket.id === id)
        if (cached) return cached

        const rocket = await fetchRocketById(id)
        fetchedRockets.value = [...fetchedRockets.value, rocket]
        return rocket
    }

    function addRocket(input: NewRocketInput): Rocket {
        const rocket: Rocket = {
            id: `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
            name: input.name.trim(),
            description: input.description.trim(),
            imageUrl: input.imageUrl?.trim() || null,
            costPerLaunch: input.costPerLaunch ?? null,
            country: input.country?.trim() || null,
            firstFlight: input.firstFlight || null,
            active: input.active ?? true,
            isLocal: true,
        }

        addedRockets.value = [rocket, ...addedRockets.value]
        return rocket
    }

    function resetFilters(): void {
        searchQuery.value = ''
        statusFilter.value = 'all'
    }

    return {
        rockets,
        filteredRockets,
        status,
        errorMessage,
        searchQuery,
        statusFilter,
        hasActiveFilter,
        loadRockets,
        getRocket,
        addRocket,
        resetFilters,
    }
})