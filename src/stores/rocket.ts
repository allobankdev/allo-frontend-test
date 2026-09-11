import type { RocketData } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useRocketStore = defineStore("rocket", () => {
  const data = ref<RocketData[]>([]);

  const addData = (newData: RocketData) => {
    data.value.unshift(newData);
  };

  return { data, addData };
});
