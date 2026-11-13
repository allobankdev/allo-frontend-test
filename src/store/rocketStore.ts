import { defineStore } from "pinia";
import type { RocketCreate, RocketResults } from "@/types/rocket";
import { getErrorMessage } from "@/utils/ApiErrorHandler";
import { rocketService } from "@/service/rocketService";

export const useRocketStore = defineStore("rocketStore", {
  state: () => ({
    rockets: [] as RocketResults[],
    localRockets: [] as RocketResults[],
    rocket: null as RocketResults | null,
    searchQuery: "",
    loading: false,

    listError: null as string | null,
    detailError: null as string | null,
  }),
  getters: {
    allRockets: (state) => {
      return [...state.localRockets, ...state.rockets];
    },
    filteredRockets: (state) => {
      const query = state.searchQuery.trim().toLowerCase();
      const rockets = [...state.localRockets, ...state.rockets];

      if (!query) {
        return rockets;
      }

      return rockets.filter((rocket) =>
        [rocket.name, rocket.full_name, rocket.description].some((value) =>
          value?.toLowerCase().includes(query),
        ),
      );
    },
  },
  actions: {
    addNewRocket(input: RocketCreate) {
      const countryCode = input?.country_code?.trim().toUpperCase();

      if (!countryCode) {
        throw new Error("Manufacturer country code is required");
      }

      const newRocket: RocketResults = {
        id: Date.now(),
        url: "",
        name: input.full_name,
        active: true,
        reusable: false,
        description: input.description || null,
        family: null,
        full_name: input.full_name,
        manufacturer: {
          id: -Date.now(),
          url: "",
          name: "Local manufacturer",
          featured: false,
          type: null,
          country_code: countryCode,
          abbrev: null,
          description: null,
          administrator: null,
          founding_year: null,
          launchers: null,
          spacecraft: null,
          launch_library_url: null,
          total_launch_count: null,
          consecutive_succesful_launches: null,
          successful_launches: null,
          failed_launches: null,
          pending_launches: null,
          consecutive_successful_landings: null,
          successful_landings: null,
          failed_landings: null,
          attempted_landings: null,
          info_url: null,
          wiki_url: null,
          logo_url: null,
          image_url: null,
          nation_url: null,
        },
        program: [],
        variant: null,
        alias: null,
        min_stage: null,
        max_stage: null,
        length: null,
        diameter: null,
        maiden_flight: input.maiden_flight ? String(input.maiden_flight) : null,
        launch_cost:
          input.launch_cost === null ? null : String(input.launch_cost),
        launch_mass: null,
        leo_capacity: null,
        gto_capacity: null,
        to_thrust: null,
        apogee: null,
        vehicle_range: null,
        image_url: input.image_url || null,
        info_url: null,
        wiki_url: null,
        total_launch_count: null,
        consecutive_successful_launches: null,
        successful_launches: null,
        failed_launches: null,
        pending_launches: null,
        attempted_landings: null,
        successful_landings: null,
        failed_landings: null,
        consecutive_successful_landings: null,
      };

      this.localRockets.unshift(newRocket);
    },
    async getRockets(manufacturerName: string | null) {
      try {
        this.loading = true;
        this.listError = null;

        const response = await rocketService.getRocketList(manufacturerName);
        this.rockets = response;
      } catch (error) {
        this.listError = getErrorMessage(error);
      } finally {
        this.loading = false;
      }
    },
    async getRocket(id: number) {
      try {
        this.loading = true;
        this.detailError = null;

        const response = await rocketService.getRocketDetail(id);
        this.rocket = response;
      } catch (error) {
        this.detailError = getErrorMessage(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
