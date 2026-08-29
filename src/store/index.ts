import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Rocket, NewRocketForm } from '../types';
import { spacexAPI } from '../api/spacex';

export const useRocketStore = defineStore('rocket', () => {
  // State
  const rockets = ref<Rocket[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const filterText = ref<string>('');

  // Getters (computed)
  const filteredRockets = computed<Rocket[]>(() => {
    if (!filterText.value.trim()) return rockets.value;
    
    const searchTerm = filterText.value.toLowerCase();
    return rockets.value.filter(rocket => 
      rocket.name.toLowerCase().includes(searchTerm) ||
      rocket.description.toLowerCase().includes(searchTerm)
    );
  });

  // Actions
  async function fetchRockets(): Promise<void> {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await spacexAPI.getRockets();
      rockets.value = data;
    } catch (err) {
      error.value = 'Failed to load rockets. Please try again.';
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  function addNewRocket(newRocket: NewRocketForm): void {
    const rocketWithId: Rocket = {
      id: `local-${Date.now()}`,
      name: newRocket.name,
      description: newRocket.description,
      flickr_images: [newRocket.imageUrl || 'https://via.placeholder.com/300x200'],
      country: newRocket.country || 'Unknown',
      cost_per_launch: parseInt(newRocket.costPerLaunch) || 0,
      first_flight: newRocket.firstFlight || new Date().toISOString().split('T')[0],
      active: false,
      stages: 2,
      boosters: 0,
      success_rate_pct: 0,
      type: 'rocket',
      company: 'User Added',
      height: { meters: 0, feet: 0 },
      diameter: { meters: 0, feet: 0 },
      mass: { kg: 0, lb: 0 },
      payload_weights: [],
      first_stage: {
        reusable: false,
        engines: 0,
        fuel_amount_tons: 0,
        burn_time_sec: 0,
        thrust_sea_level: { kN: 0, lbf: 0 },
        thrust_vacuum: { kN: 0, lbf: 0 }
      },
      second_stage: {
        reusable: false,
        engines: 0,
        fuel_amount_tons: 0,
        burn_time_sec: 0,
        thrust: { kN: 0, lbf: 0 }
      },
      engines: {
        number: 0,
        type: 'unknown',
        version: 'unknown',
        layout: 'unknown',
        engine_loss_max: 0,
        propellant_1: 'unknown',
        propellant_2: 'unknown',
        thrust_sea_level: { kN: 0, lbf: 0 },
        thrust_vacuum: { kN: 0, lbf: 0 },
        thrust_to_weight: 0
      },
      landing_legs: {
        number: 0,
        material: null
      },
      wikipedia: '',
      __typename: 'Rocket'
    } as Rocket;
    
    rockets.value.unshift(rocketWithId);
  }

  function setFilter(text: string): void {
    filterText.value = text;
  }

  return {
    // State
    rockets,
    loading,
    error,
    filterText,
    
    // Getters
    filteredRockets,
    
    // Actions
    fetchRockets,
    addNewRocket,
    setFilter
  };
});