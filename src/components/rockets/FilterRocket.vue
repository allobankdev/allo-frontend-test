<template>
  <div class="filter">
    <!-- Search -->
    <v-card-text class="pa-0">
      <v-text-field
        v-model="keyword"
        :loading="loading"
        append-inner-icon="mdi-magnify"
        density="compact"
        label="Search Rocket name..."
        variant="solo"
        hide-details
        single-line
        :disabled="loading && !keyword"
        @update:model-value="onInput"
        @click:append-inner="onSearchImmediate"
        @keyup.enter="onSearchImmediate"
      />
    </v-card-text>

    <!-- Filter -->
    <v-select
      v-model="activeFilter"
      :loading="loading"
      :items="activeOptions"
      label="Status"
      density="compact"
      variant="solo"
      hide-details
      :disabled="loading"
      @update:model-value="onFilterChange"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRocketStore, DEFAULT_QUERY } from "@/stores/rocketStore";
import type { RocketQueryBody, RocketQueryFilter } from "@/types/rocket-query";

const rocketStore = useRocketStore();
const { loading, keyword, activeFilter } = storeToRefs(rocketStore);

const activeOptions = [
  { title: "All", value: null },
  { title: "Active", value: true },
  { title: "Inactive", value: false },
];

let debounceTimer: number | undefined;

const buildQuery = (): RocketQueryBody => {
  const query: RocketQueryFilter = {};

  if (keyword.value.trim()) {
    query.name = {
      $regex: keyword.value,
      $options: "i",
    };
  }

  if (activeFilter.value !== null) {
    query.active = activeFilter.value;
  }

  return {
    ...DEFAULT_QUERY,
    query,
    options: {
      ...DEFAULT_QUERY.options,
    },
  };
};

const onInput = () => {
  clearTimeout(debounceTimer);

  debounceTimer = window.setTimeout(() => {
    rocketStore.queryRockets(buildQuery());
  }, 600);
};

const onSearchImmediate = () => {
  clearTimeout(debounceTimer);
  rocketStore.queryRockets(buildQuery());
};

const onFilterChange = () => {
  clearTimeout(debounceTimer);
  rocketStore.queryRockets(buildQuery());
};
</script>

<style scoped>
.filter {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
</style>
