<template>
  <v-container
    fluid
    class="pa-4 pa-md-6"
  >
    <!-- Header -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between gap-4">
          <div>
            <h1 class="text-h4 text-md-h3 font-weight-bold">
              <v-icon
                class="mr-2"
                color="primary"
              >
                mdi-rocket-launch
              </v-icon>
              SpaceX Rockets
            </h1>
            <p class="text-body-1 text-medium-emphasis mt-1">
              Explore all SpaceX rockets and their specifications
            </p>
          </div>
          <AddRocketDialog @added="handleRocketAdded" />
        </div>
      </v-col>
    </v-row>

    <!-- Filter -->
    <v-row class="mb-4">
      <v-col
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-text-field
          v-model="searchQuery"
          label="Search rockets"
          placeholder="Search by name or description..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          clearable
          hide-details
          @update:model-value="handleSearch"
        />
      </v-col>
      <v-col
        cols="6"
        sm="3"
        md="2"
        lg="2"
      >
        <v-select
          v-model="statusFilter"
          :items="statusOptions"
          label="Status"
          variant="outlined"
          density="comfortable"
          hide-details
          @update:model-value="applyFilters"
        />
      </v-col>
      <v-col
        cols="6"
        sm="3"
        md="2"
        lg="2"
      >
        <v-select
          v-model="countryFilter"
          :items="countryOptions"
          label="Country"
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
          @update:model-value="applyFilters"
        />
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="4"
        lg="5"
        class="d-flex align-center gap-2"
      >
        <v-chip
          v-if="hasActiveFilters"
          color="primary"
          variant="tonal"
          size="small"
        >
          Showing {{ rocketsStore.filteredRockets.length }} of {{ rocketsStore.allRockets.length }} rockets
        </v-chip>
        <v-btn
          v-if="hasActiveFilters"
          variant="text"
          size="small"
          color="primary"
          @click="clearFilters"
        >
          Clear filters
        </v-btn>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <LoadingState
      v-if="rocketsStore.loading"
      message="Loading rockets..."
    />

    <!-- Error State -->
    <ErrorState
      v-else-if="rocketsStore.error"
      :message="rocketsStore.error"
      @retry="loadRockets"
    />

    <!-- Empty State -->
    <v-row
      v-else-if="rocketsStore.filteredRockets.length === 0"
      justify="center"
    >
      <v-col
        cols="12"
        class="text-center py-12"
      >
        <v-icon
          size="80"
          color="grey"
          class="mb-4"
        >
          mdi-rocket-outline
        </v-icon>
        <h2 class="text-h5 mb-2">
          No rockets found
        </h2>
        <p class="text-body-1 text-medium-emphasis">
          {{ hasActiveFilters ? 'Try adjusting your filter criteria' : 'No rockets available' }}
        </p>
      </v-col>
    </v-row>

    <!-- Rocket Grid -->
    <v-row v-else>
      <v-col
        v-for="rocket in rocketsStore.filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.message }}
      <template #actions>
        <v-btn
          variant="text"
          @click="snackbar.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRocketsStore } from '@/stores/rockets'

const rocketsStore = useRocketsStore()
const searchQuery = ref('')
const statusFilter = ref('all')
const countryFilter = ref<string | null>(null)

const statusOptions = [
  { title: 'All', value: 'all' },
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
]

const countryOptions = computed(() => {
  const countries = new Set(rocketsStore.allRockets.map((r) => r.country))
  return Array.from(countries).sort()
})

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value ||
    statusFilter.value !== 'all' ||
    countryFilter.value
  )
})

const snackbar = reactive({
  show: false,
  message: '',
  color: 'success',
})

async function loadRockets() {
  try {
    await rocketsStore.fetchRockets()
  } catch {
    // Error is handled by the store
  }
}

function applyFilters() {
  rocketsStore.setFilters({
    query: searchQuery.value,
    status: statusFilter.value,
    country: countryFilter.value,
  })
}

function handleSearch(value: string | null) {
  searchQuery.value = value || ''
  applyFilters()
}

function clearFilters() {
  searchQuery.value = ''
  statusFilter.value = 'all'
  countryFilter.value = null
  applyFilters()
}

function handleRocketAdded() {
  snackbar.message = 'Rocket added successfully!'
  snackbar.color = 'success'
  snackbar.show = true
}

onMounted(() => {
  if (rocketsStore.rockets.length === 0) {
    loadRockets()
  }
})
</script>

