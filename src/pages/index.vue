<template>
  <v-container class="py-8">
    <!-- Header and search section -->
    <div class="d-flex flex-column flex-md-row justify-space-between align-md-end mb-6">
      <div class="mb-4 mb-md-0">
        <h1 class="text-h4 font-weight-bold text-grey-darken-4">SpaceX Fleet</h1>
        <p class="text-body-1 text-grey-darken-1">Explore our orbital launch vehicles.</p>
      </div>
      
      <!-- Component Extracted: RocketFilterBar -->
      <RocketFilterBar @open-modal="isModalOpen = true" />
    </div>

    <!-- UI State: Loading -->
    <LoadingSkeleton v-if="store.isLoading" :count="4" />

    <!-- UI State: Error -->
    <ErrorState v-else-if="store.isError" :message="store.isError" @retry="store.fetchRockets" />

    <!-- UI State: Success (Data Grid) -->
    <template v-else>
      <v-row v-if="store.filteredRockets.length > 0">
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>
      
      <!-- Empty state if search yields no results -->
      <v-row v-else>
        <v-col cols="12" class="text-center py-12">
          <v-icon color="grey-lighten-1" size="80" class="mb-4">mdi-rocket-off-outline</v-icon>
          <h3 class="text-h5 text-grey-darken-1 font-weight-medium">No rockets found</h3>
          <p class="text-body-1 text-grey-darken-2 mt-2">Try adjusting your search or filters.</p>
        </v-col>
      </v-row>
    </template>
    <!-- Modal Form for Adding Rocket -->
    <AddRocketModal 
      v-model="isModalOpen" 
      @submit="handleRocketAdded" 
    />

    <!-- Global Optimistic UI Success Notification -->
    <v-snackbar
      v-model="showSnackbar"
      color="success"
      location="bottom right"
      :timeout="3000"
    >
      <div class="d-flex align-center">
        <v-icon icon="mdi-check-circle" class="mr-2"></v-icon>
        <strong>Success!</strong>&nbsp;Rocket successfully deployed to fleet.
      </div>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'
import type { RocketDTO } from '@/types/rocket'
import RocketCard from '@/components/RocketCard.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import AddRocketModal from '@/components/AddRocketModal.vue'
import RocketFilterBar from '@/components/RocketFilterBar.vue'

// Initialize state manager
const store = useRocketStore()

// State for Modal and Notification
const isModalOpen = ref(false)
const showSnackbar = ref(false)

// Handle Optimistic UI submission
const handleRocketAdded = (rocketData: Partial<RocketDTO>) => {
  store.addSimulatedRocket(rocketData)
  showSnackbar.value = true // Show success feedback!
}

// Lifecycle Hook
onMounted(() => {
  store.fetchRockets()
})
</script>

<style scoped>
/* Utility gap for flex layouts */
.gap-4 {
  gap: 16px;
}
</style>
