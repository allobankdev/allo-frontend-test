
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getRockets } from '../api/rockets'
import type { Rocket } from '../types/rocket'
import RocketCard from '../components/RocketCard.vue'
import { useRocketStore } from '../stores/rockets'
import RocketForm from '../components/RocketForm.vue'

const rockets = ref<Rocket[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const search = ref('')
const selectedCountry = ref('All')
const sortBy = ref('default')

const rocketStore = useRocketStore()

// Combine locally added rockets with API rockets
const allRockets = computed(() => [
  ...rocketStore.localRockets,
  ...rockets.value,
])

const countryOptions = computed(() => {
  const countries = allRockets.value
    .map(rocket => rocket.manufacturer?.country_code)
    .filter((country): country is string => Boolean(country))

  return [
    'All',
    ...new Set(countries),
  ]
})

// Filter all rockets by country
const filteredRockets = computed(() => {
  const query = search.value.trim().toLowerCase()

  let result = allRockets.value.filter(rocket => {
    const matchesSearch = (rocket.full_name || '')
      .toLowerCase()
      .includes(query)

    const matchesCountry =
      selectedCountry.value === 'All' ||
      rocket.manufacturer?.country_code === selectedCountry.value

    return matchesSearch && matchesCountry
  })

  if (sortBy.value === 'name-asc') {
    result = [...result].sort((a, b) =>
      (a.full_name || '').localeCompare(b.full_name || '')
    )
  }

  if (sortBy.value === 'name-desc') {
    result = [...result].sort((a, b) =>
      (b.full_name || '').localeCompare(a.full_name || '')
    )
  }

  return result
})


// Fetch rockets from the API
async function fetchRockets() {
  loading.value = true
  error.value = null

  try {
    rockets.value = await getRockets()
  } catch (err) {
    error.value = err instanceof Error
      ? err.message
      : 'Something went wrong'
  } finally {
    loading.value = false
  }
}

onMounted(fetchRockets)
</script>

<template>
  <v-container class="py-8">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between flex-wrap ga-4 mb-8">
      <div>
        <h1 class="text-h4 font-weight-bold mb-2">
          SpaceX Rockets
        </h1>

        <p class="text-body-1 text-medium-emphasis">
          Explore SpaceX rocket configurations.
        </p>
      </div>

      <RocketForm />
    </div>

    <!-- Search -->
    
    <!-- Search, Filter, and Sort -->
    <v-row class="mb-4">
      <!-- Search -->
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          label="Search rockets"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          clearable
          hide-details
        />
      </v-col>

      <!-- Country Filter -->
      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="selectedCountry"
          :items="countryOptions"
          label="Filter by Country"
          prepend-inner-icon="mdi-filter"
          variant="outlined"
          hide-details
        />
      </v-col>

      <!-- Sort -->
      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="sortBy"
          :items="[
            { title: 'Default', value: 'default' },
            { title: 'Name (A-Z)', value: 'name-asc' },
            { title: 'Name (Z-A)', value: 'name-desc' }
          ]"
          label="Sort by"
          prepend-inner-icon="mdi-sort"
          variant="outlined"
          hide-details
        />
      </v-col>
    </v-row>

    <div class="d-flex justify-space-between align-center mb-4">
      <p class="text-medium-emphasis">
        Showing {{ filteredRockets.length }} of
        {{ allRockets.length }} rockets
      </p>

      <v-btn
        variant="text"
        color="primary"
        @click="
          search = '';
          selectedCountry = 'All';
          sortBy = 'default'
        "
      >
        Clear Filters
      </v-btn>
    </div>

    <!-- Loading -->
    <v-row v-if="loading && !allRockets.length">
      <v-col
        v-for="n in 6"
        :key="n"
        cols="12"
        sm="6"
        md="4"
      >
        <v-skeleton-loader
          type="image, article, actions"
        />
      </v-col>
    </v-row>

    <template v-else>
      <!-- API error, without hiding local rockets -->
      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        class="mb-6"
      >
        {{ error }}

        <div class="mt-3">
          <v-btn
            color="error"
            variant="outlined"
            @click="fetchRockets"
          >
            Retry
          </v-btn>
        </div>
      </v-alert>

      <!-- Rocket cards -->
      <v-row v-if="filteredRockets.length">
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
        >
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>

      <!-- Empty state -->
      <v-alert
        v-else-if="!error"
        type="info"
        variant="tonal"
      >
        No rockets found. Try another search.
      </v-alert>
    </template>
  </v-container>
</template>
