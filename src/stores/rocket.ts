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
    const active = ref<boolean | null>(null);
    const search = ref('');

    const filteredRockets = computed(() => {
      let result = rockets.value;

      if (active.value !== null) {
        result = result.filter(r => r.active === active.value);
      }

      if (search.value) {
        result = result.filter(r => r.name.toLowerCase().includes(search.value.toLowerCase()));
      }

      return result;
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

    function setFilter(value: boolean | null) {
      active.value = value;
    }

    return {
      rockets,
      isLoading,
      error,
      active,
      search,
      filteredRockets,
      fetchRockets,
      addRocket,
      setFilter,
    };
  },
  {
    persist: {
      pick: ['rockets', 'active', 'search'],
    },
  },
);
