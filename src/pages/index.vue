<template>
  <v-container fluid class="pa-4">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center flex-wrap ga-4">
          <div>
            <h1 class="text-h3 font-weight-bold mb-2">
              🚀 SpaceX Rockets
            </h1>
            <p class="text-subtitle-1 text-grey-darken-1">
              Explore the fleet of SpaceX rockets
            </p>
          </div>
          <AddRocketDialog />
        </div>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-row>
      <v-col cols="12">
        <RocketFilter
          :search-query="rocketsStore.searchQuery"
          :filter-active="rocketsStore.filterActive"
          @update:search-query="rocketsStore.setSearchQuery"
          @update:filter-active="rocketsStore.setFilter"
        />
      </v-col>
    </v-row>

    <!-- Loading State -->
    <LoadingState
      v-if="rocketsStore.loading && rocketsStore.rockets.length === 0"
      message="Loading rockets..."
    />

    <!-- Error State -->
    <ErrorState
      v-else-if="rocketsStore.error"
      :message="rocketsStore.error"
      @retry="handleRetry"
    />

    <!-- Rockets Grid -->
    <template v-else>
      <!-- Results Count -->
      <v-row v-if="rocketsStore.filteredRockets.length > 0">
        <v-col cols="12">
          <p class="text-body-2 text-grey-darken-1">
            Showing {{ rocketsStore.filteredRockets.length }}
            {{ rocketsStore.filteredRockets.length === 1 ? 'rocket' : 'rockets' }}
          </p>
        </v-col>
      </v-row>

      <!-- Rockets List -->
      <v-row>
        <v-col
          v-for="rocket in rocketsStore.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>

      <!-- No Results -->
      <v-row v-if="rocketsStore.filteredRockets.length === 0">
        <v-col cols="12" class="text-center py-12">
          <v-icon size="80" color="grey-lighten-1" class="mb-4">
            mdi-rocket-outline
          </v-icon>
          <h3 class="text-h6 mb-2">No rockets found</h3>
          <p class="text-body-2 text-grey-darken-1">
            Try adjusting your filters or search query
          </p>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRocketsStore } from '@/stores/rockets'
import RocketCard from '@/components/RocketCard.vue'
import RocketFilter from '@/components/RocketFilter.vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const rocketsStore = useRocketsStore()

// Ambil Data Saat Komponen Dimuat
onMounted(() => {
  if (rocketsStore.rockets.length === 0) {
    rocketsStore.fetchRockets()
  }
})

function handleRetry() {
  rocketsStore.clearError()
  rocketsStore.fetchRockets()
}
</script>
