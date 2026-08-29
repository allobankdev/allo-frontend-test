import { defineStore } from "pinia";
import { getRockets, getRocketById } from "@/api/base_api";
import type { Rocket } from "@/types/rocket";

const LOCAL_KEY = "local_rockets";

interface RocketState {
  rockets: Rocket[];
  localRockets: Rocket[];
  selectedRocket: Rocket | null;
  loading: boolean;
  error: string | null;
  filterText: string;
}

export const useRocketStore = defineStore("rocket", {
  state: (): RocketState => ({
    rockets: [],
    localRockets: JSON.parse(
      localStorage.getItem(LOCAL_KEY) ?? "[]"
    ) as Rocket[],
    selectedRocket: null,
    loading: false,
    error: null,
    filterText: "",
  }),

  getters: {
    allRockets(state): Rocket[] {
      return [...state.localRockets, ...state.rockets];
    },

    filteredRockets(): Rocket[] {
      const q = this.filterText.trim().toLowerCase();
      return this.allRockets.filter((r) =>
        r.name.toLowerCase().includes(q)
      );
    },
  },

  actions: {
    async fetchRockets(): Promise<void> {
      this.loading = true;
      this.error = null;

      try {
        const res = await getRockets();
        this.rockets = res.data;
      } catch {
        this.error = "Failed to load rockets";
      } finally {
        this.loading = false;
      }
    },

    async fetchRocketDetail(id: string): Promise<void> {
      this.loading = true;
      this.error = null;

      const local = this.localRockets.find((r) => r.id === id);
      if (local) {
        this.selectedRocket = local;
        this.loading = false;
        return;
      }

      try {
        const res = await getRocketById(id);
        this.selectedRocket = res.data;
      } catch {
        this.error = "Failed to load rocket detail";
      } finally {
        this.loading = false;
      }
    },

    addRocket(payload: Omit<Rocket, "id">): string {
      const id = `local-${crypto.randomUUID()}`;

      const newRocket: Rocket = {
        id,
        ...payload,
        isLocal: true,
      };

      this.localRockets.unshift(newRocket);

      localStorage.setItem(
        LOCAL_KEY,
        JSON.stringify(this.localRockets)
      );

      return id;
    },
    deleteRocket(id: string): void {
  this.localRockets = this.localRockets.filter(
    (r) => r.id !== id
  );

  localStorage.setItem(
    "local_rockets",
    JSON.stringify(this.localRockets)
  );

  if (this.selectedRocket?.id === id) {
    this.selectedRocket = null;
  }
},
    clearLocalRockets(): void {
      this.localRockets = [];
      localStorage.removeItem(LOCAL_KEY);
    },
  },
});
