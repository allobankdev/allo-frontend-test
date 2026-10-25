<template>
  <div>
    <!-- Loading State -->
    <div v-if="store.status === 'loading'" class="my-8">
      <v-row>
        <v-col v-for="i in 6" :key="i" cols="12" sm="6" md="4">
          <v-skeleton-loader
            type="card, paragraph, actions"
            elevation="2"
            class="rounded-lg"
          ></v-skeleton-loader>
        </v-col>
      </v-row>
    </div>

    <!-- Error / Retry State -->
    <v-card v-else-if="store.status === 'error'" class="pa-6 text-center my-8 bg-red-lighten-5" border elevation="1">
      <v-icon icon="mdi-alert-circle-outline" color="error" size="64" class="mb-3"></v-icon>
      <h3 class="text-h5 font-weight-bold text-error mb-2">Failed to Load SpaceX Rockets</h3>
      <p class="text-body-1 text-grey-darken-2 mb-4 max-w-600 mx-auto">
        {{ store.errorMessage || 'An error occurred while communicating with the Launch Library 2 API.' }}
      </p>
      <v-btn
        color="error"
        variant="elevated"
        size="large"
        prepend-icon="mdi-refresh"
        @click="store.fetchRockets(true)"
      >
        Retry Loading
      </v-btn>
    </v-card>

    <!-- Empty Filtered Results State -->
    <v-card
      v-else-if="store.status === 'success' && store.filteredRockets.length === 0"
      class="pa-6 text-center my-8 bg-grey-lighten-4"
      border
      elevation="0"
    >
      <v-icon icon="mdi-rocket-off" color="grey-darken-1" size="56" class="mb-2"></v-icon>
      <h3 class="text-h6 font-weight-bold text-grey-darken-3 mb-1">No Rockets Found</h3>
      <p class="text-body-2 text-grey-darken-1 mb-4">
        No SpaceX rockets match your current search criteria or filter status.
      </p>
      <v-btn
        color="primary"
        variant="outlined"
        size="small"
        prepend-icon="mdi-filter-remove"
        @click="store.resetFilters"
      >
        Clear Filters
      </v-btn>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { useRocketStore } from '@/stores/rocketStore'

const store = useRocketStore()
</script>

<style scoped>
.max-w-600 {
  max-width: 600px;
}
</style>
