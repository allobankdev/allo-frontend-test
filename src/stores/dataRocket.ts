import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

export const dataRocket = defineStore( 'rockets', () => {
  const data = ref([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchData = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get(import.meta.env.VITE_BASE_URL + "rockets");
      data.value = response.data;
    } catch (err) {
      error.value = "Error, Coba lagi...";
      console.error(error.value);
    } finally {
      loading.value = false;
    }
  };

  return { data, loading, error, fetchData };
});
