<template>
  <div>
    <!-- Top Navbar -->
    <AppNavbar @open-add-dialog="isAddModalOpen = true" />

    <v-container
      class="py-6 py-md-10"
      max-width="1280"
    >
      <!-- Hero / Section Header -->
      <div class="mb-6 mb-md-8">
        <div class="d-flex flex-column flex-md-row align-md-center justify-space-between ga-4 mb-4">
          <div>
            <div class="d-flex align-center ga-2 mb-1">
              <span class="pulse-indicator" />
              <span
                class="text-caption font-mono text-primary text-uppercase"
                style="letter-spacing: 1.5px;"
              >
                LL2 API v2.2.0 Telemetry Feed
              </span>
            </div>
            <h1
              class="text-h4 text-md-h3 font-weight-black text-high-emphasis text-uppercase"
              style="letter-spacing: 1px;"
            >
              Launch Vehicles
            </h1>
            <p class="text-body-1 text-secondary mt-1">
              SpaceX orbital and suborbital rocket configurations, historical variants, and experimental prototypes.
            </p>
          </div>

          <div class="d-flex align-center ga-3">
            <v-chip
              color="surface-variant"
              variant="flat"
              class="font-mono text-caption px-3 py-1"
              rounded="sm"
            >
              <v-icon
                icon="mdi-database-check"
                start
                size="14"
                color="primary"
              />
              {{ store.isLoading ? 'SYNCING...' : `${store.filteredRockets.length} VEHICLES` }}
            </v-chip>

            <v-btn
              color="primary"
              variant="flat"
              prepend-icon="mdi-plus"
              class="text-none font-weight-bold d-sm-none"
              rounded="sm"
              @click="isAddModalOpen = true"
            >
              Add Rocket
            </v-btn>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <RocketFilter />
      </div>

      <!-- State: Loading Skeleton Grid -->
      <v-row
        v-if="store.isLoading"
        dense
        class="ga-y-4"
      >
        <v-col
          v-for="n in 6"
          :key="n"
          cols="12"
          sm="6"
          lg="4"
          class="d-flex"
        >
          <RocketCardSkeleton />
        </v-col>
      </v-row>

      <!-- State: Error with Retry -->
      <StatusState
        v-else-if="store.error"
        type="error"
        title="Failed to Retrieve Fleet Telemetry"
        :message="store.error"
        @retry="store.fetchRockets(true)"
      />

      <!-- State: Empty Search Result -->
      <StatusState
        v-else-if="store.filteredRockets.length === 0"
        type="empty"
        :search-query="store.searchQuery"
        @reset="store.clearFilters"
      />

      <!-- State: Success Rocket Grid -->
      <v-row
        v-else
        dense
        class="ga-y-4"
      >
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
    </v-container>

    <!-- Add Rocket Dialog Modal -->
    <AddRocketModal
      v-model="isAddModalOpen"
      @rocket-added="handleRocketAdded"
    />

    <!-- Feedback Notification Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      color="surface"
      timeout="4000"
      location="bottom end"
      class="border"
      style="border-color: rgba(56, 189, 248, 0.4) !important;"
    >
      <div class="d-flex align-center">
        <v-icon
          icon="mdi-check-circle"
          color="primary"
          class="me-2"
        />
        <span class="text-body-2 font-weight-medium">{{ snackbar.message }}</span>
      </div>
      <template #actions>
        <v-btn
          color="primary"
          variant="text"
          size="small"
          @click="snackbar.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'
import AppNavbar from '@/components/AppNavbar.vue'
import RocketCard from '@/components/RocketCard.vue'
import RocketCardSkeleton from '@/components/RocketCardSkeleton.vue'
import RocketFilter from '@/components/RocketFilter.vue'
import StatusState from '@/components/StatusState.vue'
import AddRocketModal from '@/components/AddRocketModal.vue'

const store = useRocketStore()
const isAddModalOpen = ref(false)

const snackbar = reactive({
  show: false,
  message: '',
})

onMounted(() => {
  store.fetchRockets()
})

function handleRocketAdded(name: string) {
  snackbar.message = `Rocket "${name}" successfully registered to fleet.`
  snackbar.show = true
}
</script>

<style scoped>
.pulse-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #38bdf8;
  box-shadow: 0 0 8px #38bdf8;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 8px rgba(56, 189, 248, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(56, 189, 248, 0);
  }
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
}
</style>
