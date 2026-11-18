import { fetchRocketById, fetchRockets } from "@/services/rockets";
import type { NewRocketInput, Rocket } from "@/types/rocket";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error'
export type StatusFilter = 'all' | 'active' | 'retired'

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
    const addedRockets = ref<Rocket[]>([])
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
            id: `local-${Date.now()}`,
            name: input.name.trim(),
            description: input.description.trim(),
            imageUrl: input.imageUrl?.trim() || null,
            costPerLaunch: input.costPerLaunch ?? null,
            country: input.country?.trim() || null,
            firstFlight: input.firstFlight || null,
            active: true,
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