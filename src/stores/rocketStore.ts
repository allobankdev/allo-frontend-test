import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Rocket } from "@/types/rocketTypes";

const API_BASE = "https://api.spacexdata.com/v4/rockets";
const STORAGE_KEY = "local-rockets";

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const useRocketStore = defineStore("rocket", () => {
  const route = useRoute();
  const router = useRouter();

  const rocketsFromApi = ref<Rocket[]>([]);
  const localRockets = ref<Rocket[]>(
    JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  );

  const loading = ref(false);
  const error = ref<string | null>(null);

  const filters = computed(() => {
    const q = route.query;

    return {
      search: (q.search as string) || "",
      active: q.active === "true" ? true : q.active === "false" ? false : null,
      country: (q.country as string) || null,
      year: q.year ? Number(q.year) : null,
      costMin: q.costMin ? Number(q.costMin) : null,
      costMax: q.costMax ? Number(q.costMax) : null,
    };
  });

  const allRockets = computed(() => [
    ...localRockets.value,
    ...rocketsFromApi.value,
  ]);

  const filteredRockets = computed(() => {
    return allRockets.value.filter((r) => {
      if (
        filters.value.search &&
        !r.name.toLowerCase().includes(filters.value.search.toLowerCase())
      )
        return false;

      if (filters.value.active !== null && r.active !== filters.value.active)
        return false;

      if (
        filters.value.country &&
        !r.country.toLowerCase().includes(filters.value.country.toLowerCase())
      )
        return false;

      if (
        filters.value.year &&
        new Date(r.first_flight).getFullYear() !== filters.value.year
      )
        return false;

      if (
        filters.value.costMin !== null &&
        r.cost_per_launch < filters.value.costMin
      )
        return false;

      if (
        filters.value.costMax !== null &&
        r.cost_per_launch > filters.value.costMax
      )
        return false;

      return true;
    });
  });

  async function fetchRockets() {
    if (rocketsFromApi.value.length > 0) return;

    loading.value = true;
    error.value = null;

    try {
      rocketsFromApi.value = await fetchJSON<Rocket[]>(API_BASE);
    } catch (e) {
      error.value = "Failed to fetch rockets";
      console.error(e);
    } finally {
      loading.value = false;
    }
  }

  async function fetchRocketById(id: string): Promise<Rocket | null> {
    loading.value = true;
    error.value = null;

    try {
      return await fetchJSON<Rocket>(`${API_BASE}/${id}`);
    } catch {
      const local = localRockets.value.find((r) => r.id === id);
      function sleep(ms: number) {
        return new Promise((r) => setTimeout(r, ms));
      }

      // check if exists in local rockets (recently added by user)
      if (local) {
        await sleep(200); // gimmick loading
        return local;
      }

      error.value = "Failed to fetch rocket detail";
      return null;
    } finally {
      loading.value = false;
    }
  }

  function addRocket(rocket: Rocket) {
    localRockets.value.unshift(rocket);
  }

  function setQueryFilter(
    payload: Record<string, string | number | boolean | null>
  ) {
    const query = { ...route.query };

    Object.entries(payload).forEach(([key, value]) => {
      if (value === null || value === "" || value === undefined) {
        delete query[key];
      } else {
        query[key] = String(value);
      }
    });

    router.replace({ query });
  }

  function resetFilters() {
    router.replace({ query: {} });
  }

  watch(
    localRockets,
    (val) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    },
    { deep: true }
  );

  return {
    // state
    loading,
    error,
    filters,

    // getters
    filteredRockets,
    allRockets,

    // data access
    fetchRockets,
    fetchRocketById,

    // mutations
    addRocket,

    // filter controls
    setQueryFilter,
    resetFilters,
  };
});
