import { loadCustomRockets, saveCustomRockets } from "@/services/customRocketStorage"
import { fetchRockets } from "@/services/rocketApi"
import { toRockets } from "@/services/rocketMapper"
import type { Rocket, RocketInput } from "@/types/rocket"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

type LoadingStatus = 'idle' | 'loading' | 'success' | 'error'

export const useRocketStore = defineStore('rockets', () => {
    const rockets = ref<Rocket[]>([])
    const customRockets = ref<Rocket[]>(loadCustomRockets())
    const allRockets = computed(() => [
        ...customRockets.value,
        ...rockets.value
    ])
    const status = ref<LoadingStatus>('idle')
    const errorMessage = ref('')
    const searchQuery = ref('')
    const countryFilter = ref('')
    const statusFilter = ref<'all' | 'active' | 'inactive'>('all')

    let controller: AbortController | null = null

    
    const countries = computed(() => {
    return [...new Set(allRockets.value.map((rocket) => rocket.country))]
        .sort((a, b) => a.localeCompare(b))
    })

    const filteredRockets = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()

    return allRockets.value.filter((rocket) => {
        const matchesSearch =
        !query ||
        rocket.name.toLowerCase().includes(query) ||
        rocket.description.toLowerCase().includes(query)

        const matchesCountry =
        !countryFilter.value ||
        rocket.country === countryFilter.value

        const matchesStatus =
        statusFilter.value === 'all' ||
        (statusFilter.value === 'active' && rocket.active === true) ||
        (statusFilter.value === 'inactive' && rocket.active === false)

        return matchesSearch && matchesCountry && matchesStatus
    })
    })

    async function loadRockets() {
        controller?.abort()
        controller = new AbortController()

        status.value = 'loading'
        errorMessage.value = ''

        try {
            const response = await fetchRockets(controller.signal)
            rockets.value = toRockets(response)
            status.value = 'success'
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') return

            errorMessage.value = error instanceof Error
                ? error.message
                : 'An unexpected error occurred'

            status.value = 'error'
        }
    }

    function ensureLoaded() {
        if (status.value === 'idle' || status.value === 'error') {
            return loadRockets()
        }

        return Promise.resolve()
    }

    function cancelFetch() {
        controller?.abort()
        controller = null

        if (status.value === 'loading') {
            status.value = 'idle'
        }
    }

    function addRocket(input: RocketInput): Rocket {
        const newRocket: Rocket = {
            ...input,
            id: crypto.randomUUID(),
            isCustom: true,
        }

        customRockets.value.unshift(newRocket)
        saveCustomRockets(customRockets.value)

        return newRocket
    }

    function findById(id: string): Rocket | undefined {
        return allRockets.value.find((rocket) => rocket.id === id)
    }

    return {
        rockets,
        status,
        errorMessage,
        searchQuery,
        filteredRockets,
        countryFilter,
        statusFilter,
        countries,
        customRockets,
        allRockets,
        addRocket,
        loadRockets,
        ensureLoaded,
        cancelFetch,
        findById
    }
})