<template>
  <div>
    <!-- Page Header & Statistics Banner -->
    <div class="mb-6">
      <div class="d-flex flex-column flex-sm-row justify-space-between align-sm-center ga-3 mb-2">
        <div>
          <h1 class="text-h4 font-weight-bold text-high-emphasis">
            SpaceX Launch Vehicles
          </h1>
          <p class="text-body-1 text-medium-emphasis">
            Explore orbital launchers, active rockets, and historic prototypes developed by SpaceX.
          </p>
        </div>

        <div class="d-flex ga-2 align-center">
          <v-chip
            color="primary"
            variant="tonal"
            size="default"
            class="font-weight-bold"
          >
            {{ store.totalCount }} Total Rockets
          </v-chip>
        </div>
      </div>
    </div>

    <!-- UI State: Loading -->
    <StateLoading
      v-if="store.loading"
      title="Retrieving Rocket Fleet..."
      message="Fetching launch vehicle configurations from SpaceX database"
    />

    <!-- UI State: Fail / Retry -->
    <StateError
      v-else-if="store.error && !store.hasRockets"
      :message="store.error"
      title="Unable to Load SpaceX Rockets"
      @retry="store.retry"
    />

    <!-- UI State: Success -->
    <div v-else>
      <!-- Filter Bar -->
      <RocketFilter
        :search-query="store.searchQuery"
        :status-filter="store.statusFilter"
        :total-count="store.totalCount"
        :filtered-count="store.filteredCount"
        @update:search-query="store.setSearchQuery"
        @update:status-filter="store.setStatusFilter"
        @open-add-dialog="isAddDialogOpen = true"
      />

      <!-- Notification if inline error occurred during background refresh -->
      <v-alert
        v-if="store.error && store.hasRockets"
        type="warning"
        variant="tonal"
        closable
        class="mb-4"
      >
        {{ store.error }}
      </v-alert>

      <!-- Empty Filter State -->
      <StateEmpty
        v-if="store.filteredRockets.length === 0"
        title="No Matching Rockets Found"
        message="No rockets match your current search criteria. Try a different query or reset your filters."
        @reset="store.clearFilters"
      />

      <!-- Rocket Cards Grid -->
      <RocketList
        v-else
        :rockets="store.filteredRockets"
      />
    </div>

    <!-- Add Rocket Dialog Modal -->
    <AddRocketDialog
      v-model="isAddDialogOpen"
      @submit="handleAddRocket"
    />

    <!-- Success Feedback Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      color="success"
      location="bottom end"
      :timeout="4000"
    >
      <div class="d-flex align-center">
        <v-icon
          icon="mdi-check-circle-outline"
          class="mr-2"
        />
        <span>{{ snackbar.message }}</span>
      </div>
      <template #actions>
        <v-btn
          variant="text"
          size="small"
          @click="snackbar.show = false"
        >
          Dismiss
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import StateLoading from '@/components/common/StateLoading.vue'
import StateError from '@/components/common/StateError.vue'
import StateEmpty from '@/components/common/StateEmpty.vue'
import RocketFilter from '@/components/rockets/RocketFilter.vue'
import RocketList from '@/components/rockets/RocketList.vue'
import AddRocketDialog from '@/components/rockets/AddRocketDialog.vue'
import { useRocketStore } from '@/stores/useRocketStore'
import type { CreateRocketDto } from '@/types/rocket'

const store = useRocketStore()

const isAddDialogOpen = ref(false)

const snackbar = reactive({
  show: false,
  message: '',
})

// Lifecycle: Fetch rockets on page mount
onMounted(() => {
  store.fetchRockets()
})

function handleAddRocket (dto: CreateRocketDto) {
  const created = store.addRocket(dto)
  snackbar.message = `Successfully created custom rocket "${created.fullName}"!`
  snackbar.show = true
}
</script>
