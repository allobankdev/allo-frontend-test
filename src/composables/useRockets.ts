import { onMounted } from "vue";
import { useRocketStore } from "@/stores/rockets";

export const useRockets = () => {
  const store = useRocketStore();

  onMounted(() => {
    void store.loadRockets();
  });

  return store;
};
