<template>
  <v-card
    class="mb-6 pa-4 rounded-xl border"
    elevation="1"
  >
    <v-row
      align="center"
      dense
    >
      <!-- Search Input -->
      <v-col
        cols="12"
        md="5"
      >
        <v-text-field
          v-model="searchQuery"
          clearable
          density="comfortable"
          hide-details
          placeholder="Search by rocket name, specs..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
        />
      </v-col>

      <!-- Country Filter -->
      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <v-select
          v-model="selectedCountry"
          density="comfortable"
          hide-details
          :items="countryOptions"
          label="Country"
          prepend-inner-icon="mdi-earth"
          variant="outlined"
        />
      </v-col>

      <!-- Sort By -->
      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <v-select
          v-model="sortBy"
          density="comfortable"
          hide-details
          :items="sortOptions"
          label="Sort By"
          prepend-inner-icon="mdi-sort"
          variant="outlined"
        />
      </v-col>

      <!-- Reset / Clear Action -->
      <v-col
        cols="12"
        md="1"
        class="d-flex justify-end"
      >
        <v-tooltip
          location="top"
          text="Reset filters"
        >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              color="secondary"
              icon="mdi-filter-off-outline"
              size="small"
              variant="tonal"
              :disabled="!isFiltered"
              @click="onReset"
            />
          </template>
        </v-tooltip>
      </v-col>
    </v-row>

    <!-- Filter Meta summary -->
    <div class="d-flex align-center justify-space-between mt-3 px-1">
      <div class="text-caption text-medium-emphasis">
        Showing <strong>{{ count }}</strong> of <strong>{{ total }}</strong> rockets
      </div>

      <div
        v-if="isFiltered"
        class="d-flex ga-1 align-center"
      >
        <v-chip
          v-if="searchQuery"
          closable
          density="compact"
          size="x-small"
          variant="outlined"
          @click:close="searchQuery = ''"
        >
          "{{ searchQuery }}"
        </v-chip>
        <v-chip
          v-if="selectedCountry !== 'all'"
          closable
          density="compact"
          size="x-small"
          variant="outlined"
          @click:close="selectedCountry = 'all'"
        >
          Country: {{ selectedCountry }}
        </v-chip>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRockets } from '@/composables/useRockets'

defineProps<{
  count: number
  total: number
}>()

const { searchQuery, selectedCountry, sortBy, availableCountries, resetFilters } = useRockets()

const countryOptions = computed(() => [
  { title: 'All Countries', value: 'all' },
  ...availableCountries.value.map(c => ({ title: c, value: c })),
])

const sortOptions = [
  { title: 'Name (A to Z)', value: 'name-asc' },
  { title: 'Name (Z to A)', value: 'name-desc' },
  { title: 'Cost (Low to High)', value: 'cost-asc' },
  { title: 'Cost (High to Low)', value: 'cost-desc' },
  { title: 'Newest First Flight', value: 'date-desc' },
  { title: 'Oldest First Flight', value: 'date-asc' },
]

const isFiltered = computed(() => {
  return searchQuery.value.trim() !== '' || selectedCountry.value !== 'all' || sortBy.value !== 'name-asc'
})

function onReset() {
  resetFilters()
}
</script>
