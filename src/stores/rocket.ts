import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Rocket } from '@/types';
import api from '@/services/api';

export const useRocketStore = defineStore(
  'rocket',
  () => {
    const rockets = ref<Rocket[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);
    const filterActive = ref<boolean | null>(null);

    const filteredRockets = computed(() => {
      if (filterActive.value === null) return rockets.value;
      return rockets.value.filter(r => r.active === filterActive.value);
    });

    async function fetchRockets(force?: boolean) {
      if (!force && rockets.value.length > 0) return;

      isLoading.value = true;
      error.value = null;

      try {
        rockets.value = await api<Rocket[]>('rockets').json();
      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Failed to fetch rockets';
      } finally {
        isLoading.value = false;
      }
    }

    function addRocket(rocket: Rocket) {
      rockets.value.push(rocket);
    }

    function setFilter(active: boolean | null) {
      filterActive.value = active;
    }

    return {
      rockets,
      isLoading,
      error,
      filterActive,
      filteredRockets,
      fetchRockets,
      addRocket,
      setFilter,
    };
  },
  {
    persist: {
      pick: ['rockets', 'filterActive'],
    },
  },
);
