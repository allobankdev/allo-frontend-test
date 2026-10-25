<template>
  <div class="rocket-list-page">
    <AppNavbar>
      <template #actions>
        <RocketAddDialog @created="handleRocketCreated" />
      </template>
    </AppNavbar>

    <v-container class="py-8 px-4 px-md-8" max-width="1280">
      <!-- Header Banner -->
      <div class="mb-6">
        <div class="d-flex flex-column flex-md-row justify-space-between align-md-center gap-4">
          <div>
            <h1 class="text-h4 font-weight-black mb-2 text-white">SpaceX Rocket Catalog</h1>
            <p class="text-subtitle-1 text-medium-emphasis">
              Explore SpaceX launch vehicles, specifications, flight history, and launch details powered by Launch Library 2.
            </p>
          </div>
          <div class="d-flex align-center gap-2">
            <v-btn
              variant="outlined"
              color="primary"
              prepend-icon="mdi-refresh"
              :loading="store.loading"
              class="text-none"
              @click="store.fetchRockets(true)"
            >
              Refresh
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Filter Component -->
      <RocketFilter />

      <!-- UI States -->
      <!-- 1. Loading State -->
      <LoadingState
        v-if="store.loading"
        message="Fetching SpaceX rocket configurations from Launch Library 2..."
      />

      <!-- 2. Error State -->
      <ErrorState
        v-else-if="store.error"
        :message="store.error"
        @retry="store.fetchRockets(true)"
      />

      <!-- 3. Empty State (No search results) -->
      <div
        v-else-if="store.filteredRockets.length === 0"
        class="text-center py-12"
      >
        <v-icon icon="mdi-rocket-launch-outline" size="64" color="medium-emphasis" class="mb-3" />
        <h3 class="text-h6 font-weight-bold mb-1 text-white">No Rockets Found</h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          No launch vehicle matches your current filter criteria.
        </p>
        <v-btn
          color="primary"
          variant="tonal"
          prepend-icon="mdi-filter-off"
          class="text-none"
          @click="resetFilters"
        >
          Clear Filters
        </v-btn>
      </div>

      <!-- 4. Success State (Rockets Grid) -->
      <div v-else>
        <div class="d-flex justify-space-between align-center mb-4">
          <span class="text-subtitle-2 font-weight-bold text-medium-emphasis">
            Showing {{ store.filteredRockets.length }} of {{ store.allRockets.length }} rockets
          </span>
        </div>

        <v-row>
          <v-col
            v-for="rocket in store.filteredRockets"
            :key="rocket.id"
            cols="12"
            sm="6"
            lg="4"
            class="d-flex"
          >
            <RocketCard
              :rocket="rocket"
              @click="goToDetail"
            />
          </v-col>
        </v-row>
      </div>
    </v-container>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3500"
      location="bottom right"
    >
      {{ snackbar.text }}
      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocket'
import AppNavbar from '@/components/AppNavbar.vue'
import RocketCard from '@/components/RocketCard.vue'
import RocketFilter from '@/components/RocketFilter.vue'
import RocketAddDialog from '@/components/RocketAddDialog.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const router = useRouter()
const store = useRocketStore()

const snackbar = reactive({
  show: false,
  text: '',
  color: 'success',
})

onMounted(() => {
  store.fetchRockets()
})

function goToDetail(id: string | number) {
  router.push(`/rockets/${id}`)
}

function resetFilters() {
  store.searchQuery = ''
  store.statusFilter = 'all'
  store.familyFilter = 'all'
}

function handleRocketCreated() {
  snackbar.text = 'New rocket added successfully!'
  snackbar.color = 'success'
  snackbar.show = true
}
</script>

<style scoped>
.rocket-list-page {
  min-height: 100vh;
  background-color: #0a0d14;
}

.gap-2 {
  gap: 8px;
}

.gap-4 {
  gap: 16px;
}
</style>
