<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 mb-4">SpaceX Rockets</h1>
      </v-col>
    </v-row>

    <!-- Filter Section -->
    <v-row>
      <v-col cols="12">
        <RocketFilter
          v-model="rocketStore.searchQuery"
          :result-count="rocketStore.filteredRockets.length"
        />
      </v-col>
    </v-row>

    <!-- Add Rocket Button -->
    <v-row>
      <v-col cols="12" class="d-flex justify-end">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          size="large"
          @click="showAddDialog = true"
        >
          Add New Rocket
        </v-btn>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="rocketStore.loading" class="mt-4">
      <v-col cols="12" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        />
        <p class="mt-4">Loading rockets...</p>
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-row v-else-if="rocketStore.error" class="mt-4">
      <v-col cols="12">
        <v-alert
          type="error"
          variant="tonal"
          closable
          @click:close="rocketStore.clearError()"
        >
          <v-alert-title>Error Loading Rockets</v-alert-title>
          {{ rocketStore.error }}
          <template #append>
            <v-btn
              color="error"
              variant="outlined"
              class="ml-4"
              @click="loadRockets"
            >
              Retry
            </v-btn>
          </template>
        </v-alert>
      </v-col>
    </v-row>

    <!-- Rocket List -->
    <v-row v-else-if="rocketStore.filteredRockets.length > 0" class="mt-4">
      <v-col
        v-for="rocket in rocketStore.filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          hover
          class="rocket-card"
          @click="goToRocketDetail(rocket.id)"
        >
          <v-img
            :src="rocket.image_url || 'https://via.placeholder.com/400x300?text=No+Image'"
            height="200"
            cover
          >
            <template #error>
              <v-img
                src="https://via.placeholder.com/400x300?text=No+Image"
                height="200"
                cover
              />
            </template>
          </v-img>

          <v-card-title class="text-h6">
            {{ rocket.full_name }}
          </v-card-title>

          <v-card-text>
            <p class="text-truncate-3">
              {{ rocket.description || 'No description available' }}
            </p>
            <v-chip
              v-if="rocket.manufacturer"
              size="small"
              class="mt-2"
              prepend-icon="mdi-factory"
            >
              {{ rocket.manufacturer.country_code }}
            </v-chip>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="primary"
              variant="text"
              append-icon="mdi-arrow-right"
            >
              View Details
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- No Results -->
    <v-row v-else class="mt-4">
      <v-col cols="12" class="text-center">
        <v-icon size="64" color="grey">mdi-rocket-outline</v-icon>
        <p class="text-h6 mt-4">No rockets found</p>
        <p class="text-body-2">Try adjusting your search filters</p>
      </v-col>
    </v-row>

    <!-- Add Rocket Dialog -->
    <AddRocketDialog
      v-model="showAddDialog"
      @rocket-added="handleRocketAdded"
    />
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import AddRocketDialog from '@/components/AddRocketDialog.vue'
import RocketFilter from '@/components/RocketFilter.vue'

const router = useRouter()
const rocketStore = useRocketStore()
const showAddDialog = ref(false)

onMounted(async () => {
  await loadRockets()
})

async function loadRockets() {
  try {
    await rocketStore.fetchRockets()
  } catch (error) {
    // Error is handled in store
    console.error('Failed to load rockets:', error)
  }
}

function goToRocketDetail(id: number) {
  router.push(`/rockets/${id}`)
}

function handleRocketAdded() {
  showAddDialog.value = false
}
</script>

<style scoped>
.rocket-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s;
}

.rocket-card:hover {
  transform: translateY(-4px);
}

.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
