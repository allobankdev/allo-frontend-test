<template>
  <div class="rocket-list-page">
    <v-container class="py-6">
      <div class="page-header mb-8">
        <div class="d-flex justify-space-between align-center flex-wrap gap-4">
          <div>
            <h1 class="text-h3 font-weight-light mb-2">Rockets</h1>
            <p class="text-body-2 text-medium-emphasis">
              Explore SpaceX rockets and add your own
            </p>
          </div>
          <v-btn
            prepend-icon="mdi-plus"
            variant="outlined"
            size="large"
            class="add-rocket-btn"
            @click="showAddDialog = true"
          >
            Add Rocket
          </v-btn>
        </div>
      </div>

      <div class="filter-section mb-6">
        <RocketFilter />
      </div>

      <div v-if="rocketStore.isLoading" class="loading-container">
        <LoadingState />
      </div>

      <div v-else-if="rocketStore.isError" class="error-container">
        <ErrorState
          :message="rocketStore.error || 'Failed to load rockets'"
          @retry="handleRetry"
        />
      </div>

      <div v-else-if="rocketStore.isSuccess">
        <div
          v-if="rocketStore.filteredRockets.length === 0"
          class="empty-state text-center py-16"
        >
          <v-icon size="48" color="grey-lighten-1" class="mb-4">
            mdi-rocket-launch
          </v-icon>
          <p class="text-body-1 text-medium-emphasis">No rockets found</p>
        </div>
        <div v-else class="rockets-grid">
          <RocketCard
            v-for="rocket in rocketStore.filteredRockets"
            :key="rocket.id"
            :rocket="rocket"
            @click="handleRocketClick(rocket.id)"
          />
        </div>
      </div>

      <AddRocketDialog v-model="showAddDialog" />
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocket'
import RocketCard from '@/components/RocketCard.vue'
import RocketFilter from '@/components/RocketFilter.vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const router = useRouter()
const rocketStore = useRocketStore()
const showAddDialog = ref(false)

onMounted(async () => {
  // Clear any previous error state when returning to list
  if (rocketStore.isError) {
    rocketStore.clearError()
  }
  
  if (rocketStore.rockets.length === 0) {
    await rocketStore.loadRockets()
  }
})

function handleRetry() {
  rocketStore.loadRockets()
}

function handleRocketClick(id: string) {
  router.push(`/rockets/${id}`)
}
</script>

<style scoped>
.rocket-list-page {
  min-height: 100vh;
  background: rgb(var(--v-theme-surface));
}

.page-header {
  max-width: 1200px;
  margin: 0 auto;
}

.filter-section {
  max-width: 1200px;
  margin: 0 auto;
}

.rockets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.loading-container,
.error-container {
  max-width: 1200px;
  margin: 0 auto;
}

.empty-state {
  max-width: 1200px;
  margin: 0 auto;
}

.add-rocket-btn {
  border-width: 1.5px;
  text-transform: none;
  letter-spacing: normal;
  border-radius: 8px;
}

@media (max-width: 600px) {
  .rockets-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
