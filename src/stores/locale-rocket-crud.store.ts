import { defineStore } from "pinia";
import { RocketSchema } from "@/schema/rocket.schema";
import type { Rocket } from "@/schema/rocket.schema";

const LOCAL_STORAGE_KEY = "local-rocket";

export const useLocalRocketCrudStore = defineStore("rocket-crud", {
  state: () => ({
    rockets: [] as Rocket[],
    currentRocket: undefined as Rocket | undefined,
    creating: false,
    updating: false,
    deleting: false,
    error: null as string | null,
  }),

  actions: {
    async createRocket(payload: Rocket): Promise<Rocket> {
      this.creating = true;
      this.error = null;

      try {
        const newRocket: Rocket = {
          ...payload,
          id: crypto.randomUUID(),
        };

        this._store(newRocket);
        return newRocket;
      } catch (e) {
        this.error = "Failed to create rocket";
        throw e;
      } finally {
        this.creating = false;
      }
    },

    async updateRocket(id: string, payload: Partial<Rocket>): Promise<Rocket> {
      this.updating = true;
      this.error = null;

      try {
        const rockets = this._getAll();
        const index = rockets.findIndex((x) => x.id === id);

        if (index === -1) {
          throw new Error("Rocket not found");
        }

        const updatedRocket: Rocket = {
          ...rockets[index],
          ...payload,
          id,
        };

        rockets[index] = updatedRocket;
        this._set(rockets);

        return updatedRocket;
      } catch (e) {
        this.error = "Failed to update rocket";
        throw e;
      } finally {
        this.updating = false;
      }
    },

    async deleteRocket(id: string): Promise<string> {
      this.deleting = true;
      this.error = null;

      try {
        const rockets = this._getAll().filter((x) => x.id !== id);
        this._set(rockets);
        return id;
      } catch (e) {
        this.error = "Failed to delete rocket";
        throw e;
      } finally {
        this.deleting = false;
      }
    },

    getById(id: string): Rocket | undefined {
        this.currentRocket = this._getAll().find((x) => x.id === id);
      return this.currentRocket;
    },

    findAll(search = ""): Rocket[] {
      let rockets = this._getAll();

      this.rockets = rockets;

      if (search !== "") {
        rockets = rockets.filter((x) =>
          x.name?.toLowerCase().includes(search.toLowerCase()),
        );
      }

      this.rockets = rockets;

      return rockets;
    },

    _store(rocket: Rocket) {
      const rockets = this._getAll().filter((x) => x.id !== rocket.id);
      rockets.push(rocket);
      this._set(rockets);
    },

    _set(rockets: Rocket[]) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rockets));
    },

    _getAll(): Rocket[] {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        return RocketSchema.array().parse(parsed);
      } catch (error) {
        console.error("Failed to parse rockets from localStorage", error);
        return [];
      }
    },
  },
});
