<template>
  <v-container class="py-8" max-width="1200">
    <RocketFilterBar
      :search-query="state.searchQuery"
      :country-filter="state.countryFilter"
      :sort-by="state.sortBy"
      :countries="availableCountries"
      :total-count="rockets.length"
      :filtered-count="filteredRockets.length"
      :has-active-filters="hasActiveFilters"
      :show-count="state.listStatus === 'success' || rockets.length > 0"
      @update:search-query="setSearchQuery"
      @update:country-filter="setCountryFilter"
      @update:sort-by="setSortBy"
      @reset="resetFilters"
    />

    <ErrorAlert
      v-if="state.listStatus === 'error'"
      title="Could not load rockets"
      :message="state.listError"
      class="mb-6"
      @retry="void loadRockets(true)"
    />

    <v-progress-linear
      v-if="state.listStatus === 'loading' && rockets.length > 0"
      indeterminate
      color="primary"
      rounded
      class="mb-4"
    />

    <!-- Loading State -->
    <v-row v-if="state.listStatus === 'loading' && rockets.length === 0">
      <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="4">
        <v-skeleton-loader
          type="image, article"
          class="rounded-xl skeleton-card"
        />
      </v-col>
    </v-row>

    <!-- Empty Filter State -->
    <EmptyState
      v-else-if="
        filteredRockets.length === 0 &&
        (state.listStatus === 'success' || rockets.length > 0)
      "
      title="No matching rockets"
      description="Try adjusting your search or filter criteria."
      action-label="Reset filters"
      @action="resetFilters"
    />

    <!-- Success Grid -->
    <v-row v-else-if="filteredRockets.length > 0">
      <v-col
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>

    <AddRocketDialog
      :model-value="state.addDialogOpen"
      @update:model-value="setAddDialogOpen($event)"
      @submit="handleAddRocket"
    />

    <v-snackbar
      v-model="snackbar.open"
      :timeout="4000"
      color="surface"
      location="bottom right"
      rounded="lg"
    >
      {{ snackbar.text }}
      <template #actions>
        <v-btn
          v-if="snackbar.rocketId"
          color="primary"
          variant="text"
          class="text-none"
          @click="viewCreatedRocket"
        >
          View
        </v-btn>
        <v-btn variant="text" class="text-none" @click="snackbar.open = false">
          Dismiss
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import AddRocketDialog from "@/components/AddRocketDialog.vue";
import EmptyState from "@/components/EmptyState.vue";
import ErrorAlert from "@/components/ErrorAlert.vue";
import RocketCard from "@/components/RocketCard.vue";
import RocketFilterBar from "@/components/RocketFilterBar.vue";
import { useRocketStore } from "@/stores/rockets";
import type { NewRocketInput } from "@/types/rocket";

const router = useRouter();

const {
  state,
  rockets,
  availableCountries,
  hasActiveFilters,
  filteredRockets,
  loadRockets,
  addRocket,
  setSearchQuery,
  setCountryFilter,
  setSortBy,
  resetFilters,
  setAddDialogOpen,
} = useRocketStore();

const snackbar = reactive({
  open: false,
  text: "",
  rocketId: "",
});

onMounted(() => {
  void loadRockets();
});

function handleAddRocket(payload: NewRocketInput) {
  const created = addRocket(payload);
  if (!filteredRockets.value.some((r) => r.id === created.id)) {
    resetFilters();
  }
  snackbar.text = `Added "${created.fullName}"`;
  snackbar.rocketId = created.id;
  snackbar.open = true;
}

function viewCreatedRocket() {
  if (!snackbar.rocketId) return;
  const targetId = snackbar.rocketId;
  snackbar.open = false;
  void router.push(`/rockets/${targetId}`);
}
</script>

<style scoped>
.skeleton-card {
  border: 1px solid var(--app-border);
}
</style>
