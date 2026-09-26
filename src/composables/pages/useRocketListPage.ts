import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRocketsStore } from "@/stores/rockets";
import type { Rocket } from "@/types/rocket";

type NewRocketInput = Omit<Rocket, "id" | "isLocal">;

export function useRocketListPage() {
  const store = useRocketsStore();
  const { filteredRockets } = storeToRefs(store);

  const isAddDialogOpen = ref(false);

  onMounted(() => {
    store.ensureLoaded();
  });

  function openAddDialog() {
    isAddDialogOpen.value = true;
  }

  function handleAddRocket(payload: NewRocketInput) {
    store.addRocket(payload);
    isAddDialogOpen.value = false;
  }

  return {
    state: store,
    filteredRockets,
    isAddDialogOpen,
    retry: store.retry,
    setFilterText: store.setFilterText,
    openAddDialog,
    handleAddRocket,
  };
}
