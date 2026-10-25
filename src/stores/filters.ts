import { defineStore } from "pinia";
import { ref } from "vue";

export const useFiltersStore = defineStore("filters", () => {
  const searchQuery = ref<string>("");

  return { searchQuery };
});
