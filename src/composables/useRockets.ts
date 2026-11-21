import { useQuery } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";
import { useRocketStore } from "@/stores/rockets";
import { fetchRocketById, fetchRockets } from "@/services/api";
import { mapRocket, mapRockets } from "@/utils/";

export const useRockets = () => {
  const query = useQuery({
    queryKey: ["rockets"],
    queryFn: fetchRockets,
  });

  const rockets = computed(() => {
    return mapRockets(query.data.value ?? []);
  });

  return {
    rockets,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useRocket = (id: MaybeRefOrGetter<string>) => {
  const rocketId = computed(() => toValue(id));
  const store = useRocketStore();

  const query = useQuery({
    queryKey: computed(() => ["rocket", rocketId.value]),
    queryFn: async () => {
      const localRocket = store.getLocalRocketById(rocketId.value);
      if (localRocket) {
        return localRocket;
      }

      return mapRocket(await fetchRocketById(rocketId.value));
    },
    enabled: computed(() => Boolean(rocketId.value)),
  });

  const rocket = computed(() => {
    return query.data.value ?? null;
  });

  return {
    rocket,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};