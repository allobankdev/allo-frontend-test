import { ref } from "vue";
import type { RocketDetail, RocketResponse } from "@/types/rocket";

export default function useRocketState() {
  const rocketResponse = ref<RocketResponse[]>([]);
  const rockets = ref<RocketDetail[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const searchQuery = ref("");
  const sortOrder = ref<"newest" | "asc" | "desc">("newest");

  return {
    rocketResponse,
    rockets,
    loading,
    error,
    searchQuery,
    sortOrder,
  };
}
