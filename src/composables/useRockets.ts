import { useRocketsStore } from '@/stores/rockets';
import { computed, onMounted } from 'vue';

export function useRockets() {
  const rocketStore = useRocketsStore();

  const rockets = computed(() => rocketStore.rockets);
  const loading = computed(() => rocketStore.loading);
  const error = computed(() => rocketStore.error);
  const filter = computed(() => rocketStore.filter);

  const fetchRockets = () => rocketStore.fetchRockets();
  const setFilter = (filterValue: string) => rocketStore.setFilter(filterValue);

  onMounted(() => {
    if (rocketStore.rockets.length === 0) {
      fetchRockets();
    }
  });

  return {
    rockets,
    loading,
    error,
    filter,

    fetchRockets,
    setFilter,
    getRocketById: (id: string) => rocketStore.getRocketById(id),
    addRocket: rocketStore.addRocket
  };
}