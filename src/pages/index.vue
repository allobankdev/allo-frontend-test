<template>
  <div class="blueprint-grid-bg min-vh-100 pb-12">
    <!-- Navigation Deck -->
    <AppNavbar @open-add-dialog="isAddModalOpen = true" />

    <v-container
      class="py-6 py-md-10"
      max-width="1280"
    >
      <!-- Telemetry Dashboard Header -->
      <section class="mb-8">
        <div class="d-flex flex-column flex-md-row align-md-end justify-space-between ga-4 mb-6">
          <div>
            <div class="font-mono text-caption text-secondary text-uppercase mb-1 tracking-wider">
              SpaceX Orbital Fleet // Flight Configuration Directory
            </div>
            <h1 class="text-h4 text-md-h3 font-weight-bold tracking-tight text-high-emphasis">
              Launch Vehicle Manifest
            </h1>
            <p class="text-body-1 text-secondary mt-1 max-w-text">
              Primary booster configurations, upper-stage vehicle variants, and orbital test articles documented via the Launch Library telemetry pipeline.
            </p>
          </div>

          <!-- Quick Registration Action for Mobile -->
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-plus"
            class="d-sm-none font-weight-bold"
            rounded="sm"
            @click="isAddModalOpen = true"
          >
            Register Vehicle
          </v-btn>
        </div>

        <!-- Telemetry KPI Strip -->
        <div class="telemetry-strip d-grid mb-6">
          <div class="kpi-cell">
            <span class="kpi-label font-mono">Total Vehicles</span>
            <span class="kpi-value font-mono">{{ store.isLoading ? '--' : store.metrics.total }}</span>
          </div>
          <div class="kpi-cell">
            <span class="kpi-label font-mono">Active Fleet</span>
            <span class="kpi-value font-mono text-success">{{ store.isLoading ? '--' : store.metrics.active }}</span>
          </div>
          <div class="kpi-cell">
            <span class="kpi-label font-mono">Reusable Hardware</span>
            <span class="kpi-value font-mono text-primary">{{ store.isLoading ? '--' : store.metrics.reusable }}</span>
          </div>
          <div class="kpi-cell">
            <span class="kpi-label font-mono">User Registered</span>
            <span class="kpi-value font-mono text-accent">{{ store.isLoading ? '--' : store.metrics.custom }}</span>
          </div>
        </div>

        <!-- Filter & Search Console -->
        <RocketFilter />
      </section>

      <!-- State: Loading Skeletons -->
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

      <!-- State: Error with Retry Action -->
      <StatusState
        v-else-if="store.error"
        type="error"
        title="Telemetry Pipeline Interrupted"
        :message="store.error"
        @retry="store.fetchRockets(true)"
      />

      <!-- State: Empty Filter Result with Reset -->
      <StatusState
        v-else-if="store.filteredRockets.length === 0"
        type="empty"
        :search-query="store.searchQuery"
        @reset="store.clearFilters"
      />

      <!-- State: Success Flight Grid -->
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

    <!-- Vehicle Registration Modal -->
    <AddRocketModal
      v-model="isAddModalOpen"
      @rocket-added="handleRocketAdded"
    />

    <!-- Feedback Notification -->
    <v-snackbar
      v-model="snackbar.show"
      color="surface"
      timeout="4000"
      location="bottom end"
      class="border"
      style="border-color: var(--lox-cyan) !important;"
    >
      <div class="d-flex align-center">
        <v-icon
          icon="mdi-check-decagram"
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
          Dismiss
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
  snackbar.message = `Vehicle "${name}" registered into manifest.`
  snackbar.show = true
}
</script>

<style scoped>
.tracking-tight {
  letter-spacing: -0.5px;
}

.tracking-wider {
  letter-spacing: 1px;
}

.max-w-text {
  max-width: 68ch;
}

.telemetry-strip {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (min-width: 768px) {
  .telemetry-strip {
    grid-template-columns: repeat(4, 1fr);
  }
}

.kpi-cell {
  background: var(--console-surface);
  border: 1px solid var(--titanium-border);
  padding: 12px 16px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}

.kpi-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  color: var(--text-mid);
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.kpi-value {
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.2;
}
</style>
