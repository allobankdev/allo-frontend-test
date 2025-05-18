import { defineStore } from "pinia";
import { ref } from "vue";

export const useFilterStore = defineStore('filter', () => {
  const filter = ref({
    optionA: false,
    optionB: false,
    optionC: false,
    optionD: false,
    optionE: false,
    optionF: false,
  })

  function setFilter(filterCheck: string) {
    filter.value = filterCheck;
  }

  return {filter, setFilter}
});
