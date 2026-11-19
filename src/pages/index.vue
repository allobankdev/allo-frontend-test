<template>
  <v-container
    class="py-8"
    max-width="1280"
  >
    <!-- Header Hero Banner -->
    <v-sheet
      rounded="lg"
      class="pa-8 mb-8 text-center hero-banner"
      elevation="2"
    >
      <div class="d-flex align-center justify-center mb-2">
        <v-icon
          icon="mdi-rocket-launch"
          color="primary"
          size="40"
          class="mr-3"
        />
        <h1 class="text-h3 font-weight-bold">
          SpaceX Rocket Fleet
        </h1>
      </div>
      <p
        class="text-subtitle-1 text-medium-emphasis mx-auto"
        style="max-width: 650px"
      >
        Explore SpaceX's orbital launch vehicles, from Falcon 1 to the revolutionary Starship.
        Real-time data provided by the Space Devs Launch Library 2.
      </p>
    </v-sheet>

    <!-- Filter & Search Controls -->
    <RocketFilter
      :initial-search="store.searchQuery"
      :initial-status="store.filterStatus"
      :initial-sort="store.sortBy"
      @update:search="store.setSearchQuery"
      @update:status="store.setFilterStatus"
      @update:sort="store.setSortBy"
      @open-add-dialog="isAddDialogOpen = true"
    />

    <!-- UI State 1: Loading -->
    <LoadingState v-if="store.loading" />

    <!-- UI State 2: Error with Retry -->
    <ErrorState
      v-else-if="store.error"
      :message="store.error"
      @retry="handleRetry"
    />

    <!-- UI State 3: Success with Empty State Fallback -->
    <div v-else>
      <!-- Results summary counter -->
      <div class="d-flex justify-space-between align-center mb-4 px-1">
        <span class="text-body-2 text-medium-emphasis">
          Showing <strong>{{ store.filteredRockets.length }}</strong> of
          <strong>{{ store.allRockets.length }}</strong> rockets
        </span>
        <v-btn
          v-if="store.searchQuery || store.filterStatus !== 'all'"
          variant="text"
          size="small"
          color="primary"
          @click="resetFilters"
        >
          Reset Filters
        </v-btn>
      </div>

      <!-- Rocket Cards Grid -->
      <v-row v-if="store.filteredRockets.length > 0">
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>

      <!-- Empty state when search yields no matches -->
      <v-card
        v-else
        class="pa-12 text-center my-6"
        rounded="lg"
        variant="tonal"
      >
        <v-icon
          icon="mdi-rocket-outline"
          size="64"
          color="grey"
          class="mb-3"
        />
        <h3 class="text-h6 font-weight-medium mb-1">
          No Rockets Found
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          No vehicles matched your current search "{{ store.searchQuery }}".
        </p>
        <v-btn
          color="primary"
          variant="outlined"
          @click="resetFilters"
        >
          Clear Filters
        </v-btn>
      </v-card>
    </div>

    <!-- Add Rocket Dialog -->
    <AddRocketDialog
      v-model="isAddDialogOpen"
      @submit="handleSaveCustomRocket"
    />

    <!-- Snackbar notification for successful rocket addition -->
    <v-snackbar
      v-model="showSnackbar"
      color="success"
      location="top right"
      :timeout="3500"
    >
      {{ snackbarText }}
      <template #actions>
        <v-btn
          variant="text"
          @click="showSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRocketStore } from '@/stores/rocketStore';
import type { Rocket } from '@/types/rocket';

const store = useRocketStore();
const isAddDialogOpen = ref(false);
const showSnackbar = ref(false);
const snackbarText = ref('');

// Lifecycle: Fetch rockets on page load
onMounted(() => {
  store.fetchRockets();
});

function handleRetry() {
  store.fetchRockets(true);
}

function resetFilters() {
  store.setSearchQuery('');
  store.setFilterStatus('all');
  store.setSortBy('name');
}

function handleSaveCustomRocket(rocket: Omit<Rocket, 'id'>) {
  store.addRocket(rocket);
  snackbarText.value = `Rocket "${rocket.full_name}" added successfully!`;
  showSnackbar.value = true;
}
</script>

<style scoped>
.hero-banner {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
