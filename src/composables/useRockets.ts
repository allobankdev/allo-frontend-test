import { computed, ref } from "vue";
import { useRocketStore } from "../store/rocketStore";
import { RocketService } from "../services/rocket.service";
import type { Rocket } from "../types/rocket";

export function useRockets() {
  const store = useRocketStore();
  const searchQuery = ref("");

  const fetchRockets = async () => {
    // Avoid refetching when the list is already hydrated, including local rockets.
    if (store.rockets.length > 0) return;

    store.setLoading(true);
    store.setError(null);
    try {
      const response = await RocketService.getRockets();
      store.setRockets(response.results);
    } catch (err: unknown) {
      store.setError((err as Error).message || "Failed to fetch rockets");
    } finally {
      store.setLoading(false);
    }
  };

  const retryFetch = () => {
    store.setRockets([]);
    return fetchRockets();
  };

  const filteredRockets = computed(() => {
    let result = store.rockets;
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        (r) =>
          r.full_name?.toLowerCase().includes(query) ||
          r.name?.toLowerCase().includes(query),
      );
    }
    return result;
  });

  const addRocket = (rocket: Rocket) => {
    store.addRocket(rocket);
  };

  return {
    state: store,
    searchQuery,
    fetchRockets,
    retryFetch,
    filteredRockets,
    addRocket,
  };
}
