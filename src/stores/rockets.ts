import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { fetchRockets, rocketFromForm } from "@/services/rockets";
import type { Rocket, RocketForm } from "@/types/rocket";

export const useRocketStore = defineStore("rockets", () => {
  const rockets = ref<Rocket[]>([]);
  const localRockets = ref<Rocket[]>([]);
  const status = ref<"idle" | "loading" | "success" | "error">("idle");
  const error = ref("");
  const query = ref("");

  const filteredRockets = computed(() => {
    const normalizedQuery = query.value.trim().toLowerCase();
    if (!normalizedQuery) return rockets.value;

    return rockets.value.filter((rocket) =>
      [rocket.name, rocket.description, rocket.country].some((value) =>
        value?.toLowerCase().includes(normalizedQuery),
      ),
    );
  });

  const loadRockets = async (force = false) => {
    if (status.value === "loading" || (status.value === "success" && !force))
      return;

    status.value = "loading";
    error.value = "";
    try {
      rockets.value = await fetchRockets();
      status.value = "success";
    } catch (reason) {
      error.value =
        reason instanceof Error
          ? reason.message
          : "Something went wrong while loading rockets.";
      status.value = "error";
    }
  };

  const addRocket = (form: RocketForm) => {
    const rocket = rocketFromForm(form);
    localRockets.value.unshift(rocket);
    rockets.value.unshift(rocket);
  };

  const findRocket = (id: string) =>
    rockets.value.find((rocket) => String(rocket.id) === id);

  return {
    rockets,
    localRockets,
    status,
    error,
    query,
    filteredRockets,
    loadRockets,
    addRocket,
    findRocket,
  };
});
