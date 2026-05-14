import { defineStore } from "pinia";
import { ref } from "vue";

export interface Rocket {
  id: string;
  name: string;
  description: string;
  flickr_images: string[];
  cost_per_launch: number;
  country: string;
  first_flight: string;
  active: boolean;
}

const SPACEX_API_BASE = "https://api.spacexdata.com/v4/rockets";

export const useRocketStore = defineStore("rocket", () => {
  // List state
  const rockets = ref<Rocket[]>([]);
  const filteredRockets = ref<Rocket[]>([]);
  const searchQuery = ref("");
  const loading = ref(false);
  const error = ref<string | null>(null);

  const selectedRocket = ref<Rocket | null>(null);
  const detailLoading = ref(false);
  const detailError = ref<string | null>(null);

  async function fetchRockets() {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(SPACEX_API_BASE);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data: Rocket[] = await response.json();
      rockets.value = data;
      applyFilter();
    } catch (err) {
      console.error("fetchRockets failed:", err);
      error.value = "Failed to load rockets. Please try again.";
    } finally {
      loading.value = false;
    }
  }

  async function fetchRocketById(id: string) {
    detailLoading.value = true;
    detailError.value = null;
    selectedRocket.value = null;
    try {
      const local = rockets.value.find((r) => r.id === id);
      if (local) {
        selectedRocket.value = local;
        return;
      }

      const response = await fetch(`${SPACEX_API_BASE}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      selectedRocket.value = await response.json();
    } catch (err) {
      console.error("fetchRocketById failed:", err);
      detailError.value = "Failed to load rocket detail. Please try again.";
    } finally {
      detailLoading.value = false;
    }
  }

  function applyFilter() {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) {
      filteredRockets.value = rockets.value;
      return;
    }
    filteredRockets.value = rockets.value.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q),
    );
  }

  function filterRockets(query: string) {
    searchQuery.value = query;
    applyFilter();
  }

  function addRocket(rocket: Rocket) {
    rockets.value.push(rocket);
    applyFilter();
  }

  return {
    // List
    rockets,
    filteredRockets,
    searchQuery,
    loading,
    error,
    // Detail
    selectedRocket,
    detailLoading,
    detailError,
    // Actions
    fetchRockets,
    fetchRocketById,
    filterRockets,
    addRocket,
  };
});
