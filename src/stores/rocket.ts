import axios from "axios";
import { defineStore } from "pinia";
import { computed, nextTick, reactive, ref } from "vue";

export interface Rocket {
  id: number | string;
  image_url: string;
  full_name: string;
  description: string;
  launch_cost: string;
  manufacturer: {
    country_code: string;
  };
  maiden_flight: string;
}

interface Filter {
  search: string;
  limit: number;
}

export const useRocket = defineStore("rocket", () => {
  const filter: Filter = reactive({
    limit: 20,
    search: "",
  });
  const apiRockets = ref<Rocket[]>([]);
  const localRockets = ref<Rocket[]>([]);
  const rockets = computed(() => {
    const search = filter.search.trim().toLowerCase();
    const filteredLocalRockets = localRockets.value.filter((rocket) =>
      rocket.full_name.toLowerCase().includes(search),
    );

    return [...filteredLocalRockets, ...apiRockets.value];
  });

  const isLoadingRockets = ref(false);
  const isFetchRocketFailed = ref(false);

  const addNewRocket = async (rocket: Rocket) => {
    localRockets.value = [{ ...rocket }, ...localRockets.value];

    await nextTick();
  };

  const fetchRockets = async () => {
    if (isLoadingRockets.value) return;

    isFetchRocketFailed.value = false;
    isLoadingRockets.value = true;

    try {
      const { data } = await axios.get(
        `https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed`,
        {
          params: filter,
        },
      );

      apiRockets.value = data.results;
    } catch (error) {
      isFetchRocketFailed.value = true;
    } finally {
      isLoadingRockets.value = false;
    }
  };

  const findRocketById = (id: string) => {
    return [...localRockets.value, ...apiRockets.value].find(
      (rocket) => String(rocket.id) === id,
    );
  };

  const fetchRocketById = async (id: string) => {
    if (id.includes("local-")) {
      const localRocket = findRocketById(id);
      if (localRocket) return localRocket;
    }

    const { data } = await axios.get(
      `https://lldev.thespacedevs.com/2.2.0/config/launcher/${id}/`,
      {
        params: {
          mode: "detailed",
        },
      },
    );

    return data as Rocket;
  };

  return {
    rockets,
    fetchRockets,
    addNewRocket,
    findRocketById,
    fetchRocketById,
    isLoadingRockets,
    isFetchRocketFailed,
    filter,
  };
});
