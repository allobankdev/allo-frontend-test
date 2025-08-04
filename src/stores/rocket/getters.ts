import { computed, type Ref } from "vue";
import type { RocketDetail, RocketResponse } from "@/types/rocket";

export default function useRocketGetters(state: {
  rocketResponse: Ref<RocketResponse[]>;
  searchQuery: Ref<string>;
  sortOrder: Ref<string>;
  rockets: Ref<RocketDetail[]>;
}) {
  const filteredRockets = computed<RocketResponse[]>(() => {
    let filtered = state.rocketResponse.value;

    if (state.searchQuery.value) {
      const query = state.searchQuery.value.toLowerCase();
      filtered = filtered.filter((rocket: RocketResponse) =>
        rocket.name.toLowerCase().includes(query)
      );
    }

    if (state.sortOrder.value === "newest") {
      const localRockets = filtered.filter((rocket: RocketResponse) =>
        rocket.id.startsWith("id_")
      );
      const apiRockets = filtered.filter(
        (rocket: RocketResponse) => !rocket.id.startsWith("id_")
      );

      const sortedApiRockets = [...apiRockets].sort(
        (a: RocketResponse, b: RocketResponse) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          return nameA.localeCompare(nameB);
        }
      );

      return [...localRockets, ...sortedApiRockets];
    } else {
      filtered = [...filtered].sort((a: RocketResponse, b: RocketResponse) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        const direction = state.sortOrder.value === "asc" ? 1 : -1;
        return nameA > nameB ? direction : nameA < nameB ? -direction : 0;
      });
      return filtered;
    }
  });

  return {
    filteredRockets,
  };
}
