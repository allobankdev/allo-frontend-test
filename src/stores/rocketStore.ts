import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Rocket } from "@/types/rocket";
import { fetchRockets, fetchRocketById } from "@/services/api";

import type { FlightStatusFilter, CostStatusFilter } from "@/types/rocket";

export const useRocketStore = defineStore("rockets", () => {
  // State
  const rockets = ref<Rocket[]>([]);
  const selectedRocket = ref<Rocket | null>(null);
  const loading = ref(false);
  const detailLoading = ref(false);
  const error = ref<string | null>(null);
  const detailError = ref<string | null>(null);

  // Criteria filter state
  const searchFilter = ref("");
  const countryFilter = ref<string | null>(null);
  const flightStatusFilter = ref<FlightStatusFilter>("all");
  const costStatusFilter = ref<CostStatusFilter>("all");

  // Getters
  const availableCountries = computed(() => {
    const countries = new Set<string>();
    for (const rocket of rockets.value) {
      if (rocket.manufacturer?.country_code) {
        countries.add(rocket.manufacturer.country_code);
      }
    }
    return Array.from(countries).sort();
  });

  const isFilterActive = computed(() => {
    return (
      searchFilter.value.trim() !== "" ||
      countryFilter.value !== null ||
      flightStatusFilter.value !== "all" ||
      costStatusFilter.value !== "all"
    );
  });

  // Filtered rockets based on the current filter criteria
  const filteredRockets = computed(() => {
    const query = searchFilter.value.toLowerCase().trim();
    const country = countryFilter.value;
    const flightStatus = flightStatusFilter.value;
    const costStatus = costStatusFilter.value;

    return rockets.value.filter((rocket) => {
      // Text Search Filter
      if (query) {
        const name = rocket.full_name?.toLowerCase() ?? "";
        const desc = rocket.description?.toLowerCase() ?? "";
        const matchesQuery = name.includes(query) || desc.includes(query);
        if (!matchesQuery) return false;
      }

      // Country Filter
      if (country !== null) {
        const rocketCountry = rocket.manufacturer?.country_code ?? null;
        if (rocketCountry !== country) return false;
      }

      // Flight Status Filter
      if (flightStatus === "flown") {
        if (!rocket.maiden_flight) return false;
      } else if (flightStatus === "not_flown") {
        if (rocket.maiden_flight) return false;
      }

      // Cost Status Filter
      if (costStatus === "has_cost") {
        if (!rocket.launch_cost) return false;
      } else if (costStatus === "no_cost") {
        if (rocket.launch_cost) return false;
      }

      return true;
    });
  });

  // Actions
  async function loadRockets() {
    loading.value = true;
    error.value = null;
    try {
      const apiRockets = await fetchRockets();
      // Keep locally-added rockets (they have negative IDs)
      const localRockets = rockets.value.filter((r) => r.id < 0);
      rockets.value = [...apiRockets, ...localRockets];
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal memuat data roket";
      error.value = message;
    } finally {
      loading.value = false;
    }
  }

  // Load a single rocket by ID, either from the API or from locally-added rockets
  async function loadRocketById(id: number | string) {
    const numericId = typeof id === "string" ? parseInt(id, 10) : id;

    if (numericId < 0) {
      selectedRocket.value =
        rockets.value.find((r) => r.id === numericId) ?? null;
      return;
    }

    detailLoading.value = true;
    detailError.value = null;
    try {
      selectedRocket.value = await fetchRocketById(id);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal memuat detail roket";
      detailError.value = message;
    } finally {
      detailLoading.value = false;
    }
  }

// Add a new rocket to the store with a temporary negative ID
  let localIdCounter = -1;
  function addRocket(rocketData: Omit<Rocket, "id">) {
    const newRocket: Rocket = {
      ...rocketData,
      id: localIdCounter--,
    };
    rockets.value.unshift(newRocket);
  }

// Reset all filters to their default values
  function resetFilters() {
    searchFilter.value = "";
    countryFilter.value = null;
    flightStatusFilter.value = "all";
    costStatusFilter.value = "all";
  }

  return {
    // State
    rockets,
    selectedRocket,
    loading,
    detailLoading,
    error,
    detailError,
    searchFilter,
    countryFilter,
    flightStatusFilter,
    costStatusFilter,
    // Getters
    availableCountries,
    isFilterActive,
    filteredRockets,
    // Actions
    loadRockets,
    loadRocketById,
    addRocket,
    resetFilters,
  };
});
