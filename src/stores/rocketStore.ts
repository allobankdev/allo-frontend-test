import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import type { Rocket, FilterOptions, NewRocketData } from '@/types/rocket';

export const useRocketStore = defineStore('rocket', () => {
  // State
  const rockets = ref<Rocket[]>([]);
  const filteredRockets = ref<Rocket[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const filterOptions = ref<FilterOptions>({
    active: null,
    country: '',
    successRate: 0
  });

  // Getters
  const countries = computed(() => {
    return [...new Set(rockets.value.map(rocket => rocket.country))];
  });

  const totalCostPerLaunch = computed(() => {
    return rockets.value.reduce((total, rocket) => total + rocket.cost_per_launch, 0);
  });

  const totalSuccessRate = computed(() => {
    if (rockets.value.length === 0) return 0;
    const sum = rockets.value.reduce((total, rocket) => total + rocket.success_rate_pct, 0);
    return sum / rockets.value.length;
  });

  // Actions
  const fetchRockets = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const response = await axios.get('https://api.spacexdata.com/v4/rockets');
      rockets.value = response.data;
      filteredRockets.value = response.data;
    } catch (err) {
      error.value = 'Failed to fetch rockets. Please try again.';
      console.error('Error fetching rockets:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const filterRockets = () => {
    let filtered = [...rockets.value];

    if (filterOptions.value.active !== null) {
      filtered = filtered.filter(rocket => rocket.active === filterOptions.value.active);
    }

    if (filterOptions.value.country) {
      filtered = filtered.filter(rocket => 
        rocket.country.toLowerCase().includes(filterOptions.value.country.toLowerCase())
      );
    }

    if (filterOptions.value.successRate > 0) {
      filtered = filtered.filter(rocket => 
        rocket.success_rate_pct >= filterOptions.value.successRate
      );
    }

    filteredRockets.value = filtered;
  };

  const addRocket = (newRocketData: NewRocketData) => {
    const newRocket: Rocket = {
      id: `custom-${Date.now()}`,
      name: newRocketData.name,
      type: 'custom',
      active: true,
      stages: 2,
      boosters: 0,
      cost_per_launch: newRocketData.cost_per_launch,
      success_rate_pct: 0,
      first_flight: new Date().toISOString().split('T')[0],
      country: newRocketData.country,
      company: 'Custom',
      wikipedia: '',
      description: newRocketData.description,
      flickr_images: newRocketData.flickr_images.length > 0 
        ? newRocketData.flickr_images 
        : ['https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800&auto=format&fit=crop']
    };

    rockets.value.unshift(newRocket);
    filterRockets();
  };

  const getRocketById = (id: string) => {
    return rockets.value.find(rocket => rocket.id === id);
  };

  const resetFilters = () => {
    filterOptions.value = {
      active: null,
      country: '',
      successRate: 0
    };
    filteredRockets.value = [...rockets.value];
  };

  return {
    // State
    rockets,
    filteredRockets,
    isLoading,
    error,
    filterOptions,
    
    // Getters
    countries,
    totalCostPerLaunch,
    totalSuccessRate,
    
    // Actions
    fetchRockets,
    filterRockets,
    addRocket,
    getRocketById,
    resetFilters
  };
});