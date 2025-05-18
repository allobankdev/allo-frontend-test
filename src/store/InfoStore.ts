import { defineStore } from "pinia";
import axios from "axios";
import {ref} from "vue";

export const useInfoStore = defineStore('info', () => {
  const URI = 'https://api.spacexdata.com/v4';
  const info = ref();
  const loading = ref(false);
  const success = ref(false);
  const error = ref(false);

  // Helper: delay function
  // const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const fetchInfo = async () => {
    loading.value = true;
    try {
      // await delay(3000); // Simulate 3 seconds lag
      const response = await axios.get(`${URI}/company`);
      info.value = response.data;
    } catch (e) {
      console.error("Failed to fetch info:", e);
      error.value = true;
    } finally {
      loading.value = false;
      success.value = true;
    }
  };

  return { info, fetchInfo, loading, success, error };
});
