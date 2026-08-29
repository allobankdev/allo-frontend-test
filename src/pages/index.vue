<template>
  <v-container>
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4">Rocket List</h1>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        @click="showAddDialog = true"
      >
        Add Rocket
      </v-btn>
    </div>

    <v-text-field
      v-model="searchQuery"
      label="Filter Rockets"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      clearable
      class="mb-4"
      @update:model-value="handleFilterChange"
    />

    <LoadingState v-if="store.isLoading" message="Loading rockets..." />

    <ErrorState
      v-else-if="store.error"
      :message="store.error"
      @retry="handleRetry"
    />

    <v-row v-else-if="store.filteredRockets.length > 0">
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

    <div
      v-else
      class="d-flex justify-center align-center"
      style="min-height: 400px;"
    >
      <div class="text-center">
        <v-icon size="64" color="grey" class="mb-4">mdi-rocket-launch</v-icon>
        <div class="text-h6">No rockets found</div>
        <div class="text-body-2 text-medium-emphasis mt-2">
          Try adjusting your filter or add a new rocket
        </div>
      </div>
    </div>

    <AddRocketDialog
      v-model="showAddDialog"
      @submit="handleAddRocket"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRocketStore } from '@/stores/rocket'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import RocketCard from '@/components/RocketCard.vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'
import type { RocketFormData } from '@/types/rocket'

const store = useRocketStore()
const searchQuery = ref('')
const showAddDialog = ref(false)

// Lifecycle hook - fetch rockets when component is mounted
onMounted(async () => {
  if (store.rockets.length === 0) {
    try {
      await store.fetchRockets()
    } catch (error) {
      console.error('Failed to fetch rockets:', error)
    }
  }
})

function handleFilterChange(value: string | null) {
  store.setFilter(value || '')
  searchQuery.value = value || ''
}

function handleRetry() {
  store.clearError()
  store.fetchRockets()
}

function handleAddRocket(rocketData: RocketFormData) {
  store.addRocket(rocketData)
  // Reset filter to show the newly added rocket
  store.setFilter('')
  searchQuery.value = ''
}
</script>
