import { computed, ref } from "vue";
import { defineStore } from "pinia";

import { getRockets } from "@/services/rocketApi";
import type { Rocket } from "@/types/rocket";

export type NewRocket = Omit<Rocket, "id" | "isLocal">;

export const useRocketStore = defineStore("rocket", () => {
  const apiRockets = ref<Rocket[]>([]);
  const localRockets = ref<Rocket[]>([]);
  const searchQuery = ref<string | null>("");
  const loading = ref(false);
  const error = ref<string | null>(null);
  const hasLoaded = ref(false);

  const rockets = computed(() => [...localRockets.value, ...apiRockets.value]);

  const filteredRockets = computed(() => {
    const query = (searchQuery.value ?? "").trim().toLowerCase();

    if (!query) {
      return rockets.value;
    }

    return rockets.value.filter((rocket) => {
      const searchableValues = [
        rocket.full_name,
        rocket.description,
        rocket.manufacturer?.country_code,
      ];

      return searchableValues.some((value) =>
        value?.toLowerCase().includes(query),
      );
    });
  });

  async function fetchRockets(force = false): Promise<void> {
    if (hasLoaded.value && !force) {
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await getRockets();
      apiRockets.value = response.results;
      hasLoaded.value = true;
    } catch (exception) {
      error.value =
        exception instanceof Error
          ? exception.message
          : "Unable to load rockets";
    } finally {
      loading.value = false;
    }
  }

  function retry(): Promise<void> {
    return fetchRockets(true);
  }

  function addRocket(rocket: NewRocket): void {
    localRockets.value.unshift({
      ...rocket,
      id: `local-${crypto.randomUUID()}`,
      isLocal: true,
    });
  }

  function findRocketById(id: string): Rocket | undefined {
    return rockets.value.find((rocket) => String(rocket.id) === id);
  }

  return {
    rockets,
    filteredRockets,
    searchQuery,
    loading,
    error,
    hasLoaded,
    fetchRockets,
    retry,
    addRocket,
    findRocketById,
  };
});
