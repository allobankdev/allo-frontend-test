import { ref } from "vue";
import type {
  Rocket,
  RocketListResponse,
  NewRocketInput,
} from "@/types/rocket";

const LIST_URL =
  "https://lldev.thespacedevs.com/2.2.0/config/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20";

// Module-level state -> shared across every component that calls useRockets()
const rockets = ref<Rocket[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const hasFetchedOnce = ref(false);

async function fetchRockets() {
  loading.value = true;
  error.value = null;
  try {
    const res = await fetch(LIST_URL);
    if (!res.ok) {
      throw new Error(`Failed to fetch rockets (status ${res.status})`);
    }
    const data: RocketListResponse = await res.json();
    rockets.value = data.results;
    hasFetchedOnce.value = true;
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : "Something went wrong while fetching rockets";
  } finally {
    loading.value = false;
  }
}

function addRocket(input: NewRocketInput) {
  const localRocket: Rocket = {
    id: `local-${Date.now()}`,
    name: input.full_name,
    full_name: input.full_name,
    description: input.description,
    image_url: input.image_url,
    launch_cost: input.launch_cost,
    maiden_flight: input.maiden_flight,
    manufacturer: {
      id: -1,
      name: "Custom",
      country_code: input.country_code,
    },
    isLocal: true,
  };
  // Newest first so the user sees what they just added
  rockets.value = [localRocket, ...rockets.value];
}

function getRocketById(id: string): Rocket | undefined {
  return rockets.value.find((r) => String(r.id) === id);
}

async function fetchRocketById(id: string): Promise<Rocket> {
  const res = await fetch(
    `https://lldev.thespacedevs.com/2.2.0/config/launcher/${id}/?mode=detailed`,
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch rocket detail (status ${res.status})`);
  }
  return res.json();
}

export function useRockets() {
  return {
    rockets,
    loading,
    error,
    hasFetchedOnce,
    fetchRockets,
    addRocket,
    getRocketById,
    fetchRocketById,
  };
}
