import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { rocketApi } from "@/api/rockets";
import type { Rocket, RocketFormData } from "@/types/rocket";

export const useRocketStore = defineStore("rockets", () => {
  // State
  const rockets = ref<Rocket[]>([]);
  const currentRocket = ref<Rocket | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const filterActive = ref<boolean | null>(null);
  const searchQuery = ref("");

  // Getters
  const filteredRockets = computed(() => {
    let filtered = rockets.value;

    // Filter by active status
    if (filterActive.value !== null) {
      filtered = filtered.filter(
        (rocket) => rocket.active === filterActive.value,
      );
    }

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        (rocket) =>
          rocket.name.toLowerCase().includes(query) ||
          rocket.country.toLowerCase().includes(query),
      );
    }

    return filtered;
  });

  const activeRockets = computed(() =>
    rockets.value.filter((rocket) => rocket.active),
  );

  const inactiveRockets = computed(() =>
    rockets.value.filter((rocket) => !rocket.active),
  );

  // Actions
  const fetchRockets = async () => {
    loading.value = true;
    error.value = null;
    try {
      rockets.value = await rocketApi.getAllRockets();
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : "Failed to fetch rockets";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchRocketById = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      currentRocket.value = await rocketApi.getRocketById(id);
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : "Failed to fetch rockets";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const addRocket = async (rocketData: RocketFormData) => {
    const newRocket: Rocket = {
      id: `custom-${Date.now()}`,
      name: rocketData.name,
      description: rocketData.description,
      country: rocketData.country,
      company: rocketData.company,
      cost_per_launch: rocketData.cost_per_launch,
      first_flight: rocketData.first_flight,
      flickr_images: rocketData.flickr_images,
      active: true,
      type: "custom",
      stages: 2,
      boosters: 0,
      success_rate_pct: 0,
      wikipedia: "",
      height: { meters: null, feet: null },
      diameter: { meters: null, feet: null },
      mass: { kg: 0, lb: 0 },
      first_stage: {
        thrust_sea_level: { kN: 0, lbf: 0 },
        thrust_vacuum: { kN: 0, lbf: 0 },
        reusable: false,
        engines: 0,
        fuel_amount_tons: 0,
        burn_time_sec: null,
      },
      second_stage: {
        thrust: { kN: 0, lbf: 0 },
        payloads: {
          composite_fairing: {
            height: { meters: null, feet: null },
            diameter: { meters: null, feet: null },
          },
          option_1: "",
        },
        reusable: false,
        engines: 0,
        fuel_amount_tons: 0,
        burn_time_sec: null,
      },
      engines: {
        isp: { sea_level: 0, vacuum: 0 },
        thrust_sea_level: { kN: 0, lbf: 0 },
        thrust_vacuum: { kN: 0, lbf: 0 },
        number: 0,
        type: "",
        version: "",
        layout: null,
        engine_loss_max: null,
        propellant_1: "",
        propellant_2: "",
        thrust_to_weight: 0,
      },
      landing_legs: {
        number: 0,
        material: null,
      },
      payload_weights: [],
    };

    rockets.value.unshift(newRocket);
  };

  const setFilter = (active: boolean | null) => {
    filterActive.value = active;
  };

  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
  };

  const clearError = () => {
    error.value = null;
  };

  const resetCurrentRocket = () => {
    currentRocket.value = null;
  };

  return {
    // State
    rockets,
    currentRocket,
    loading,
    error,
    filterActive,
    searchQuery,
    // Getters
    filteredRockets,
    activeRockets,
    inactiveRockets,
    // Actions
    fetchRockets,
    fetchRocketById,
    addRocket,
    setFilter,
    setSearchQuery,
    clearError,
    resetCurrentRocket,
  };
});
