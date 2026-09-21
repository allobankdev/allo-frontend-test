<template>
  <v-container
    class="py-8"
    max-width="1280"
  >
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold">
        SpaceX Rockets
      </h1>
      <p class="text-body-2 text-medium-emphasis mt-1">
        <template v-if="!store.loading">
          {{ store.filteredRockets.length }} rocket{{ store.filteredRockets.length !== 1 ? 's' : '' }} found
        </template>
      </p>
    </div>

    <!-- Filters -->
    <v-row
      align="center"
      class="mb-6"
    >
      <v-col
        cols="12"
        sm="6"
        md="5"
      >
        <v-text-field
          v-model="store.searchQuery"
          clearable
          density="comfortable"
          hide-details
          label="Search rockets..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="7"
      >
        <v-chip-group
          v-model="store.statusFilter"
          mandatory
          selected-class="text-primary"
        >
          <v-chip
            value="all"
            filter
            variant="outlined"
          >
            All
          </v-chip>
          <v-chip
            value="active"
            filter
            variant="outlined"
            color="success"
          >
            Active
          </v-chip>
          <v-chip
            value="retired"
            filter
            variant="outlined"
          >
            Retired
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>

    <!-- Loading -->
    <AppLoader v-if="store.loading" />

    <!-- Error -->
    <AppError
      v-else-if="store.error"
      :message="store.error"
      @retry="store.fetchRockets()"
    />

    <!-- Empty search result -->
    <div
      v-else-if="store.filteredRockets.length === 0"
      class="text-center py-16"
    >
      <v-icon
        size="64"
        color="grey-darken-1"
        class="mb-4"
      >
        mdi-rocket-off
      </v-icon>
      <p class="text-body-1 text-medium-emphasis">
        No rockets match your search.
      </p>
      <v-btn
        class="mt-4"
        variant="text"
        @click="store.searchQuery = ''; store.statusFilter = 'all'"
      >
        Clear filters
      </v-btn>
    </div>

    <!-- Rocket grid -->
    <v-row v-else>
      <v-col
        v-for="rocket in store.filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>

    <!-- FAB Add -->
    <v-btn
      color="primary"
      icon="mdi-plus"
      size="x-large"
      elevation="4"
      style="position: fixed; bottom: 28px; right: 28px; z-index: 10"
      @click="showDialog = true"
    />

    <AddRocketDialog v-model="showDialog" />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRocketStore } from '@/stores/rockets'

const store = useRocketStore()
const showDialog = ref(false)

onMounted(() => {
  // Only fetch if we don't already have data (e.g. navigating back from detail)
  if (store.rockets.length === 0) {
    store.fetchRockets()
  }
})
</script>
