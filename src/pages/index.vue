<template>
  <v-container class="py-8 py-md-12">
    <header class="mb-8">
      <div class="d-flex flex-wrap align-center justify-space-between ga-4">
        <div>
          <div class="text-overline text-primary">SPACE EXPLORATION</div>

          <h1 class="text-h3 font-weight-bold">SpaceX Rockets</h1>

          <p class="text-body-1 text-medium-emphasis mt-2">
            Explore the rockets in the SpaceX launcher catalogue.
          </p>
        </div>

        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          size="large"
          @click="showAddDialog = true"
        >
          Add rocket
        </v-btn>
      </div>
    </header>

    <v-text-field
      v-model="search"
      label="Search rockets"
      placeholder="Enter a rocket name..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      clearable
      hide-details
      class="mb-6"
    />

    <div v-if="loading" class="d-flex flex-column align-center py-16">
      <v-progress-circular indeterminate color="primary" size="48" />

      <p class="mt-4">Loading rockets...</p>
    </div>

    <v-alert v-else-if="error" type="error" variant="tonal" class="mb-6">
      <div class="d-flex flex-wrap align-center justify-space-between ga-3">
        <span>{{ error }}</span>

        <v-btn color="error" variant="outlined" @click="loadRockets(true)">
          Retry
        </v-btn>
      </div>
    </v-alert>

    <template v-else>
      <div class="d-flex justify-space-between align-center mb-4">
        <span class="text-body-2 text-medium-emphasis">
          {{ filteredRockets.length }}
          {{ filteredRockets.length === 1 ? "rocket" : "rockets" }}
          found
        </span>

        <span
          v-if="search.trim() && isDebouncing"
          class="text-caption text-medium-emphasis"
        >
          Searching...
        </span>
      </div>

      <v-row v-if="filteredRockets.length > 0">
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          lg="4"
        >
          <RocketCard :rocket="rocket" @select="openRocket" />
        </v-col>
      </v-row>

      <v-alert v-else-if="rockets.length === 0" type="info" variant="tonal">
        No rockets available.
      </v-alert>

      <v-alert v-else type="info" variant="tonal">
        No rockets match your search.
      </v-alert>
    </template>

    <AddRocketDialog v-model="showAddDialog" @add="addRocket" />
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRouter } from "vue-router";

import RocketCard from "@/components/RocketCard.vue";
import AddRocketDialog from "@/components/AddRocketDialog.vue";
import { useRockets } from "@/composables/useRockets";
import type { Rocket } from "@/types/rocket";

const router = useRouter();

const {
  rockets,
  loading,
  error,
  loadRockets,
  addRocket: addRocketToState,
} = useRockets();

const search = ref("");
const debouncedSearch = ref("");
const isDebouncing = ref(false);
const showAddDialog = ref(false);

const DEBOUNCE_DELAY = 300;

let searchTimeout: ReturnType<typeof setTimeout> | undefined;

watch(search, (value) => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  isDebouncing.value = true;

  searchTimeout = setTimeout(() => {
    debouncedSearch.value = (value ?? "").trim().toLowerCase();
    isDebouncing.value = false;
  }, DEBOUNCE_DELAY);
});

const filteredRockets = computed(() => {
  const query = debouncedSearch.value;

  if (!query) {
    return rockets.value;
  }

  return rockets.value.filter((rocket) =>
    (rocket.full_name || "").toLowerCase().includes(query),
  );
});

function openRocket(rocket: Rocket) {
  router.push(`/rockets/${encodeURIComponent(String(rocket.id))}`);
}

function addRocket(rocket: Rocket) {
  addRocketToState(rocket);

  search.value = "";
  debouncedSearch.value = "";
  isDebouncing.value = false;

  if (searchTimeout) {
    clearTimeout(searchTimeout);
    searchTimeout = undefined;
  }
}

onMounted(() => {
  loadRockets();
});

onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
});
</script>
