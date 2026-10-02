import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { getRocket, getRockets } from "@/services/api";
import type { Result } from "@/types/rocket";

export const useRocketStore = defineStore("rockets", () => {
  const rockets = ref<Result[]>([]);
  const rocketsById = ref<Record<number, Result>>({});
  const selectedRocketId = ref<number | null>(null);

  const selectedRocket = computed(() =>
    selectedRocketId.value === null
      ? null
      : rocketsById.value[selectedRocketId.value] ?? null,
  );

  const listLoading = ref(false);
  const listError = ref("");
  const detailLoading = ref(false);
  const detailError = ref("");

  async function fetchRockets(force = false) {
    if (listLoading.value || (!force && rockets.value.length > 0)) return;

    listLoading.value = true;
    listError.value = "";

    try {
      rockets.value = await getRockets();

      rocketsById.value = {
        ...rocketsById.value,
        ...Object.fromEntries(
          rockets.value.map((rocket) => [rocket.id, rocket]),
        ),
      };
    } catch {
      listError.value = "Failed to load rockets";
    } finally {
      listLoading.value = false;
    }
  }

  function retryRockets() {
    return fetchRockets(true);
  }

  async function fetchRocket(id: number) {
    const validId = Number.isInteger(id) && id > 0;

    selectedRocketId.value = validId ? id : null;
    detailError.value = "";

    if (!validId) {
      detailLoading.value = false;
      detailError.value = "Rocket not found";
      return;
    }

    if (rocketsById.value[id]) {
      detailLoading.value = false;
      return;
    }

    detailLoading.value = true;

    try {
      const rocket = await getRocket(id);

      rocketsById.value = {
        ...rocketsById.value,
        [id]: rocket,
      };
    } catch {
      if (selectedRocketId.value === id) {
        detailError.value =
          "Unable to load this rocket. Please try again later.";
      }
    } finally {
      if (selectedRocketId.value === id) {
        detailLoading.value = false;
      }
    }
  }

  function addRocket(rocket: Omit<Result, "id">) {
    const id = Date.now();

    const newRocket: Result = {
      ...rocket,
      id,
    };

    rockets.value = [newRocket, ...rockets.value];

    rocketsById.value = {
      ...rocketsById.value,
      [id]: newRocket,
    };

    return newRocket;
  }

  return {
    rockets,
    selectedRocket,
    listLoading,
    listError,
    detailLoading,
    detailError,
    fetchRockets,
    retryRockets,
    fetchRocket,
    addRocket,
  };
});