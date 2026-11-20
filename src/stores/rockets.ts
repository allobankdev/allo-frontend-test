import { computed, reactive } from "vue";
import { ALL_COUNTRIES, CUSTOM_ROCKET_PREFIX } from "@/constants/app";
import {
  fetchRocketById,
  fetchSpaceXRockets,
  RocketApiError,
} from "@/services/rocketApi";
import type {
  AsyncStatus,
  NewRocketInput,
  Rocket,
  RocketSortOption,
} from "@/types/rocket";
import {
  extractAvailableCountries,
  filterAndSortRockets,
} from "@/utils/rocketFilters";

interface RocketState {
  apiRockets: Rocket[];
  customRockets: Rocket[];
  listStatus: AsyncStatus;
  listError: string | null;
  searchQuery: string;
  countryFilter: string;
  sortBy: RocketSortOption;
  selectedRocket: Rocket | null;
  detailStatus: AsyncStatus;
  detailError: string | null;
  detailNotFound: boolean;
  addDialogOpen: boolean;
}

const state = reactive<RocketState>({
  apiRockets: [],
  customRockets: [],
  listStatus: "idle",
  listError: null,
  searchQuery: "",
  countryFilter: ALL_COUNTRIES,
  sortBy: "default",
  selectedRocket: null,
  detailStatus: "idle",
  detailError: null,
  detailNotFound: false,
  addDialogOpen: false,
});

let listAbortController: AbortController | null = null;
let detailAbortController: AbortController | null = null;
let customRocketSeq = 0;

function isAbortError(err: unknown): boolean {
  return err instanceof Error && err.name === "AbortError";
}

export function useRocketStore() {
  const rockets = computed<Rocket[]>(() => [
    ...state.customRockets,
    ...state.apiRockets,
  ]);

  const availableCountries = computed<string[]>(() =>
    extractAvailableCountries(rockets.value),
  );

  const hasActiveFilters = computed<boolean>(() =>
    Boolean(
      state.searchQuery.trim() ||
      state.countryFilter !== ALL_COUNTRIES ||
      state.sortBy !== "default",
    ),
  );

  const filteredRockets = computed<Rocket[]>(() =>
    filterAndSortRockets(
      rockets.value,
      state.searchQuery,
      state.countryFilter,
      state.sortBy,
    ),
  );

  async function loadRockets(force = false): Promise<void> {
    if (
      !force &&
      (state.listStatus === "loading" || state.listStatus === "success")
    ) {
      return;
    }

    listAbortController?.abort();
    listAbortController = new AbortController();

    state.listStatus = "loading";
    state.listError = null;

    try {
      state.apiRockets = await fetchSpaceXRockets(listAbortController.signal);
      state.listStatus = "success";
    } catch (err) {
      if (isAbortError(err)) return;
      state.listStatus = "error";
      state.listError =
        err instanceof Error ? err.message : "Unable to fetch rockets.";
    }
  }

  async function loadRocketById(id: string, force = false): Promise<void> {
    state.detailNotFound = false;

    const existing = rockets.value.find((r) => r.id === id);
    if (existing && !force) {
      state.selectedRocket = existing;
      state.detailStatus = "success";
      state.detailError = null;
      return;
    }

    if (id.startsWith(CUSTOM_ROCKET_PREFIX)) {
      state.selectedRocket = null;
      state.detailNotFound = true;
      state.detailStatus = "error";
      state.detailError =
        "This custom rocket only exists in the current session and could not be found.";
      return;
    }

    detailAbortController?.abort();
    detailAbortController = new AbortController();

    state.selectedRocket = null;
    state.detailStatus = "loading";
    state.detailError = null;

    try {
      state.selectedRocket = await fetchRocketById(
        id,
        detailAbortController.signal,
      );
      state.detailStatus = "success";
    } catch (err) {
      if (isAbortError(err)) return;
      state.detailStatus = "error";
      state.detailNotFound =
        err instanceof RocketApiError && err.status === 404;
      state.detailError =
        err instanceof Error ? err.message : "Unable to fetch rocket details.";
    }
  }

  function addRocket(input: NewRocketInput): Rocket {
    customRocketSeq += 1;
    const newRocket: Rocket = {
      id: `${CUSTOM_ROCKET_PREFIX}${Date.now()}-${customRocketSeq}`,
      fullName: input.fullName.trim(),
      description: input.description.trim() || null,
      imageUrl: input.imageUrl?.trim() || null,
      launchCost: input.launchCost ?? null,
      countryCode: input.countryCode?.trim() || null,
      maidenFlight: input.maidenFlight?.trim() || null,
      isCustom: true,
    };
    state.customRockets.unshift(newRocket);
    return newRocket;
  }

  function setSearchQuery(query: string): void {
    state.searchQuery = query;
  }

  function setCountryFilter(country: string): void {
    state.countryFilter = country;
  }

  function setSortBy(sort: RocketSortOption): void {
    state.sortBy = sort;
  }

  function resetFilters(): void {
    state.searchQuery = "";
    state.countryFilter = ALL_COUNTRIES;
    state.sortBy = "default";
  }

  function setAddDialogOpen(open: boolean): void {
    state.addDialogOpen = open;
  }

  return {
    state,
    rockets,
    availableCountries,
    hasActiveFilters,
    filteredRockets,
    loadRockets,
    loadRocketById,
    addRocket,
    setSearchQuery,
    setCountryFilter,
    setSortBy,
    resetFilters,
    setAddDialogOpen,
  };
}
