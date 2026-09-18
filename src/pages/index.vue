<template>
  <v-container
    fluid
    class="py-6 px-4 px-md-6"
  >
    <!-- Header Hero Banner -->
    <div class="mb-8 text-center text-md-start d-md-flex align-center justify-space-between">
      <div>
        <div class="d-flex align-center justify-center justify-md-start mb-2">
          <v-icon
            icon="mdi-rocket-launch-outline"
            color="primary"
            size="32"
            class="mr-2"
          />
          <span class="text-overline text-primary font-weight-bold letter-spacing-1">SpaceX Launch Vehicles</span>
        </div>
        <h1 class="text-h4 text-md-h3 font-weight-black">
          Rocket Explorer
        </h1>
        <p
          class="text-body-1 text-medium-emphasis mt-2"
          style="max-width: 600px;"
        >
          Browse SpaceX rocket configurations, cost per launch, operational status, and flight statistics.
        </p>
      </div>

      <div class="mt-4 mt-md-0 d-flex justify-center justify-md-end">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          size="large"
          elevation="3"
          rounded="lg"
          class="text-none font-weight-bold"
          @click="isAddDialogOpen = true"
        >
          Add New Rocket
        </v-btn>
      </div>
    </div>

    <!-- UI State 1: Loading -->
    <StateLoading
      v-if="store.status === 'loading'"
      title="Loading SpaceX Fleet..."
      subtitle="Connecting to Launch Library 2 API"
    />

    <!-- UI State 2: Error / Retry -->
    <StateError
      v-else-if="store.status === 'error'"
      :message="store.errorMessage"
      @retry="store.loadRockets(true)"
    />

    <!-- UI State 3: Success -->
    <div v-else>
      <!-- Filter & Search Controls -->
      <RocketFilter
        :search-query="store.searchQuery"
        :family-filter="store.familyFilter"
        :families="store.availableFamilies"
        :current-count="store.filteredRockets.length"
        :total-count="store.allRockets.length"
        @update:search-query="store.setSearchQuery"
        @update:family-filter="store.setFamilyFilter"
        @open-add-dialog="isAddDialogOpen = true"
        @reset-filter="resetFilters"
      />

      <!-- Empty Filter State -->
      <v-sheet
        v-if="store.filteredRockets.length === 0"
        class="pa-12 text-center rounded-2xl"
        elevation="1"
        border
      >
        <v-icon
          icon="mdi-magnify-remove-outline"
          size="64"
          color="medium-emphasis"
          class="mb-3"
        />
        <h3 class="text-h6 font-weight-bold mb-2">
          No matching rockets found
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          Try adjusting your search keywords or clearing active filters.
        </p>
        <v-btn
          variant="outlined"
          color="primary"
          class="text-none font-weight-medium"
          prepend-icon="mdi-refresh"
          @click="resetFilters"
        >
          Reset Filters
        </v-btn>
      </v-sheet>

      <!-- Rocket Grid -->
      <v-row v-else>
        <v-col
          v-for="rocket in store.filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          lg="4"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>
    </div>

    <!-- Add Rocket Dialog Modal -->
    <RocketAddDialog
      v-model="isAddDialogOpen"
      @add-rocket="handleAddRocket"
    />

    <!-- Success Snackbar Notification -->
    <v-snackbar
      v-model="showSnackbar"
      color="success"
      location="top"
      :timeout="3500"
      rounded="pill"
    >
      <div class="d-flex align-center">
        <v-icon
          icon="mdi-check-circle"
          class="mr-2"
        />
        <span>{{ snackbarText }}</span>
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'
import type { NewRocketPayload } from '@/types/rocket'
import RocketCard from '@/components/RocketCard.vue'
import RocketFilter from '@/components/RocketFilter.vue'
import RocketAddDialog from '@/components/RocketAddDialog.vue'
import StateLoading from '@/components/StateLoading.vue'
import StateError from '@/components/StateError.vue'

const store = useRocketStore()

const isAddDialogOpen = ref(false)
const showSnackbar = ref(false)
const snackbarText = ref('')

function handleAddRocket(payload: NewRocketPayload) {
  const newRocket = store.addRocket(payload)
  snackbarText.value = `Rocket "${newRocket.full_name}" added successfully!`
  showSnackbar.value = true
}

function resetFilters() {
  store.setSearchQuery('')
  store.setFamilyFilter('All')
}

onMounted(() => {
  // Trigger initial fetch when component mounts
  store.loadRockets()
})
</script>

<style scoped>
.letter-spacing-1 {
  letter-spacing: 1px;
}
</style>
