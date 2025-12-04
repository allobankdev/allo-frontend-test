import { ref } from 'vue';

export interface FilterOptions {
  search: string;
  country: string;
}

export function useFilter(initialState: FilterOptions = { search: '', country: '' }) {
  const searchQuery = ref(initialState.search);
  const selectedCountry = ref(initialState.country);
  const debounceTimeout = ref<number>();

  const reset = () => {
    searchQuery.value = '';
    selectedCountry.value = '';
  };

  // Debounce the emit to prevent too many updates
  const debounceEmit = (emitFn: (filters: FilterOptions) => void) => {
    if (debounceTimeout.value) {
      clearTimeout(debounceTimeout.value);
    }
    debounceTimeout.value = setTimeout(() => {
      emitFn({
        search: searchQuery.value,
        country: selectedCountry.value,
      });
    }, 300) as unknown as number;
  };

  return {
    searchQuery,
    selectedCountry,
    reset,
    debounceEmit,
  };
}

export type UseFilterReturn = ReturnType<typeof useFilter>;
