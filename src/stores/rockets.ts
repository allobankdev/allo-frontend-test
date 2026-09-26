import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { fetchRocketsFromApi } from "@/fetches/rockets";
import type { Rocket } from "@/types/rocket";
import type { Status } from "@/types/status";

type NewRocketInput = Omit<Rocket, "id" | "isLocal">;

export const useRocketsStore = defineStore("rockets", () => {
  const status = ref<Status>("loading");
  const rockets = ref<Rocket[]>([]);
  const error = ref<string | null>(null);
  const filterText = ref("");

  let nextLocalId = 1;
  let activeController: AbortController | null = null;
  let hasStarted = false;

  const filteredRockets = computed(() => {
    const query = filterText.value.trim().toLowerCase();
    if (!query) return rockets.value;
    return rockets.value.filter((rocket) =>
      (rocket.name || "").toLowerCase().includes(query),
    );
  });

  async function loadRockets() {
    activeController?.abort();
    const controller = new AbortController();
    activeController = controller;

    status.value = "loading";
    error.value = null;

    try {
      const apiRockets = await fetchRocketsFromApi({ signal: controller.signal });
      if (controller.signal.aborted) return;

      const localRockets = rockets.value.filter((rocket) => rocket.isLocal);
      rockets.value = [...localRockets, ...apiRockets];
      status.value = "success";
    } catch (err) {
      if (controller.signal.aborted) return;
      status.value = "error";
      error.value = err instanceof Error ? err.message : "Something went wrong.";
    }
  }

  function ensureLoaded() {
    if (hasStarted) return;
    hasStarted = true;
    void loadRockets();
  }

  function retry() {
    void loadRockets();
  }

  function addRocket(input: NewRocketInput): Rocket {
    const rocket: Rocket = {
      id: `local-${nextLocalId++}`,
      isLocal: true,
      ...input,
    };
    rockets.value = [rocket, ...rockets.value];
    return rocket;
  }

  function setFilterText(text: string) {
    filterText.value = text ?? "";
  }

  function findRocketById(id: string): Rocket | null {
    return rockets.value.find((rocket) => rocket.id === id) ?? null;
  }

  return {
    status,
    rockets,
    error,
    filterText,
    filteredRockets,
    ensureLoaded,
    retry,
    addRocket,
    setFilterText,
    findRocketById,
  };
});
