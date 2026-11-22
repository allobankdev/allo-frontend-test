import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Rocket } from '@/types/rocket';
import { getRockets } from '@/services/rocketService';

export const useRocketStore = defineStore('rocket', () => {
  const rockets = ref<Rocket[]>([]);
  const loading = ref(false);
  const error = ref('');

  const fetchRockets = async () => {
    if (rockets.value.length > 0) return;

    loading.value = true;
    error.value = '';

    try {
      rockets.value = await getRockets();
    } catch {
      error.value = 'Failed to load rockets. Please try again.';
    } finally {
      loading.value = false;
    }
  };

  const addRocket = (rocket: Rocket) => {
    rockets.value.unshift(rocket);
  };

  return {
    rockets,
    loading,
    error,
    fetchRockets,
    addRocket,
  };
});
