import { defineStore } from "pinia";
import { ref } from "vue";

import { getRockets, getRocketById } from "@/services/rocket.service";
import type { Rocket } from "@/types/rocket";

export type RequestStatus = "idle" | "loading" | "success" | "error";

export const useRocketStore = defineStore("rocket", () => {
  const rockets = ref<Rocket[]>([]);
  const status = ref<RequestStatus>("idle");
  const error = ref<string | null>(null);

  const detailStatus = ref<RequestStatus>("idle");
  const detailError = ref<string | null>(null);

  async function fetchRockets() {
    status.value = "loading";
    error.value = null;

    try {
      const response = await getRockets();

      rockets.value = response.results;
      status.value = "success";
    } catch (err) {
      status.value = "error";

      error.value =
        err instanceof Error ? err.message : "Failed to load rockets.";
    }
  }

  function addRocket(rocket: Omit<Rocket, "id">) {
    const newRocket: Rocket = {
      ...rocket,
      id: `custom-${crypto.randomUUID()}`,
    };

    rockets.value.push(newRocket);
  }

  async function fetchRocketById(id: string): Promise<Rocket | null> {
    const existingRocket = rockets.value.find(
      (rocket) => String(rocket.id) === id,
    );

    if (existingRocket) {
      return existingRocket;
    }

    if (!/^\d+$/.test(id)) {
      return null;
    }

    detailStatus.value = "loading";
    detailError.value = null;

    try {
      const rocket = await getRocketById(id);

      detailStatus.value = "success";

      return rocket;
    } catch (err) {
      detailStatus.value = "error";

      detailError.value =
        err instanceof Error ? err.message : "Failed to load rocket.";

      return null;
    }
  }

  return {
    rockets,
    status,
    error,
    detailStatus,
    detailError,
    fetchRockets,
    addRocket,
    fetchRocketById,
  };
});
