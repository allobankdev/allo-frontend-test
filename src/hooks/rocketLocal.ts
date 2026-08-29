import { ref, computed } from "vue";
import type { IRocket } from "@/types/rocket";
import { getRocketById, getRockets } from "@/api/rockets.api";

const LOCAL_KEY = "custom-rockets";

const rockets = ref<IRocket[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const loadLocal = (): IRocket[] =>
  JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");

const saveLocal = (data: IRocket[]) =>
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data));

export function useRockets() {
  const fetchRockets = async () => {
    loading.value = true;
    error.value = null;

    try {
      const apiData = await getRockets();
      rockets.value = [...loadLocal(), ...apiData];
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  const getRocket = async (id: string): Promise<IRocket> => {
    if (id.startsWith("local-")) {
      const local = loadLocal().find((r) => r.id === id);
      if (!local) throw new Error("Local rocket not found");
      return local;
    }
    return getRocketById(id);
  };

const addRocket = (payload: any) => {
  const newRocket: IRocket = {
    id: `local-${Date.now()}`,
    name: payload.name,
    description: payload.description,
    country: payload.country || '-',
    first_flight: payload.first_flight || '-',
    cost_per_launch: payload.cost_per_launch || 0,
    flickr_images: [
      payload.imageBase64 || 'https://via.placeholder.com/600x400'
    ],
    active: true,
    height: { meters: 0 },
    mass: { kg: 0 },
    engines: { number: 0, type: '-' },
    success_rate_pct: 0,
    payload_weights: [],
  }

  const locals = loadLocal()
  locals.unshift(newRocket)
  saveLocal(locals)

  rockets.value.unshift(newRocket)
};

  return {
    rockets,
    loading,
    error,
    fetchRockets,
    getRocket,
    addRocket,
  };
}
