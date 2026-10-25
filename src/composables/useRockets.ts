import { computed, ref } from "vue";
import type { Rocket } from "@/types/rocket";
import { getRockets } from "@/services/rocketService";

const rockets = ref<Rocket[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const loaded = ref(false);

let requestId = 0;

export function useRockets() {
  const rocketCount = computed(() => rockets.value.length);

  async function loadRockets(force = false): Promise<void> {
    if (loading.value) return;
    if (loaded.value && !force) return;

    const currentRequest = ++requestId;

    loading.value = true;
    error.value = null;

    try {
      const result = await getRockets();

      if (currentRequest !== requestId) return;

      rockets.value = result;
      loaded.value = true;
    } catch (err: unknown) {
      if (currentRequest !== requestId) return;

      error.value =
        err instanceof Error
          ? err.message
          : "Unable to load rockets. Please try again.";
    } finally {
      if (currentRequest === requestId) {
        loading.value = false;
      }
    }
  }

  function addRocket(rocket: Rocket): void {
    rockets.value = [rocket, ...rockets.value];
  }

  function findRocket(id: number | string): Rocket | undefined {
    return rockets.value.find((rocket) => String(rocket.id) === String(id));
  }

  return {
    rockets,
    rocketCount,
    loading,
    error,
    loaded,
    loadRockets,
    addRocket,
    findRocket,
  };
}
