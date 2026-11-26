<template>
  <v-container class="page-container py-8">
    <header class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-4 mb-6">
      <div>
        <p class="text-overline text-primary mb-1">Launch Library 2</p>
        <h1 class="text-h4 font-weight-bold mb-2">SpaceX rocket fleet</h1>
        <p class="text-body-1 text-medium-emphasis mb-0">
          Browse every SpaceX launch vehicle, search the fleet, and inspect mission details.
        </p>
      </div>

      <v-btn
        color="primary"
        size="large"
        prepend-icon="mdi-plus"
        class="flex-shrink-0"
        @click="showAddDialog = true"
      >
        Add rocket
      </v-btn>
    </header>

    <v-alert
      v-if="store.error && store.rockets.length"
      type="warning"
      variant="tonal"
      closable
      class="mb-6"
      @click:close="store.clearError()"
    >
      {{ store.error }}
      <template #append>
        <v-btn variant="text" size="small" @click="store.fetchRockets(true)">Retry</v-btn>
      </template>
    </v-alert>

    <LoadingState v-if="isInitialLoading" message="Loading SpaceX rockets..." />

    <ErrorState
      v-else-if="isInitialError"
      title="Could not load rockets"
      :message="store.error ?? undefined"
      @retry="store.fetchRockets(true)"
    />

    <template v-else>
      <RocketFilter
        v-model:search="search"
        v-model:country="country"
        :countries="countries"
        :result-count="filteredRockets.length"
        :total-count="store.rockets.length"
        class="mb-6"
        @reset="resetFilters"
      />

      <div v-if="filteredRockets.length" class="rocket-grid">
        <RocketCard
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          :rocket="rocket"
        />
      </div>

      <v-card v-else class="state-panel text-center pa-10" variant="flat">
        <v-icon icon="mdi-rocket-launch-outline" size="56" color="primary" class="mb-4" />
        <h2 class="text-h6 mb-2">No rockets found</h2>
        <p class="text-body-2 text-medium-emphasis mb-6">
          No rockets match your filters. Try a different search term or country.
        </p>
        <v-btn variant="tonal" prepend-icon="mdi-filter-remove-outline" @click="resetFilters">
          Clear filters
        </v-btn>
      </v-card>
    </template>

    <AddRocketDialog v-model="showAddDialog" @submit="handleAddRocket" />

    <v-snackbar v-model="snackbar" color="success" timeout="3000" location="bottom right">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import AddRocketDialog from '@/components/AddRocketDialog.vue'
import ErrorState from '@/components/ErrorState.vue'
import LoadingState from '@/components/LoadingState.vue'
import RocketCard from '@/components/RocketCard.vue'
import RocketFilter from '@/components/RocketFilter.vue'
import { useRocketStore } from '@/stores/rocketStore'
import type { NewRocketInput, Rocket } from '@/types/rocket'

const store = useRocketStore()

const search = ref('')
const country = ref('all')
const showAddDialog = ref(false)
const snackbar = ref(false)
const snackbarMessage = ref('')

const isInitialLoading = computed(() => store.loading && store.rockets.length === 0)
const isInitialError = computed(() => Boolean(store.error) && store.rockets.length === 0)

const countries = computed(() => {
  const codes = new Set<string>()

  for (const rocket of store.rockets) {
    const code = rocket.manufacturer?.country_code?.trim()
    if (code) codes.add(code)
  }

  return [...codes].sort((a, b) => a.localeCompare(b))
})

const filteredRockets = computed(() => {
  const term = search.value.trim().toLowerCase()

  return store.rockets.filter((rocket) => {
    const matchesCountry =
      country.value === 'all' || rocket.manufacturer?.country_code === country.value

    if (!matchesCountry) return false
    if (!term) return true

    return [rocket.full_name, rocket.name, rocket.description, rocket.manufacturer?.country_code]
      .filter(Boolean)
      .some(value => String(value).toLowerCase().includes(term))
  })
})

function resetFilters() {
  search.value = ''
  country.value = 'all'
}

function handleAddRocket(input: NewRocketInput) {
  const rocket: Rocket = store.addRocket(input)

  resetFilters()
  snackbarMessage.value = `${rocket.full_name ?? 'Rocket'} was added to the list.`
  snackbar.value = true
}

onMounted(() => {
  store.fetchRockets()
})
</script>
