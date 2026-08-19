<template>
  <v-container class="py-8">
    <!-- Hero / Header Section -->
    <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center mb-6 ga-4">
      <div>
        <h1 class="text-h4 font-weight-bold d-flex align-center ga-2">
          <v-icon
            color="primary"
            icon="mdi-rocket-launch"
          />
          SpaceX Launcher Fleet
        </h1>
        <p class="text-body-1 text-medium-emphasis mt-1">
          Explore launch configurations, technical specs, flight history, and custom spacecraft.
        </p>
      </div>

      <v-btn
        color="primary"
        elevation="2"
        prepend-icon="mdi-plus"
        size="large"
        variant="flat"
        @click="isAddModalOpen = true"
      >
        Add Rocket
      </v-btn>
    </div>

    <!-- UI State: Loading -->
    <StateLoading
      v-if="status === 'loading'"
      :count="6"
    />

    <!-- UI State: Error / Retry -->
    <StateError
      v-else-if="status === 'error'"
      :message="error"
      title="Failed to Load Fleet"
      @retry="loadRockets(true)"
    />

    <!-- UI State: Success -->
    <div v-else>
      <!-- Filters and Search -->
      <RocketFilter
        :count="filteredRockets.length"
        :total="allRockets.length"
      />

      <!-- Rocket Grid -->
      <v-row v-if="filteredRockets.length > 0">
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
          lg="4"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>

      <!-- Empty Filter State -->
      <v-card
        v-else
        class="text-center py-12 px-4 rounded-xl border"
        elevation="0"
      >
        <v-avatar
          class="mb-4"
          color="grey-darken-3"
          size="72"
        >
          <v-icon
            color="grey-lighten-1"
            icon="mdi-rocket-off-outline"
            size="40"
          />
        </v-avatar>
        <h3 class="text-h6 font-weight-bold mb-1">
          No Rockets Found
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          No launcher configurations match your current search or filter criteria.
        </p>
        <v-btn
          color="primary"
          prepend-icon="mdi-filter-off"
          variant="tonal"
          @click="resetFilters"
        >
          Clear Filters
        </v-btn>
      </v-card>
    </div>

    <!-- Add Rocket Dialog Modal -->
    <RocketAddDialog
      v-model="isAddModalOpen"
      @rocket-added="handleRocketAdded"
    />

    <!-- Snackbar notification -->
    <v-snackbar
      v-model="showSnackbar"
      color="success"
      location="bottom end"
      :timeout="3500"
    >
      <div class="d-flex align-center ga-2">
        <v-icon icon="mdi-check-circle" />
        <span>Rocket successfully added to fleet!</span>
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRockets } from '@/composables/useRockets'

const {
  status,
  error,
  allRockets,
  filteredRockets,
  loadRockets,
  resetFilters,
} = useRockets()

const isAddModalOpen = ref(false)
const showSnackbar = ref(false)

function handleRocketAdded() {
  showSnackbar.value = true
}

onMounted(() => {
  loadRockets()
})
</script>
