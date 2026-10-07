import { ref } from 'vue';
import { RocketService } from '../services/rocket.service';
import type { Rocket } from '../types/rocket';

export function useRocketDetail() {
  const rocket = ref<Rocket | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchRocket = async (id: string | number) => {
    isLoading.value = true;
    error.value = null;
    rocket.value = null;
    try {
      const data = await RocketService.getRocketById(id);
      rocket.value = data;
    } catch (err: unknown) {
      error.value = (err as Error).message || 'Failed to fetch rocket detail';
    } finally {
      isLoading.value = false;
    }
  };

  return {
    rocket,
    isLoading,
    error,
    fetchRocket
  };
}
