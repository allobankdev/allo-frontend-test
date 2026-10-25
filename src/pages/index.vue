<template>
  <v-container class="py-8 px-4 max-w-1200">
    <!-- Minimalist Page Header -->
    <header class="mb-8 pb-6 border-b-light d-flex flex-column flex-md-row justify-space-between align-start align-md-center ga-4">
      <div>
        <div class="d-flex align-center ga-2 mb-2">
          <span class="status-dot" />
          <span class="text-caption font-weight-bold text-uppercase tracking-wider text-slate-500">
            SpaceX Launch Vehicles
          </span>
        </div>
        <h1 class="text-h4 text-sm-h3 font-weight-bold text-slate-900 tracking-tight mb-2">
          Rockets Catalog
        </h1>
        <p class="text-body-1 text-slate-500 mb-0 max-w-600">
          Browse orbital launch vehicles developed by SpaceX, with live specs, cost estimates, and flight histories.
        </p>
      </div>

      <v-btn
        color="primary"
        size="large"
        rounded="lg"
        prepend-icon="mdi-plus"
        class="text-none font-weight-semibold px-5 action-btn"
        @click="isAddDialogOpen = true"
      >
        Add Rocket
      </v-btn>
    </header>

    <!-- Filter & Search Section -->
    <RocketFilter
      :initial-search="store.searchQuery"
      :initial-status="store.statusFilter"
      @update:search="onSearchChange"
      @update:status="onStatusChange"
    />

    <!-- Loading State -->
    <LoadingState v-if="store.loading" type="list" />

    <!-- Error State with Retry -->
    <ErrorState
      v-else-if="store.error"
      :message="store.error"
      @retry="refreshData"
    />

    <!-- Empty Filter Result State -->
    <div
      v-else-if="store.filteredRockets.length === 0"
      class="empty-state-container pa-12 text-center my-6 rounded-xl"
    >
      <div class="empty-icon-wrapper mb-3">
        <v-icon icon="mdi-magnify" size="28" color="secondary" />
      </div>
      <h3 class="text-h6 font-weight-bold text-slate-900 mb-1">No matching rockets</h3>
      <p class="text-body-2 text-slate-500 mb-4">
        We couldn't find any rockets matching "<span class="text-slate-900 font-weight-medium">{{ store.searchQuery }}</span>".
      </p>
      <v-btn
        variant="outlined"
        color="secondary"
        rounded="lg"
        size="small"
        class="text-none"
        prepend-icon="mdi-close"
        @click="resetFilters"
      >
        Clear filter
      </v-btn>
    </div>

    <!-- Rockets Grid State -->
    <div v-else>
      <div class="d-flex justify-space-between align-center mb-5 px-1">
        <span class="text-body-2 font-weight-medium text-slate-500">
          Showing <span class="text-slate-900 font-weight-bold">{{ store.filteredRockets.length }}</span> of {{ store.totalCount }} rockets
        </span>
        <v-btn
          variant="text"
          density="compact"
          size="small"
          prepend-icon="mdi-refresh"
          class="text-none font-weight-medium text-slate-600"
          @click="refreshData"
        >
          Refresh Data
        </v-btn>
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
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>
    </div>

    <!-- Add Rocket Dialog Modal -->
    <AddRocketDialog
      v-model="isAddDialogOpen"
      @submit="handleAddNewRocket"
    />

    <!-- Minimalist Toast Notification -->
    <v-snackbar
      v-model="showSnackbar"
      color="surface"
      location="bottom right"
      timeout="3500"
      rounded="lg"
      class="custom-snackbar"
    >
      <div class="d-flex align-center text-slate-900 py-1">
        <v-icon icon="mdi-check-circle" color="success" class="mr-2" size="20" />
        <span class="text-body-2 font-weight-medium">{{ snackbarMessage }}</span>
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'
import type { NewRocketInput } from '@/types/rocket'
import RocketCard from '@/components/RocketCard.vue'
import RocketFilter from '@/components/RocketFilter.vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const store = useRocketStore()

const isAddDialogOpen = ref(false)
const showSnackbar = ref(false)
const snackbarMessage = ref('')

onMounted(() => {
  store.fetchRockets()
})

function onSearchChange(query: string) {
  store.setSearchQuery(query)
}

function onStatusChange(status: 'all' | 'active' | 'inactive') {
  store.setStatusFilter(status)
}

function resetFilters() {
  store.setSearchQuery('')
  store.setStatusFilter('all')
}

function refreshData() {
  store.fetchRockets(true)
}

function handleAddNewRocket(newRocketInput: NewRocketInput) {
  const created = store.addNewRocket(newRocketInput)
  snackbarMessage.value = `"${created.full_name}" added to fleet.`
  showSnackbar.value = true
}
</script>

<style scoped>
.border-b-light {
  border-bottom: 1px solid #e2e8f0;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #059669;
}

.tracking-wider {
  letter-spacing: 0.05em;
}

.tracking-tight {
  letter-spacing: -0.025em;
}

.max-w-600 {
  max-width: 600px;
}

.action-btn {
  background-color: #0f172a !important;
  color: #ffffff !important;
}

.empty-state-container {
  background-color: #ffffff;
  border: 1px dashed #cbd5e1;
}

.empty-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: #f1f5f9;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.custom-snackbar :deep(.v-snackbar__wrapper) {
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style>
