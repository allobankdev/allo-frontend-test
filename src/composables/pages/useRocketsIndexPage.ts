import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import type { LocationQueryRaw } from "vue-router";
import { useDisplay } from "vuetify";
import type { NewRocketInput } from "@/types/rocket";
import { useRocketsStore } from "@/stores/rockets";

function readQueryString(v: unknown): string {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  return "";
}

function readStatus(v: unknown): "all" | "active" | "inactive" {
  const s = readQueryString(v);
  if (s === "active" || s === "inactive" || s === "all") return s;
  return "all";
}

export function useRocketsIndexPage() {
  const store = useRocketsStore();
  const route = useRoute();
  const router = useRouter();
  const display = useDisplay();

  const search = ref(readQueryString(route.query.q));
  const activeFilter = ref<"all" | "active" | "inactive">(
    readStatus(route.query.status)
  );
  const activeFilterItems = [
    { title: "All", value: "all" },
    { title: "Active", value: "active" },
    { title: "Inactive", value: "inactive" },
  ];

  const isMobile = computed(() => display.smAndDown.value);
  const dialogFullscreen = computed(() => isMobile.value);
  const dialogMaxWidth = computed<number | undefined>(() =>
    dialogFullscreen.value ? undefined : 720
  );
  const addButtonBlock = computed(() => isMobile.value);

  const addDialog = ref(false);
  const newRocket = reactive<NewRocketInput>({
    name: "",
    description: "",
    imageUrl: "",
    cost_per_launch: 0,
    country: "",
    first_flight: "",
    active: true,
  });

  let controller: AbortController | null = null;
  let appendController: AbortController | null = null;
  let debounceTimer: number | null = null;
  let observer: IntersectionObserver | null = null;
  const sentinel = ref<HTMLElement | null>(null);

  const rockets = computed(() => store.rockets.value);
  const listStatus = computed(() => store.listStatus.value);
  const listError = computed(() => store.listError.value);

  const appendStatus = computed(() => store.listAppendStatus.value);
  const appendError = computed(() => store.listAppendError.value);
  const hasNextPage = computed(() => store.listHasNextPage.value);

  const apiRockets = computed(() =>
    rockets.value.filter((r) => r.source !== "local")
  );
  const localRockets = computed(() =>
    rockets.value.filter((r) => r.source === "local")
  );

  const displayRockets = computed(() => {
    const q = search.value.trim().toLowerCase();
    const locals = localRockets.value.filter((r) => {
      if (activeFilter.value === "active" && r.active === false) return false;
      if (activeFilter.value === "inactive" && r.active !== false) return false;
      if (!q) return true;
      const hay = `${r.name} ${r.description} ${r.country}`.toLowerCase();
      return hay.includes(q);
    });
    return [...locals, ...apiRockets.value];
  });

  const showInitialSkeleton = computed(
    () => listStatus.value === "loading" && displayRockets.value.length === 0
  );

  const hasActiveFilters = computed(
    () => Boolean(search.value.trim()) || activeFilter.value !== "all"
  );

  const canSubmit = computed(() => {
    const flight = newRocket.first_flight.trim();
    const isIsoDate =
      /^\d{4}-\d{2}-\d{2}$/.test(flight) &&
      !Number.isNaN(new Date(flight).getTime());

    return (
      Boolean(newRocket.name.trim()) &&
      Boolean(newRocket.description.trim()) &&
      Boolean(newRocket.country.trim()) &&
      isIsoDate &&
      Number.isFinite(newRocket.cost_per_launch) &&
      newRocket.cost_per_launch >= 0
    );
  });

  function resetNewRocket() {
    newRocket.name = "";
    newRocket.description = "";
    newRocket.imageUrl = "";
    newRocket.cost_per_launch = 0;
    newRocket.country = "";
    newRocket.first_flight = "";
    newRocket.active = true;
  }

  function submitNewRocket() {
    const created = store.addRocket({
      name: newRocket.name,
      description: newRocket.description,
      imageUrl: newRocket.imageUrl,
      cost_per_launch: newRocket.cost_per_launch,
      country: newRocket.country,
      first_flight: newRocket.first_flight,
      active: newRocket.active,
    });
    addDialog.value = false;
    resetNewRocket();
    router.push(`/rockets/${created.id}`);
  }

  function clearFilters() {
    search.value = "";
    activeFilter.value = "all";
  }

  function syncQueryToUrl() {
    const q = search.value.trim();
    const status = activeFilter.value;

    const desiredQ = q || undefined;
    const desiredStatus = status !== "all" ? status : undefined;

    const currentQ = readQueryString(route.query.q) || undefined;
    const currentStatus = readQueryString(route.query.status) || undefined;

    if (currentQ === desiredQ && currentStatus === desiredStatus) return;

    const next: LocationQueryRaw = {};
    for (const [k, v] of Object.entries(route.query)) {
      if (k === "q" || k === "status") continue;
      next[k] = v as any;
    }
    if (desiredQ) next.q = desiredQ;
    if (desiredStatus) next.status = desiredStatus;

    router.replace({ query: next }).catch(() => {});
  }

  function reload(force = false) {
    controller?.abort();
    controller = new AbortController();
    store.loadFirstPage(
      { search: search.value, active: activeFilter.value },
      { force, signal: controller.signal }
    );
  }

  function loadMore() {
    if (!hasNextPage.value) return;
    if (appendStatus.value === "loading") return;
    appendController?.abort();
    appendController = new AbortController();
    store.loadNextPage({ signal: appendController.signal });
  }

  onMounted(() => {
    reload(false);

    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        loadMore();
      },
      { rootMargin: "600px 0px" }
    );
    if (sentinel.value) observer.observe(sentinel.value);
  });

  watch(
    () => route.query,
    () => {
      const nextQ = readQueryString(route.query.q);
      const nextStatus = readStatus(route.query.status);
      if (search.value !== nextQ) search.value = nextQ;
      if (activeFilter.value !== nextStatus) activeFilter.value = nextStatus;
    }
  );

  watch(
    () => [search.value, activeFilter.value] as const,
    () => {
      if (debounceTimer) window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        syncQueryToUrl();
        reload(false);
      }, 300);
    }
  );

  onBeforeUnmount(() => {
    controller?.abort();
    appendController?.abort();
    if (debounceTimer) window.clearTimeout(debounceTimer);
    if (observer && sentinel.value) observer.unobserve(sentinel.value);
    observer?.disconnect();
  });

  return {
    // display
    isMobile,
    addButtonBlock,
    dialogFullscreen,
    dialogMaxWidth,

    // state (filters)
    search,
    activeFilter,
    activeFilterItems,
    hasActiveFilters,

    // list
    rockets: displayRockets,
    apiRockets,
    listStatus,
    listError,
    appendStatus,
    appendError,
    hasNextPage,
    sentinel,
    showInitialSkeleton,

    // add dialog
    addDialog,
    newRocket,
    canSubmit,

    // actions
    reload,
    loadMore,
    clearFilters,
    submitNewRocket,
  };
}
