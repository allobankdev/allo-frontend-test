<template>
  <v-container fluid class="pa-4 pa-sm-6">
    <!-- Header -->
    <v-row align="center" class="mb-4">
      <v-col>
        <div class="d-flex align-center">
          <v-icon icon="mdi-rocket-launch" size="36" color="primary" class="mr-3" />
          <div>
            <h1 class="text-h5 font-weight-bold">SpaceX Rockets</h1>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Explore the SpaceX rocket fleet
            </p>
          </div>
        </div>
      </v-col>
      <v-col cols="auto">
        <AddRocketDialog @add="handleAddRocket" />
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-card class="mb-5" rounded="lg" variant="outlined">
      <v-card-text class="py-3">
        <RocketFilters
          :search-query="store.searchQuery"
          :filter-status="store.filterStatus"
          @update:search-query="store.setSearchQuery($event)"
          @update:filter-status="store.setFilterStatus($event)"
        />
      </v-card-text>
    </v-card>

    <!-- Results count -->
    <div v-if="!store.loading && !store.error" class="mb-3 text-body-2 text-medium-emphasis">
      Showing {{ store.filteredRockets.length }} of {{ store.rockets.length }} rockets
    </div>

    <!-- Rocket List (Loading / Error / Success) -->
    <RocketList
      :rockets="store.filteredRockets"
      :loading="store.loading"
      :error="store.error"
      @retry="store.retryLoadRockets"
      @select="navigateToDetail"
    />
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import type { Rocket } from '@/types/rocket'
import RocketList from '@/components/RocketList.vue'
import RocketFilters from '@/components/RocketFilters.vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'

const store = useRocketStore()
const router = useRouter()

// Lifecycle: fetch rockets on mount (only if not already loaded)
onMounted(async () => {
  if (store.rockets.length === 0) {
    await store.loadRockets()
  }
})

function navigateToDetail(rocket: Rocket) {
  router.push(`/rockets/${rocket.id}`)
}

function handleAddRocket(data: Parameters<typeof store.addLocalRocket>[0]) {
  store.addLocalRocket(data)
}
</script>
