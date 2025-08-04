import type { RocketDetail, RocketResponse } from "@/types/rocket";
import { SpaceXApiService } from "@/services/spacexApi";
import type { Ref } from "vue";

export default function useRocketActions(state: {
  rockets: Ref<RocketDetail[]>;
  rocketResponse: Ref<RocketResponse[]>;
  loading: any;
  error: any;
}) {
  const loadLocalRockets = () => {
    try {
      const savedRockets = localStorage.getItem("rockets");
      if (savedRockets) {
        const parsedRockets = JSON.parse(savedRockets) as RocketDetail[];
        state.rockets.value = parsedRockets;
        combineRockets();
      }
    } catch (err) {
      console.error("Failed to load local rockets:", err);
    }
  };

  const saveLocalRockets = () => {
    try {
      const rocketsToSave = JSON.stringify(state.rockets.value);
      localStorage.setItem("rockets", rocketsToSave);
    } catch (err) {
      console.error("Failed to save local rockets:", err);
    }
  };

  const combineRockets = () => {
    const localRocketResponses: RocketResponse[] = state.rockets.value.map(
      (rocket: RocketDetail) => ({
        id: rocket.id,
        name: rocket.name,
        description: rocket.description,
        flickr_images: rocket.flickr_images,
      })
    );

    const apiRockets = state.rocketResponse.value.filter(
      (rocket: RocketResponse) =>
        !state.rockets.value.some(
          (localRocket: RocketDetail) => localRocket.id === rocket.id
        )
    );

    state.rocketResponse.value = [...localRocketResponses, ...apiRockets];
  };

  const fetchRockets = async () => {
    state.loading.value = true;
    state.error.value = null;

    try {
      const apiRockets = await SpaceXApiService.getRockets();

      state.rocketResponse.value = apiRockets.map((rocket) => ({
        id: rocket.id,
        name: rocket.name,
        description: rocket.description,
        flickr_images: rocket.flickr_images,
      })) as RocketResponse[];

      loadLocalRockets();
      combineRockets();
    } catch (err) {
      state.error.value =
        err instanceof Error ? err.message : "Failed to fetch rockets";
      loadLocalRockets();
      combineRockets(); // Add this line to ensure UI updates with local rockets
    } finally {
      state.loading.value = false;
    }
  };

  const fetchRocket = async (id: string): Promise<RocketDetail | null> => {
    state.loading.value = true;
    state.error.value = null;

    try {
      const localRocket = state.rockets.value.find(
        (rocket: RocketDetail) => rocket.id === id
      );

      if (localRocket) {
        state.loading.value = false;
        return localRocket;
      }

      const apiRocket = await SpaceXApiService.getRocket(id);
      if (apiRocket) {
        return apiRocket;
      }

      state.error.value = "Rocket not found";
      return null;
    } catch (err) {
      state.error.value =
        err instanceof Error ? err.message : "Failed to fetch rocket";
      return null;
    } finally {
      state.loading.value = false;
    }
  };

  const clearError = () => {
    state.error.value = null;
  };

  const retryRockets = async () => {
    console.log("retryRockets called, clearing error and starting fetch...");
    state.error.value = null;
    await fetchRockets();
    console.log("retryRockets completed");
  };

  const retryRocket = async (id: string) => {
    state.error.value = null;
    return await fetchRocket(id);
  };

  const addLocalRocket = (rocket: RocketDetail) => {
    state.rockets.value.unshift(rocket);
    combineRockets();
    saveLocalRockets();
  };

  return {
    fetchRockets,
    fetchRocket,
    addLocalRocket,
    clearError,
    retryRockets,
    retryRocket,
    loadLocalRockets,
  };
}
