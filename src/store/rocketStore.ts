import { defineStore } from "pinia";
import type { Rocket } from "../types/rocket";

const LOCAL_ROCKETS_KEY = "rocket-archive:custom-rockets";

const getLocalRockets = (): Rocket[] => {
  if (typeof window === "undefined") return [];

  try {
    const storedRockets = window.localStorage.getItem(LOCAL_ROCKETS_KEY);
    return storedRockets ? (JSON.parse(storedRockets) as Rocket[]) : [];
  } catch {
    return [];
  }
};

const saveLocalRockets = (rockets: Rocket[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_ROCKETS_KEY, JSON.stringify(rockets));
};

export const useRocketStore = defineStore("rockets", {
  state: () => ({
    rockets: [] as Rocket[],
    isLoading: false,
    error: null as string | null,
  }),
  actions: {
    setRockets(data: Rocket[]) {
      this.rockets = [...getLocalRockets(), ...data];
    },
    setLoading(loading: boolean) {
      this.isLoading = loading;
    },
    setError(err: string | null) {
      this.error = err;
    },
    addRocket(rocket: Rocket) {
      const localRockets = [rocket, ...getLocalRockets()];
      saveLocalRockets(localRockets);
      this.rockets.unshift(rocket);
    },
    getLocalRocket(id: string | number) {
      return getLocalRockets().find(
        (rocket) => rocket.id.toString() === id.toString(),
      );
    },
  },
});
