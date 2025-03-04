import { defineStore } from "pinia";
import { ApiService } from "@/services/ApiService";
import type { Rocket, RocketParams, RocketPayload } from "@/types/rocket";
import { filteringData, getDataFromLocalStorage } from "@/utils/helper";
import { dummyImages } from "@/utils/constant";
import type { AxiosError } from "axios";

export const useRocket = defineStore("rocket", {
  state: () => ({
    data: [] as Rocket[],
    detail: null as Rocket | null,
    loading: false,
    error: "",
  }),
  actions: {
    async fetchRocket(params: RocketParams) {
      this.loading = true;
      this.error = "";
      try {
        const response = await ApiService<Rocket[]>({
          url: "/rockets",
          method: "GET",
        });
        let { data } = response;
        const localData: Rocket[] = getDataFromLocalStorage("data_rockets");
        data = [...localData, ...data];
        // Filtering locally because the API not support filter with query parameters https://docs.spacexdata.com/#5fcdb875-914f-4aef-a932-254397cf147a
        const filteredData = filteringData(data, params);
        this.data = filteredData;
      } catch (e) {
        const error = e as AxiosError;
        this.error = error?.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchRocketById(id: string) {
      this.loading = true;
      this.error = "";
      try {
        const rockets = getDataFromLocalStorage("data_rockets");
        const rocket = rockets?.find((item: Rocket) => item?.id === id);
        if (rocket) {
          this.detail = rocket;
          return rocket;
        }
        const response = await ApiService<Rocket>({
          url: `/rockets/${id}`,
          method: "GET",
        });
        const { data } = response;
        this.detail = response.data;
        return data;
      } catch (e) {
        const error = e as AxiosError;
        this.error = error?.message;
      } finally {
        this.loading = false;
      }
    },

    // Save to local storage because the API not support POST method https://docs.spacexdata.com/#5fcdb875-914f-4aef-a932-254397cf147a
    saveRockets(data: RocketPayload) {
      try {
        const rockets = getDataFromLocalStorage("data_rockets");
        rockets.push({
          ...data,
          id: Date.now().toString(),
          flickr_images: dummyImages,
        });
        localStorage.setItem("data_rockets", JSON.stringify(rockets));
        return data;
      } catch (err) {
        console.error("Failed to save rocket:", err);
      }
    },
  },
});
