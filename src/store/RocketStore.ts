import { defineStore } from "pinia";
import axios from "axios";
import {ref} from "vue";
import type {RocketSchema} from "@/components/utils/RocketSchema";

export const useRocketStore = defineStore('rockets', () => {
  const URI = 'https://api.spacexdata.com/v4';
  const rockets = ref();
  const loading = ref(false);
  const success = ref(false);
  const error = ref(false);
  const api = ref(false);

  // Helper: delay function
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const fetchAllRockets = async () => {
    loading.value = true;
    try {
      await delay(3000); // ⏳ Simulate 3 seconds lag
      const response = await axios.get(`${URI}/rockets`);
      rockets.value = response.data;
    } catch (e) {
      console.error("Failed to fetch rockets:", e);
      error.value = true;
    } finally {
      loading.value = false;
      success.value = true;
      api.value = true;
    }
  };

  const addRocket = async (form: RocketSchema) => {
    if (!rockets.value) rockets.value = [];

    // Clone the form to prevent reactivity side effects
    const newRocket = JSON.parse(JSON.stringify(form));
    rockets.value.push(newRocket);

    success.value = true;
  }

  return { rockets, fetchAllRockets, loading, success, error, addRocket, api };
});
