<template>
  <v-container class="py-8">
    <!-- Header and search section -->
    <div class="d-flex flex-column flex-md-row justify-space-between align-md-end mb-6">
      <div class="mb-4 mb-md-0">
        <h1 class="text-h4 font-weight-bold text-grey-darken-4">SpaceX Fleet</h1>
        <p class="text-body-1 text-grey-darken-1">Explore our orbital launch vehicles.</p>
      </div>
      
      <!-- Filter Controls connected to Pinia Store -->
      <div class="d-flex flex-column flex-sm-row gap-4 align-sm-center" style="width: 100%; max-width: 700px;">
        <v-text-field
          v-model="store.searchQuery"
          prepend-inner-icon="mdi-magnify"
          label="Search rockets..."
          variant="outlined"
          density="comfortable"
          hide-details
          class="flex-grow-1"
        ></v-text-field>
        
        <v-select
          v-model="store.statusFilter"
          :items="[
            { title: 'All Status', value: 'all' },
            { title: 'Active Only', value: 'active' },
            { title: 'Inactive Only', value: 'inactive' }
          ]"
          item-title="title"
          item-value="value"
          variant="outlined"
          density="comfortable"
          hide-details
          style="min-width: 150px; max-width: 180px;"
        ></v-select>

        <v-btn
          color="blue-darken-3"
          prepend-icon="mdi-plus"
          height="48"
          class="text-none font-weight-bold rounded-lg px-6"
          @click="isModalOpen = true"
        >
          Add Rocket
        </v-btn>
      </div>
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
      @submit="store.addSimulatedRocket" 
    />
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'
import RocketCard from '@/components/RocketCard.vue'
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import AddRocketModal from '@/components/AddRocketModal.vue'

// Initialize state manager
const store = useRocketStore()

// State for Modal
const isModalOpen = ref(false)

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
