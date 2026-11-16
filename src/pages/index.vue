<script setup lang="ts">
/**
 * Rocket list screen.
 * All data and request state live in the store; this page only wires the UI.
 */

// Composables
import { computed, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Components
import AppState from '@/components/AppState.vue'
import RocketCard from '@/components/RocketCard.vue'
import RocketCardSkeleton from '@/components/RocketCardSkeleton.vue'
import RocketFilter from '@/components/RocketFilter.vue'
import RocketFormDialog from '@/components/RocketFormDialog.vue'

// Utilities
import { useRocketsStore } from '@/stores/rockets'

// Types
import type { NewRocket } from '@/types/rocket'

const store = useRocketsStore()
const {
  rockets,
  filteredRockets,
  status,
  error,
  search,
  isFiltering,
  hasRockets,
  hasResults,
} = storeToRefs(store)

const formOpen = ref(false)
const snackbar = reactive({ open: false, message: '' })

const isEmpty = computed(() => status.value === 'success' && !hasResults.value)

const emptyTitle = computed(() =>
  isFiltering.value
    ? 'No rockets match your filter'
    : 'No rockets available'
)

const emptyText = computed(() =>
  isFiltering.value
    ? 'Try a different keyword, or clear the filter to see every rocket.'
    : 'The API did not return any rockets. Please try again later.'
)

const summary = computed(() => {
  if (status.value !== 'success') {
    return 'Explore the SpaceX fleet, from Falcon 1 to Starship.'
  }

  if (isFiltering.value) {
    return `Showing ${filteredRockets.value.length} of ${rockets.value.length} rockets.`
  }

  return `${rockets.value.length} rockets in the fleet.`
})

onMounted(() => {
  store.fetchRockets()
})

function handleAddRocket (rocket: NewRocket) {
  const created = store.addRocket(rocket)

  formOpen.value = false
  snackbar.message = `${created.full_name} was added to the list.`
  snackbar.open = true
}
</script>

<template>
  <v-container
    class="py-6 py-md-8"
    max-width="1200"
  >
    <header class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">
          SpaceX rockets
        </h1>
        <p class="text-body-2 text-medium-emphasis mt-1">
          {{ summary }}
        </p>
      </div>

      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        size="large"
        variant="flat"
        @click="formOpen = true"
      >
        Add rocket
      </v-btn>
    </header>

    <div
      v-if="status === 'success' && hasRockets"
      class="mb-6 rocket-filter"
    >
      <RocketFilter
        v-model="search"
        @clear="store.resetFilters()"
      />
    </div>

    <AppState
      :empty="isEmpty"
      :empty-text="emptyText"
      :empty-title="emptyTitle"
      :error="error"
      :status="status"
      loading-text="Loading rockets…"
      @retry="store.fetchRockets(true)"
    >
      <template #loading>
        <RocketCardSkeleton :count="6" />
      </template>

      <template #empty-action>
        <v-btn
          v-if="isFiltering"
          color="primary"
          prepend-icon="mdi-filter-off"
          variant="tonal"
          @click="store.resetFilters()"
        >
          Clear filter
        </v-btn>
      </template>

      <v-row>
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          md="4"
          sm="6"
        >
          <RocketCard
            :rocket="rocket"
            :to="`/rockets/${rocket.id}`"
          />
        </v-col>
      </v-row>
    </AppState>

    <RocketFormDialog
      v-model="formOpen"
      @submit="handleAddRocket"
    />

    <v-snackbar
      v-model="snackbar.open"
      color="success"
      location="bottom"
      :timeout="3000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<style scoped>
.rocket-filter {
  max-width: 480px;
}
</style>


