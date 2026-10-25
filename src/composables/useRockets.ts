// ============================================================
// Composable — useRockets
// ============================================================

import { storeToRefs } from 'pinia'
import { useRocketStore } from '@/stores/rocketStore'
import type { RocketFilterState } from '@/types/rocket'

export function useRockets() {
  const store = useRocketStore()

  const {
    rockets,
    localRockets,
    selectedRocket,
    isLoading,
    isDetailLoading,
    error,
    detailError,
    filters,
    filteredRockets,
    allRockets,
    availableCountries,
    hasData,
  } = storeToRefs(store)

  return {
    // Reactive state
    rockets,
    localRockets,
    selectedRocket,
    isLoading,
    isDetailLoading,
    error,
    detailError,
    filters,
    filteredRockets,
    allRockets,
    availableCountries,
    hasData,
    // Actions
    loadRockets: store.loadRockets,
    retryLoadRockets: store.retryLoadRockets,
    loadRocketById: store.loadRocketById,
    addLocalRocket: store.addLocalRocket,
    setFilters: (f: Partial<RocketFilterState>) => store.setFilters(f),
    resetFilters: store.resetFilters,
    clearDetail: store.clearDetail,
  }
}
