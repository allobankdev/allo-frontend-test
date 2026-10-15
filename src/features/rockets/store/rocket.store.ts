/**
 * src/features/rockets/stores/rocketStore.ts
 *
 * Pinia Store for Rocket Feature (UI State & Local Data Management)
 */

import { defineStore } from 'pinia'

import { computed, reactive, ref } from 'vue';
import type { Rocket } from '../rocket.types';
import { fetchRockets } from '../api/rocket.rest';

export const useRocketStore = defineStore('rockets', () => {
  // State
  const remoteRockets = ref<Rocket[]>([]);
  const localRockets = ref<Rocket[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const filter = reactive({
    search: '',
  })

  // Computed: Merge Remote and Local Data
  const combinedRockets = computed(() => {
    return [...localRockets.value, ...remoteRockets.value];
  });

  // Computed: Filter by Search Query
  const filteredRockets = computed(() => {
    const search = filter.search.toLowerCase().trim();
    if (!search) return combinedRockets.value;

    return combinedRockets.value.filter(
      (rocket) =>
        rocket.name.toLowerCase().includes(search) ||
        (rocket.description && rocket.description.toLowerCase().includes(search))
    );
  });

  // Computed: Total pages based on filtered data
  const getTotalPages = (pageSize: number) => {
    return Math.ceil(filteredRockets.value.length / pageSize) || 1;
  };

  // Computed: Slice data for active page pagination
  const getPaginatedRockets = (page: number, pageSize: number) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredRockets.value.slice(start, end);
  };


  // Actions: Fetch Remote Rockets ---
  const fetchAllRockets = async () => {
    // If the data has already been fetched, skip refetching (optional caching)
    if (remoteRockets.value.length > 0) return;

    loading.value = true;
    error.value = null;

    try {
      // Fetch data by limit 20, because return 13
      const data = await fetchRockets(1, 20);
      // Set new data with mapping
      remoteRockets.value = data.results.map((rocket) => ({
        id: rocket.id,
        name: rocket.full_name,
        description: rocket.description,
        imageUrl: rocket.image_url,
        launchCost: rocket.launch_cost,
        countryCode: rocket.manufacturer.country_code,
        maidenFlight: rocket.maiden_flight,
      }));
    } catch (err) {
      console.error('Failed load rockets: ', err);
      error.value = 'An unexpected error occurred.';
    } finally {
      loading.value = false;
    }
  };

  // Actions: Add local rocket
  const addLocalRocket = (rocket: Rocket) => {
    localRockets.value.unshift(rocket);
  };

  return {
    loading,
    error,
    filter,
    combinedRockets,
    getPaginatedRockets,
    getTotalPages,
    fetchAllRockets,
    addLocalRocket,
  };
});
