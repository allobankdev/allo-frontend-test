import { create } from 'zustand';
import type { Rocket } from '../types/rocket';
import { fetchRocketList } from '../services/rocketApi';

interface RocketState {
  rockets: Rocket[];
  isLoading: boolean;
  error: string | null;
  fetchRockets: () => Promise<void>;
  addLocalRocket: (rocket: Rocket) => void;
}

export const useRocketStore = create<RocketState>((set) => ({
  rockets: [],
  isLoading: false,
  error: null,

  fetchRockets: async () => {
    set({ isLoading: true, error: null });
    try {
      const rockets = await fetchRocketList();
      set({ rockets, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      set({ error: message, isLoading: false });
    }
  },

  addLocalRocket: (rocket) => {
    set((state) => ({ rockets: [rocket, ...state.rockets] }));
  },
}));
