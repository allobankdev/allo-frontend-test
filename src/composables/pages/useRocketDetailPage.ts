import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRocketsStore } from "@/stores/rockets";

export function useRocketDetailPage() {
  const route = useRoute();
  const store = useRocketsStore();

  onMounted(() => {
    store.ensureLoaded();
  });

  const id = computed(() =>
    String((route.params as { id?: string | string[] }).id ?? ""),
  );
  const rocket = computed(() => store.findRocketById(id.value));

  return {
    state: store,
    rocket,
    retry: store.retry,
    formatText,
    formatCost,
    formatDate,
  };
}

function formatText(value: string | null) {
  return value || "Not available";
}

function formatCost(value: string | null) {
  if (!value) return "Not available";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return value;
  return `$${numeric.toLocaleString("en-US")}`;
}

function formatDate(value: string | null) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
