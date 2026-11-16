<template>
  <div class="rocket-list-page">
    <v-container
      class="py-6"
      style="max-width: 1200px"
    >
      <div class="d-flex align-center justify-space-between flex-wrap ga-4 mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold mb-1">
            SpaceX Rockets
          </h1>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Daftar roket SpaceX dan spesifikasi peluncurannya.
          </p>
        </div>
        <div>
          <v-btn
            color="primary"
            variant="elevated"
            prepend-icon="mdi-plus"
            class="font-weight-bold"
            @click="isAddModalOpen = true"
          >
            Add Rocket
          </v-btn>
        </div>
      </div>

      <RocketFilter />

      <div class="d-flex align-center justify-space-between mb-4 px-1">
        <div class="text-subtitle-2 text-medium-emphasis d-flex align-center">
          <span>Showing {{ store.filteredRockets.length }} of {{ store.allRockets.length }} rockets</span>
          <v-chip
            v-if="store.customRockets.length > 0"
            size="x-small"
            color="info"
            variant="tonal"
            class="ml-2"
          >
            {{ store.customRockets.length }} Custom
          </v-chip>
        </div>

        <v-btn
          v-if="store.searchQuery || store.filterActive !== 'all'"
          variant="text"
          color="primary"
          size="x-small"
          prepend-icon="mdi-close"
          @click="store.clearFilters"
        >
          Reset Filters
        </v-btn>
      </div>

      <LoadingSkeleton
        v-if="store.loading"
        :count="6"
      />

      <ErrorAlert
        v-else-if="store.error"
        :message="store.error"
        :loading="store.loading"
        @retry="store.fetchRockets(true)"
      />

      <EmptyState
        v-else-if="store.filteredRockets.length === 0"
        :title="store.allRockets.length === 0 ? 'No rockets available' : 'No matching rockets'"
        :message="store.allRockets.length === 0 ? 'Could not find any rocket records.' : 'No rockets matched your current search filters.'"
        @reset="store.clearFilters"
      >
        <div class="d-flex justify-center ga-3 mt-4">
          <v-btn
            v-if="store.searchQuery || store.filterActive !== 'all'"
            variant="tonal"
            color="primary"
            @click="store.clearFilters"
          >
            Clear Filters
          </v-btn>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click="isAddModalOpen = true"
          >
            Add a Rocket
          </v-btn>
        </div>
      </EmptyState>

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
    </v-container>

    <RocketAddDialog
      v-model="isAddModalOpen"
      @created="onRocketCreated"
    />

    <v-snackbar
      v-model="showSnackbar"
      color="success"
      location="top right"
      timeout="3500"
    >
      {{ snackbarText }}
      <template #actions>
        <v-btn
          variant="text"
          size="small"
          @click="showSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRocketStore } from '@/stores/rockets'

const store = useRocketStore()

const isAddModalOpen = ref(false)
const showSnackbar = ref(false)
const snackbarText = ref('')

onMounted(() => {
  store.fetchRockets()
})

const onRocketCreated = () => {
  snackbarText.value = 'Rocket created and added to fleet successfully!'
  showSnackbar.value = true
}
</script>
