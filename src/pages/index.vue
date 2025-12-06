<template>
  <v-row class="d-flex flex-column ga-8">
    <div class="d-flex flex-column ga-1">
      <!-- Search -->
      <v-text-field
        v-model="searchValue"
        class="mb-4"
        append-inner-icon="mdi-magnify"
        density="compact"
        label="Find the rocket here"
        variant="solo"
        hide-details
        single-line
      />

      <!-- Filters -->
      <div class="d-flex align-center ga-8">
        <!-- SORT (Ascending / Descending) -->
        <div class="d-flex flex-row align-center ga-4">
          <h1 class="text-body-1">Price</h1>
          <v-btn-toggle v-model="sortValue" divided color="primary">
            <v-btn size="x-small" style="text-transform: none" value="asc"
              >Highest Price</v-btn
            >
            <v-btn size="x-small" style="text-transform: none" value="desc"
              >Lowest Price</v-btn
            >
          </v-btn-toggle>
        </div>

        <!-- ACTIVE FILTER -->
        <div class="d-flex flex-row align-center ga-4">
          <h1 class="text-body-1">Status</h1>
          <v-btn-toggle v-model="activeValue" divided color="secondary">
            <v-btn size="x-small" style="text-transform: none" value="all"
              >All</v-btn
            >
            <v-btn size="x-small" style="text-transform: none" value="true"
              >Active</v-btn
            >
            <v-btn size="x-small" style="text-transform: none" value="false"
              >Inactive</v-btn
            >
          </v-btn-toggle>
        </div>
      </div>
    </div>

    <!-- Rocket List-->
    <div class="d-flex flex-column ga-2">
      <div class="d-flex align-center justify-space-between">
        <h1 class="text-h6">Rocket List</h1>
        <v-btn color="primary" @click="show = true">Add Rocket</v-btn>
      </div>

      <h1 v-if="listData.length < 1">There is no data</h1>
      <RocketList
        v-else
        :data="listData"
        :is-loading="isLoading || searchLoading"
      />
    </div>
  </v-row>

  <!-- Modal Create Rocket Form -->
  <RocketFormModal v-model:open="show" @submit="onCreate" />

  <!-- Modal Feedback -->
  <v-alert
    v-if="showFeedback"
    class="position-fixed bottom-0 right-0 left-0 w-50 mx-auto"
    title="Rocket successfully create"
    type="success"
  />
</template>

<script lang="ts" setup>
import { findRockets, getAllRockets } from "@/services/rocket";
import { useRocketStore } from "@/stores/rockets";
import type { RocketPayload } from "@/types/rockets";
import { useQuery } from "@tanstack/vue-query";
import { ref, watch, computed } from "vue";

const rocketStore = useRocketStore();

// Modal feedback refs
const showFeedback = ref(false);

const show = ref(false);

const searchValue = ref("");
const sortValue = ref<"asc" | "desc">("asc");
const activeValue = ref<"all" | "true" | "false">("all");

const searchLoading = ref(false);

function onCreate(payload: RocketPayload) {
  rocketStore.addRocket(payload);
  showFeedback.value = true;
}

// Get all rockets query
const { data: rocketsData, isLoading } = useQuery({
  queryKey: ["rockets"],
  queryFn: getAllRockets,
});

// Set rockets query to store
watch(rocketsData, (val) => {
  if (val !== undefined) rocketStore.setRockets(val);
});

let timeOutId: number | undefined = undefined;
// setTimeout to feedback modal
watch(showFeedback, (v) => {
  clearTimeout(timeOutId);
  if (v) {
    timeOutId = setTimeout(() => {
      showFeedback.value = false;
      timeOutId = undefined;
    }, 2000);
  }
});

// Search query
const { data: searchData, refetch: refetchSearch } = useQuery({
  queryKey: ["search-rockets"],
  queryFn: () =>
    findRockets({
      search: searchValue.value,
      sortBy: sortValue.value,
      active:
        activeValue.value === "all" ? undefined : activeValue.value === "true",
    }),
  enabled: false,
});

let debounceTimer: number | undefined;

// Watch for search, sort, and active filter
watch([searchValue, sortValue, activeValue], () => {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(async () => {
    searchLoading.value = true;
    await refetchSearch();
    if (searchData.value !== undefined) {
      rocketStore.setFilteredRockets(searchData.value);
    }
    searchLoading.value = false;
  }, 500);
});

const listData = computed(() => {
  if (searchValue.value.trim()) {
    return rocketStore.filteredRockets ?? [];
  }
  return rocketStore.rockets;
});
</script>
