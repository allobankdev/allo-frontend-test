import { ref, computed } from 'vue';
import type { Rocket } from '@/types/rocket';
import { fetchRockets, fetchRocketById } from '@/services/rocketApi';

const rockets = ref<Rocket[]>([]);
const customRockets = ref<Rocket[]>([]);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

const selectedRocket = ref<Rocket | null>(null);
const detailLoading = ref<boolean>(false);
const detailError = ref<string | null>(null);

const searchQuery = ref<string>('');
const selectedCountry = ref<string>('');
const sortBy = ref<'name' | 'flight' | 'cost'>('name');
const sortOrder = ref<'asc' | 'desc'>('asc');

export function useRockets() {
  const allRockets = computed<Rocket[]>(() => {
    return [...customRockets.value, ...rockets.value];
  });

  const availableCountries = computed<string[]>(() => {
    const countries = new Set<string>();
    allRockets.value.forEach(r => {
      if (r.manufacturer?.country_code) {
        countries.add(r.manufacturer.country_code);
      }
    });
    return Array.from(countries).sort();
  });

  const filteredRockets = computed<Rocket[]>(() => {
    let result = [...allRockets.value];

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      result = result.filter(r => {
        const nameMatch = r.full_name?.toLowerCase().includes(q) || false;
        const descMatch = r.description?.toLowerCase().includes(q) || false;
        const familyMatch = r.family?.toLowerCase().includes(q) || false;
        return nameMatch || descMatch || familyMatch;
      });
    }

    if (selectedCountry.value) {
      result = result.filter(r => r.manufacturer?.country_code === selectedCountry.value);
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy.value === 'name') {
        const nameA = a.full_name || '';
        const nameB = b.full_name || '';
        comparison = nameA.localeCompare(nameB);
      } else if (sortBy.value === 'flight') {
        const dateA = a.maiden_flight ? new Date(a.maiden_flight).getTime() : 0;
        const dateB = b.maiden_flight ? new Date(b.maiden_flight).getTime() : 0;
        comparison = dateA - dateB;
      } else if (sortBy.value === 'cost') {
        const costA = typeof a.launch_cost === 'number' ? a.launch_cost : (parseFloat(String(a.launch_cost)) || 0);
        const costB = typeof b.launch_cost === 'number' ? b.launch_cost : (parseFloat(String(b.launch_cost)) || 0);
        comparison = costA - costB;
      }
      return sortOrder.value === 'asc' ? comparison : -comparison;
    });

    return result;
  });

  async function loadRockets(force = false) {
    if (rockets.value.length > 0 && !force) {
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const data = await fetchRockets();
      rockets.value = data;
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Unknown error occurred while fetching rockets.';
    } finally {
      loading.value = false;
    }
  }

  async function loadRocketDetail(id: string | number) {
    const existingCustom = customRockets.value.find(r => String(r.id) === String(id));
    if (existingCustom) {
      selectedRocket.value = existingCustom;
      detailLoading.value = false;
      detailError.value = null;
      return;
    }

    const existingApiRocket = rockets.value.find(r => String(r.id) === String(id));
    if (existingApiRocket && existingApiRocket.description && existingApiRocket.launch_cost !== undefined) {
      selectedRocket.value = existingApiRocket;
    }

    detailLoading.value = true;
    detailError.value = null;

    try {
      const data = await fetchRocketById(id);
      selectedRocket.value = data;
    } catch (err: unknown) {
      if (!selectedRocket.value) {
        detailError.value = err instanceof Error ? err.message : 'Failed to load rocket details.';
      }
    } finally {
      detailLoading.value = false;
    }
  }

  function addCustomRocket(newRocket: Omit<Rocket, 'id'>) {
    const generatedId = `custom-${Date.now()}`;
    const rocket: Rocket = {
      ...newRocket,
      id: generatedId,
      is_custom: true,
    };
    customRockets.value.unshift(rocket);
  }

  function resetFilters() {
    searchQuery.value = '';
    selectedCountry.value = '';
    sortBy.value = 'name';
    sortOrder.value = 'asc';
  }

  return {
    rockets,
    customRockets,
    allRockets,
    filteredRockets,
    availableCountries,
    loading,
    error,
    selectedRocket,
    detailLoading,
    detailError,
    searchQuery,
    selectedCountry,
    sortBy,
    sortOrder,
    loadRockets,
    loadRocketDetail,
    addCustomRocket,
    resetFilters,
  };
}
