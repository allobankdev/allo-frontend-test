<template>
  <!-- Header -->
  <v-row>
    <v-col cols="12">
      <h1 class="text-h3 font-weight-bold mb-2">SpaceX Rockets</h1>
      <p class="text-subtitle-1 text-grey-darken-1">Explore and manage SpaceX rocket information</p>
    </v-col>
  </v-row>

  <!-- Toolbar: Filter & Add Button -->
  <v-row class="mb-4">
    <v-col cols="12" md="6">
      <RocketFilter />
    </v-col>
    <v-col cols="12" md="6" class="d-flex justify-end align-center">
      <AddRocketDialog />
    </v-col>
  </v-row>

  <!-- Loading State -->
  <LoadingSpinner v-if="isLoading" />

  <!-- Error State with Retry -->
  <ErrorState v-else-if="error" :message="error" @retry="retryFetch" />

  <!-- Success State - Rocket Grid -->
  <v-row v-else>
    <!-- Empty State -->
    <v-col v-if="filteredRockets.length === 0" cols="12">
      <v-card class="text-center pa-8" variant="outlined">
        <v-icon size="64" color="grey" class="mb-4"> mdi-rocket-outline </v-icon>
        <h3 class="text-h5 mb-2">No rockets found</h3>
        <p class="text-body-1 text-grey">
          {{ filterActive === null ? 'Try adding a new rocket' : 'Try changing the filter' }}
        </p>
      </v-card>
    </v-col>

    <!-- Rocket Cards -->
    <v-col v-for="rocket in filteredRockets" :key="rocket.id" cols="12" sm="6" md="4" lg="3">
      <RocketCard :rocket="rocket" />
    </v-col>
  </v-row>

  <!-- Rocket Count Badge (Optional) -->
  <v-row v-if="!isLoading && !error" class="mt-4">
    <v-col cols="12" class="text-center">
      <v-chip color="primary" variant="outlined">
        Showing {{ filteredRockets.length }} of {{ rockets.length }} rockets
      </v-chip>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRocketStore } from '@/stores';
import RocketCard from '@/components/RocketCard.vue';
import RocketFilter from '@/components/RocketFilter.vue';
import AddRocketDialog from '@/components/AddRocketDialog.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import ErrorState from '@/components/ErrorState.vue';

const store = useRocketStore();
const { rockets, filteredRockets, isLoading, error, filterActive } = storeToRefs(store);

// Fetch rockets on mount
onMounted(() => {
  store.fetchRockets();
});

// Retry function
const retryFetch = () => {
  store.fetchRockets(true);
};
</script>
