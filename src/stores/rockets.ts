import { fetchAllRockets } from "@/services/rocketsApi";
import type { Rocket } from "@/types/rocket";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export type Status = "loading" | "success" | "error" | "idle";

export const useRocketsStore = defineStore("rockets", () => {
  const rockets = ref<Rocket[]>([]);
  const filteredRockets = ref<Rocket[]>([]);
  const status = ref<Status>("idle");
  const error = ref<string | null>(null);
  const filters = ref({
    search: "",
    country: "",
  });

  const allCountries = computed(() => {
    const countries = new Set<string>();
    rockets.value.forEach((rocket) => {
      if (rocket.country) {
        countries.add(rocket.country);
      }
    });
    return Array.from(countries).sort();
  });

  async function fetchRockets() {
    status.value = "loading";
    error.value = null;

    try {
      const [apiRockets, localRockets] = await Promise.all([
        fetchAllRockets(),
        getLocalRockets(),
      ]);

      rockets.value = [...localRockets, ...apiRockets];
      applyFilters();
      status.value = "success";
    } catch (err) {
      status.value = "error";
      error.value = (err as Error).message || "Failed to fetch rockets";
      throw err;
    }
  }

  function getLocalRockets(): Rocket[] {
    try {
      return JSON.parse(localStorage.getItem("localRockets") || "[]");
    } catch {
      return [];
    }
  }

  function saveLocalRocket(rocket: Rocket) {
    const local = getLocalRockets();
    local.unshift(rocket);
    localStorage.setItem("localRockets", JSON.stringify(local));
  }

  function addRocket(payload: Rocket) {
    const newRocket: Rocket = {
      ...payload,
      id: `local-${Date.now()}`,
      name: payload.name || "New Rocket",
      description: payload.description || "",
      flickr_images: payload.flickr_images?.length ? payload.flickr_images : [""],
      cost_per_launch: payload.cost_per_launch || 0,
      country: payload.country || "",
      first_flight: payload.first_flight || new Date().toISOString().split('T')[0],
    };
  
    rockets.value.unshift(newRocket);
    saveLocalRocket(newRocket);
    applyFilters();
    return newRocket;
  }

  function getRocketById(id: string) {
    return rockets.value.find((rocket) => rocket.id === id);
  }

  function setFilters(newFilters: { search?: string; country?: string }) {
    filters.value = { ...filters.value, ...newFilters };
    applyFilters();
  }

  function applyFilters() {
    filteredRockets.value = rockets.value.filter((rocket) => {
      const matchesSearch =
        !filters.value.search ||
        rocket.name.toLowerCase().includes(filters.value.search.toLowerCase());

      const matchesCountry =
        !filters.value.country ||
        rocket.country
          ?.toLowerCase()
          .includes(filters.value.country.toLowerCase());

      return matchesSearch && matchesCountry;
    });
  }

  function resetFilters() {
    filters.value = { search: "", country: "" };
    applyFilters();
  }

  async function retryFetchRockets() {
    return fetchRockets();
  }

  const count = computed(() => filteredRockets.value.length);

  return {
    // State
    rockets: filteredRockets,
    status,
    error,
    filters,
    allCountries,

    // Actions
    fetchRockets,
    addRocket,
    getRocketById,
    setFilters,
    resetFilters,
    retryFetchRockets,

    // Getters
    count,
  };
});
