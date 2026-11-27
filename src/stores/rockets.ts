import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchRocketDetail, fetchSpaceXRockets } from '@/services/rocketService'
import type { NewRocketPayload, Rocket } from '@/types/rocket'

export type DataAvailabilityFilter = 'all' | 'has_cost' | 'has_flight'

export const useRocketStore = defineStore('rockets', () => {
    // List state
    const rockets = ref<Rocket[]>([])
    const listLoading = ref(false)
    const listError = ref<string | null>(null)
    const hasLoadedList = ref(false)

    // Detail state
    const selectedRocket = ref<Rocket | null>(null)
    const detailLoading = ref(false)
    const detailError = ref<string | null>(null)

    // Filter state
    const searchQuery = ref('')
    const availabilityFilter = ref<DataAvailabilityFilter>('all')

    const filteredRockets = computed(() => {
        const query = searchQuery.value.trim().toLowerCase()

        return rockets.value.filter(rocket => {
            const matchesQuery =
                !query
                || rocket.name.toLowerCase().includes(query)
                || rocket.description.toLowerCase().includes(query)
                || (rocket.country?.toLowerCase().includes(query) ?? false)

            if (!matchesQuery) {
                return false
            }

            if (availabilityFilter.value === 'has_cost') {
                return rocket.costPerLaunch !== null
            }

            if (availabilityFilter.value === 'has_flight') {
                return Boolean(rocket.firstFlight)
            }

            return true
        })
    })

    async function loadRockets(force = false) {
        if (hasLoadedList.value && !force) {
            return
        }

        listLoading.value = true
        listError.value = null

        try {
            const apiRockets = await fetchSpaceXRockets()
            // Pertahankan roket lokal yang sudah ditambahkan user saat refresh/retry
            const localRockets = rockets.value.filter(item => item.isLocal)
            rockets.value = [...localRockets, ...apiRockets]
            hasLoadedList.value = true
        } catch (error) {
            listError.value = error instanceof Error
                ? error.message
                : 'Unable to load SpaceX rockets. Please try again.'
        } finally {
            listLoading.value = false
        }
    }

    async function loadRocketById(rawId: number | string) {
        const id = Number(rawId)
        detailError.value = null

        if (Number.isNaN(id)) {
            selectedRocket.value = null
            detailError.value = 'Invalid rocket ID.'
            return
        }

        // 1. Cek di state lokal dulu (menghindari 404 untuk roket yang baru ditambahkan user)
        const existingRocket = rockets.value.find(item => item.id === id)
        if (existingRocket) {
            selectedRocket.value = existingRocket
            return
        }

        // 2. Jika user langsung akses/refresh URL detail, fetch ke endpoint single rocket
        detailLoading.value = true
        selectedRocket.value = null

        try {
            const detail = await fetchRocketDetail(id)
            selectedRocket.value = detail
        } catch (error) {
            detailError.value = error instanceof Error
                ? error.message
                : 'Unable to load rocket details. Please try again.'
        } finally {
            detailLoading.value = false
        }
    }

    function addRocket(payload: NewRocketPayload): Rocket {
        const newRocket: Rocket = {
            id: Date.now(),
            name: payload.name.trim(),
            description: payload.description.trim(),
            imageUrl: payload.imageUrl?.trim() || null,
            costPerLaunch: payload.costPerLaunch ?? null,
            country: payload.country?.trim() || null,
            firstFlight: payload.firstFlight?.trim() || null,
            isLocal: true,
        }

        rockets.value = [newRocket, ...rockets.value]
        return newRocket
    }

    function resetFilters() {
        searchQuery.value = ''
        availabilityFilter.value = 'all'
    }

    return {
        rockets,
        listLoading,
        listError,
        hasLoadedList,
        selectedRocket,
        detailLoading,
        detailError,
        searchQuery,
        availabilityFilter,
        filteredRockets,
        loadRockets,
        loadRocketById,
        addRocket,
        resetFilters,
    }
})