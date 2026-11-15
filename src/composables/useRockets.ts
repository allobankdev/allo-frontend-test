
import { ref, computed } from 'vue';
import type { Rocket } from '@/types/rocket';
import { getRockets } from '@/services/rocketService';

const STORAGE_KEY = 'local-rockets';

function getSavedRockets(): Rocket[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) as Rocket[] : [];
  } catch {
    return [];
  }
}

const localRockets = ref<Rocket[]>(getSavedRockets());
const rockets = ref<Rocket[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref('');

const filteredRockets = computed(() => {
  const query = String(searchQuery.value ?? '').toLowerCase().trim();

  if (!query) return rockets.value;

  return rockets.value.filter((rocket) =>
    `${rocket.full_name} ${rocket.description ?? ''}`
      .toLowerCase()
      .includes(query)
  );
});

async function loadRockets() {
  loading.value = true;
  error.value = null;

  try {
    const apiRockets = await getRockets();

    rockets.value = [
      ...localRockets.value,
      ...apiRockets.filter(
        (apiRocket) =>
          !localRockets.value.some(
            (localRocket) => localRocket.id === apiRocket.id
          )
      ),
    ];
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : 'Terjadi kesalahan';
  } finally {
    loading.value = false;
  }
}

function addRocket(rocket: Rocket) {
  const alreadyExists = rockets.value.some(
    (item) => item.id === rocket.id
  );

  if (alreadyExists) return;

  localRockets.value.unshift(rocket);
  rockets.value.unshift(rocket);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(localRockets.value)
  );
}

export function useRockets() {
  return {
    rockets,
    loading,
    error,
    searchQuery,
    filteredRockets,
    loadRockets,
    addRocket,
  };
}
