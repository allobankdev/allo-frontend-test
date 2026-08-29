import { defineStore } from "pinia";
import { ref } from "vue";
import { type Rocket } from "@/types/rockets";
import { api } from "@/lib/httpRequest";
export const useRocketsStore = defineStore("rockets", () => {
  const rockets = ref<Rocket[]>([]);
  const rocket = ref<Rocket | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchRockets = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await api.get<Rocket[]>("/rockets");
      rockets.value = res;
    } catch (err: any) {
      error.value = "Something went wrong";
    } finally {
      loading.value = false;
    }
  };

  const fetchRocketById = async (id: string) => {
    loading.value = true;
    try {
      const res = await api.get<Rocket>(`/rockets/${id}`);
      rocket.value = res;
    } catch (err: any) {
      error.value = err.message ?? "Unknown error";
    } finally {
      loading.value = false;
    }
  };

  const handleAddRocket = (payload: Rocket) => {
    rockets.value.push(payload);
  };

  return {
    rockets,
    loading,
    rocket,
    error,
    fetchRockets,
    fetchRocketById,
    handleAddRocket,
  };
});
