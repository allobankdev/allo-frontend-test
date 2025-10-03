import { defineStore } from "pinia";
import api from "@/config/api";
import type { Rocket } from "./model";

export const useRocketStore = defineStore("rocketStore", {
  state: () => {
    return {
      rocketData: [] as Rocket[],
      search: "" as string,
      country: "All Country" as string,
      company: "All Company" as string,
    };
  },
  actions: {
    async fetchAllRockets(): Promise<Rocket[]> {
      const { data } = await api.get(`/rockets`);
      return data;
    },
    async fetchDetailRocket(id: string): Promise<Rocket> {
      const { data } = await api.get(`/rockets/${id}`);
      return data;
    },
    setSearch(value: string) {
      this.search = value;
    },
    setCountry(value: string) {
      this.country = value;
    },
    setCompany(value: string) {
      this.company = value;
    },
    clearFilters() {
      this.country = "All Country";
      this.company = "All Company";
      this.search = "";
    },
  },
  getters: {
    filteredRockets: (state) => {
      return state.rocketData.filter((rocket) => {
        const matchesSearch =
          !state.search ||
          rocket.name.toLowerCase().includes(state.search.toLowerCase());

        const matchesCountry =
          state.country === "All Country" ||
          rocket.country.toLowerCase() === state.country.toLowerCase();

        const matchesCompany =
          state.company === "All Company" ||
          rocket.company.toLowerCase() === state.company.toLowerCase();

        return matchesSearch && matchesCountry && matchesCompany;
      });
    },
  },
});
