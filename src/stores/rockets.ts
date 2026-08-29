import type { PayloadWeight, Rocket, RocketPayload } from "@/types/rockets";
import { defineStore } from "pinia";

const createDefaultNestedObject = () => ({
  meters: 0,
  feet: 0,
});

const createDefaultPayloadWeight = (
  id: string,
  name: string
): PayloadWeight => ({
  id,
  name,
  kg: 0,
  lb: 0,
});

export const useRocketStore = defineStore("rocket", {
  state: () => ({
    rockets: [] as Rocket[],
    filteredRockets: [] as Rocket[],
  }),

  getters: {
    getRocketById: (state) => (id: string | string[]) => {
      return state.rockets.find((rocket) => rocket.id === id);
    },
  },

  actions: {
    addRocket(rocket: RocketPayload) {
      const newId =
        Date.now().toString() + Math.random().toString(36).substring(2, 9);
      const newRocket: Rocket = {
        ...rocket,
        id: newId,
        cost_per_launch: Number(rocket.cost_per_launch),
        active: rocket.active ?? true,
        type: "Unknown",
        stages: 1,
        boosters: 0,
        success_rate_pct: 0,
        wikipedia: "",
        flickr_images: rocket.image ? [rocket.image] : [], // Memetakan 'image'
        company: "DIY",

        // --- OBJEK BERSARANG DENGAN NILAI DEFAULT AMAN ---
        height: createDefaultNestedObject(),
        diameter: createDefaultNestedObject(),
        mass: { kg: 0, lb: 0 },
        payload_weights: [
          createDefaultPayloadWeight(newId + "_pl", "Placeholder Payload"),
        ],

        first_stage: {
          reusable: false,
          engines: 0,
          fuel_amount_tons: 0,
          burn_time_sec: 0,
          thrust_sea_level: { kN: 0, lbf: 0 },
          thrust_vacuum: { kN: 0, lbf: 0 },
        },
        second_stage: {
          reusable: false,
          engines: 0,
          fuel_amount_tons: 0,
          burn_time_sec: 0,
          thrust: { kN: 0, lbf: 0 },
          payloads: {
            option_1: "Unknown",
            composite_fairing: {
              height: createDefaultNestedObject(),
              diameter: createDefaultNestedObject(),
            },
          },
        },
        engines: {
          number: 0,
          type: "None",
          version: "1.0",
          layout: "None",
          isp: { sea_level: 0, vacuum: 0 },
          engine_loss_max: 0,
          propellant_1: "None",
          propellant_2: "None",
          thrust_sea_level: { kN: 0, lbf: 0 },
          thrust_vacuum: { kN: 0, lbf: 0 },
          thrust_to_weight: 0,
        },
        landing_legs: {
          number: 0,
          material: "None",
        },
      };

      this.rockets = [...this.rockets, newRocket];
    },

    setRockets(fetchedRockets: Rocket[]) {
      this.rockets = fetchedRockets;
    },

    setFilteredRockets(filtered: Rocket[]) {
      this.filteredRockets = filtered;
    },
  },
});
