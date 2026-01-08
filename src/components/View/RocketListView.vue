<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRocketStore } from "@/stores/rocketStore";
import type { RocketFilters } from "@/types/rocketTypes";

const rocketStore = useRocketStore();
const showAddDialog = ref(false);

onMounted(() => {
  rocketStore.fetchRockets();
});

const availableYears = computed(() => {
  const years = new Set<number>();

  rocketStore.filteredRockets.forEach((rocket) => {
    years.add(new Date(rocket.first_flight).getFullYear());
  });

  return [...years].sort((a, b) => b - a);
});

const availableCountries = computed(() => {
  const countries = new Set<string>();

  rocketStore.filteredRockets.forEach((rocket) => {
    if (rocket.country) countries.add(rocket.country);
  });

  return [...countries].sort();
});

const searchFilter = computed({
  get: () => rocketStore.filters.search,
  set: (val: string) => rocketStore.setQueryFilter({ search: val || null }),
});

const activeFilter = computed({
  get: () => rocketStore.filters.active,
  set: (val: boolean | null) => rocketStore.setQueryFilter({ active: val }),
});

const countryFilter = computed({
  get: () => rocketStore.filters.country,
  set: (val: string | null) => rocketStore.setQueryFilter({ country: val }),
});

const yearFilter = computed({
  get: () => rocketStore.filters.year,
  set: (val: number | null) => rocketStore.setQueryFilter({ year: val }),
});

const costMinFilter = computed({
  get: () => rocketStore.filters.costMin,
  set: (val: number | null) => rocketStore.setQueryFilter({ costMin: val }),
});

const costMaxFilter = computed({
  get: () => rocketStore.filters.costMax,
  set: (val: number | null) => rocketStore.setQueryFilter({ costMax: val }),
});

function handleRetry() {
  rocketStore.fetchRockets();
}

function openAddDialog() {
  showAddDialog.value = true;
}

function closeAddDialog() {
  showAddDialog.value = false;
}
</script>

<template>
  <v-container class="rocket-list-container">
    <h1 class="text-h4 font-weight-bold mb-6" aria-label="SpaceX Rockets">
      <v-icon left color="primary"> mdi-rocket-launch </v-icon>
      SpaceX<span class="text--secondary">allo</span>
    </h1>

    <div
      v-if="rocketStore.loading"
      class="loading-state"
      role="status"
      aria-live="polite"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
        aria-label="Loading rocket data"
      />
      <p class="mt-4" aria-label="Loading message">Loading rocket data...</p>
    </div>

    <div
      v-else-if="rocketStore.error"
      class="error-state"
      role="alert"
      aria-live="assertive"
    >
      <ErrorRetry :error="rocketStore.error" :on-retry="handleRetry" />
    </div>

    <div v-else>
      <v-card class="filter-controls mb-6" elevation="2">
        <v-card-title class="filter-title">
          <v-icon left color="secondary"> mdi-filter-variant </v-icon>
          Filter Rockets
        </v-card-title>

        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="searchFilter"
                label="Search Rocket"
                clearable
                prepend-inner-icon="mdi-magnify"
                hide-details
                aria-label="Search rockets by name"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                v-model="activeFilter"
                :items="[
                  { title: 'Active', value: true },
                  { title: 'Inactive', value: false },
                ]"
                item-title="title"
                item-value="value"
                label="Status"
                clearable
                prepend-inner-icon="mdi-rocket-launch"
                hide-details
                aria-label="Filter by rocket status"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                v-model="countryFilter"
                :items="availableCountries"
                label="Filter by Country"
                clearable
                prepend-inner-icon="mdi-earth"
                hide-details
                aria-label="Filter by country"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                v-model="yearFilter"
                :items="availableYears"
                label="Filter by Year"
                clearable
                prepend-inner-icon="mdi-calendar"
                hide-details
                aria-label="Filter by first flight year"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model.number="costMinFilter"
                type="number"
                label="Min Cost / Launch"
                clearable
                prepend-inner-icon="mdi-cash-minus"
                hide-details
                aria-label="Minimum cost per launch"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model.number="costMaxFilter"
                type="number"
                label="Max Cost / Launch"
                clearable
                prepend-inner-icon="mdi-cash-plus"
                hide-details
                aria-label="Maximum cost per launch"
              />
            </v-col>

            <v-col cols="12" class="d-flex align-center mt-4">
              <v-btn
                color="error"
                variant="outlined"
                class="reset-button"
                :disabled="
                  (Object.keys(rocketStore.filters) as (keyof RocketFilters)[]).every(
                    (k) =>
                      rocketStore.filters[k] == null ||
                      rocketStore.filters[k] === ''
                  )
                "
                aria-label="Reset all filters"
                @click="rocketStore.resetFilters"
              >
                <v-icon left icon="mdi-filter-remove" />
                Reset Filters
              </v-btn>

              <v-spacer />

              <v-btn
                color="success"
                variant="elevated"
                class="add-button"
                aria-label="Add new rocket"
                @click="openAddDialog"
              >
                <v-icon left icon="mdi-plus" />
                Add Rocket
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-alert
        v-if="rocketStore.filteredRockets.length > 0"
        type="info"
        class="mb-4 results-summary"
        density="compact"
        aria-live="polite"
      >
        <template #prepend>
          <v-icon icon="mdi-information" />
        </template>
        Showing {{ rocketStore.filteredRockets.length }} of
        {{ rocketStore.allRockets.length }} rockets
        <v-btn
          v-if="
            Object.values(rocketStore.filters).some(
              (val) => val !== null && val !== ''
            )
          "
          variant="text"
          size="small"
          class="ml-2"
          @click="rocketStore.resetFilters"
        >
          Clear Filters
        </v-btn>
      </v-alert>

      <v-row v-if="rocketStore.filteredRockets.length > 0">
        <v-col
          v-for="rocket in rocketStore.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-fade-transition>
            <RocketCard :rocket="rocket" />
          </v-fade-transition>
        </v-col>
      </v-row>

      <div v-else class="no-results">
        <v-alert
          type="info"
          class="no-results-alert"
          density="comfortable"
          role="alert"
          aria-live="polite"
        >
          <template #title>
            <v-icon left color="secondary"> mdi-rocket-off </v-icon>
            <span class="no-results-title">No Rockets Found</span>
          </template>

          <p class="no-results-text">
            Your current filters didn't match any rockets. Try adjusting your
            search criteria or reset the filters to explore all available
            rockets.
          </p>

          <template #append>
            <v-btn
              color="primary"
              variant="text"
              aria-label="Reset filters to see all rockets"
              @click="rocketStore.resetFilters"
            >
              Reset Filters
              <v-icon right> mdi-filter-remove </v-icon>
            </v-btn>
          </template>
        </v-alert>
      </div>
    </div>

    <AddRocketModal v-if="showAddDialog" @close="closeAddDialog" />
  </v-container>
</template>

<style lang="scss" scoped>
@use "../../styles/settings.scss" as *;

.text--secondary {
  color: $secondary-color;
}

.rocket-list-container {
  padding: 2rem 0;
  max-width: 1400px;
  margin: 0 auto;
}

h1 {
  color: $primary-color;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
}

.filter-controls {
  background: $bg-surface;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.reset-button {
  margin-right: 1rem;
}

.no-results {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
  animation: fade-in 0.4s ease-in-out;

  .no-results-alert {
    max-width: 600px;
    padding: 1.5rem 2rem;
    border-radius: 12px;
    background: linear-gradient(
      135deg,
      rgba(30, 30, 60, 0.9),
      rgba(20, 20, 40, 0.9)
    );
    color: #fff;

    .no-results-title {
      display: inline-block;
      font-size: 1.1rem;
      font-weight: 600;
      letter-spacing: 0.3px;
    }

    .no-results-text {
      margin-top: 0.75rem;
      font-size: 0.95rem;
      line-height: 1.5;
      opacity: 0.9;
    }

    .no-results-hint {
      margin-top: 0.5rem;
      font-size: 0.85rem;
      opacity: 0.75;
      font-style: italic;
    }
  }
}

/* subtle entrance animation */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
