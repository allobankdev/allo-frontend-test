import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

interface Filter {
  search: string;
  limit: number;
}

export const useRocket = defineStore("rocket", () => {
  const rockets = ref<
    {
      id: number;
      image_url: string;
      full_name: string;
      description: string;
      launch_cost: string;
      manufacturer: {
        country_code: string;
      };
      maiden_flight: string;
    }[]
  >([]);

  const isLoadingRockets = ref(false);
  const isFetchRocketFailed = ref(false);

  const fetchRockets = async (
    filter: Filter = {
      limit: 20,
      search: "",
    },
  ) => {
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

      rockets.value = data.results;
    } catch (error) {
      isFetchRocketFailed.value = true;
    } finally {
      isLoadingRockets.value = false;
    }
  };

  return {
    rockets,
    fetchRockets,
    isLoadingRockets,
    isFetchRocketFailed,
  };
});
