<template>
  <v-container
    class="py-6 py-md-10"
    max-width="1280"
  >
    <!-- Header Hero Banner -->
    <div class="mb-8 text-center text-md-left">
      <div class="d-flex flex-column flex-md-row justify-space-between align-md-center ga-4">
        <div>
          <h1 class="text-h4 text-md-h3 font-weight-bold text-white mb-2 tracking-tight">
            SpaceX Launch Vehicles
          </h1>
          <p
            class="text-subtitle-1 text-grey-lighten-1"
            style="max-width: 680px;"
          >
            Explore SpaceX rocket configurations powered by The Space Devs Launch Library 2 API.
            View technical details, launch costs, and historical maiden flights.
          </p>
        </div>

        <div class="d-flex justify-center justify-md-end ga-2">
          <v-btn
            color="amber"
            variant="elevated"
            prepend-icon="mdi-plus"
            size="large"
            class="font-weight-bold"
            @click="rocketStore.openAddDialog()"
          >
            Add New Rocket
          </v-btn>
          <v-btn
            icon="mdi-refresh"
            variant="tonal"
            color="grey-lighten-2"
            size="large"
            :loading="rocketStore.isLoading"
            title="Refresh from API"
            @click="rocketStore.fetchRockets(true)"
          />
        </div>
      </div>
    </div>

    <!-- UI State 1: Error State with Retry Button -->
    <ErrorState
      v-if="rocketStore.error && rocketStore.allRockets.length === 0"
      :message="rocketStore.error"
      @retry="rocketStore.fetchRockets(true)"
    />

    <!-- UI State 2: Loading State -->
    <LoadingState
      v-else-if="rocketStore.isLoading && rocketStore.allRockets.length === 0"
      message="Fetching SpaceX rocket catalog..."
      :count="6"
    />

    <!-- UI State 3: Success State -->
    <div v-else>
      <!-- Search & Filter Controls -->
      <RocketFilter
        :total-count="rocketStore.allRockets.length"
        :filtered-count="rocketStore.filteredRockets.length"
        @update:search="onSearchUpdate"
        @update:filter="onFilterUpdate"
      />

      <!-- When background refresh has error but we still have cached data -->
      <v-alert
        v-if="rocketStore.error"
        type="warning"
        variant="tonal"
        closable
        class="mb-6 rounded-lg"
      >
        <div class="d-flex align-center justify-space-between flex-wrap ga-2">
          <span>Failed to refresh latest data from API: {{ rocketStore.error }}</span>
          <v-btn
            size="small"
            variant="outlined"
            color="warning"
            @click="rocketStore.fetchRockets(true)"
          >
            Retry Refresh
          </v-btn>
        </div>
      </v-alert>

      <!-- Empty State when filters yield no matches -->
      <EmptyState
        v-if="rocketStore.filteredRockets.length === 0"
        title="No Rockets Found"
        subtitle="No rockets matched your current search or filter criteria. Try a different query."
        @reset="resetFilters"
      />

      <!-- Grid of Rocket Cards -->
      <v-row
        v-else
        dense
        class="match-height"
      >
        <v-col
          v-for="rocket in rocketStore.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
          class="pb-4"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'
import RocketCard from '@/components/RocketCard.vue'
import RocketFilter from '@/components/RocketFilter.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import EmptyState from '@/components/EmptyState.vue'

const rocketStore = useRocketStore()

// Lifecycle Hook: onMounted - Fetch rockets upon mounting
onMounted(async () => {
  await rocketStore.fetchRockets()
})

function onSearchUpdate(val: string) {
  rocketStore.setSearchQuery(val)
}

function onFilterUpdate(val: 'all' | 'active' | 'reusable') {
  rocketStore.setSelectedFilter(val)
}

function resetFilters() {
  rocketStore.setSearchQuery('')
  rocketStore.setSelectedFilter('all')
}
</script>

<style scoped>
.tracking-tight {
  letter-spacing: -0.02em;
}
</style>
