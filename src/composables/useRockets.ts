import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";
import { fetchRockets } from "@/services/api";
import { mapRockets } from "@/utils/";

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