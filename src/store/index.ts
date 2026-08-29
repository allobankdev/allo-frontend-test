import { defineStore } from "pinia";
import { ref } from "vue";
import { getRocketDetail, getRockets } from "@/services/index";
import type { RocketList } from "@/types";

export const useRocketStore = defineStore("rocket", () => {
  const rockets = ref<RocketList[]>([]);
  const rocket = ref<RocketList | null>(null);

  const loading = ref(false);
  const error = ref(false);

  const getLocalRockets = () => {
    const data = localStorage.getItem("local-rockets");
    return data ? JSON.parse(data) : [];
  };

  const setLocalRockets = (data: any[]) => {
    localStorage.setItem("local-rockets", JSON.stringify(data));
  };

  const fetchRockets = async () => {
    loading.value = true;
    error.value = false;

    try {
      const res = await getRockets();

      const localRockets = getLocalRockets();

      // console.log(localRockets, "ini local role");

      rockets.value = [...localRockets, ...res];
    } catch (err) {
      error.value = true;
    } finally {
      loading.value = false;
    }
  };

  const fetchRocketDetail = async (id: string) => {
    loading.value = true;
    error.value = false;

    try {
      const localRockets = getLocalRockets();

      const localRocket = localRockets.find(
        (rocket: RocketList) => rocket.id == id,
      );

      if (localRocket) {
        rocket.value = localRocket;
        return;
      }

      rocket.value = await getRocketDetail(id);
    } catch (err) {
      error.value = true;
    } finally {
      loading.value = false;
    }
  };

  const createRocket = (payload: any) => {
    const localRockets = getLocalRockets();

    const generateId = () => {
      return Math.floor(Math.random() * 1000000000);
    };

    const newRocket = {
      id: generateId(),
      ...payload,
    };

    localRockets.unshift(newRocket);

    setLocalRockets(localRockets);

    rockets.value.unshift(newRocket);
  };

  return {
    rockets,
    rocket,
    loading,
    error,
    fetchRockets,
    fetchRocketDetail,
    createRocket,
  };
});
