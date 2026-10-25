<template>
  <v-card
    class="pa-4 mb-6 rounded-lg"
    elevation="1"
    border
  >
    <v-row
      dense
      align="center"
    >
      <!-- Search Field -->
      <v-col
        cols="12"
        md="5"
      >
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search Rockets"
          placeholder="Search by name, variant, or description..."
          density="comfortable"
          variant="outlined"
          hide-details
          clearable
          @update:model-value="onSearchChange"
        />
      </v-col>

      <!-- Status Filter -->
      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <v-select
          v-model="status"
          :items="statusOptions"
          item-title="title"
          item-value="value"
          label="Status"
          density="comfortable"
          variant="outlined"
          prepend-inner-icon="mdi-filter-variant"
          hide-details
          @update:model-value="onStatusChange"
        />
      </v-col>

      <!-- Family Filter -->
      <v-col
        cols="12"
        sm="6"
        md="3"
      >
        <v-select
          v-model="family"
          :items="familyOptions"
          label="Rocket Family"
          density="comfortable"
          variant="outlined"
          prepend-inner-icon="mdi-rocket"
          hide-details
          @update:model-value="onFamilyChange"
        />
      </v-col>

      <!-- Reset button if active filters -->
      <v-col
        cols="12"
        md="1"
        class="text-right d-none d-md-block"
      >
        <v-btn
          v-if="hasActiveFilters"
          icon="mdi-filter-remove"
          variant="text"
          color="medium-emphasis"
          title="Reset Filters"
          @click="resetFilters"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRocketStore } from '@/stores/rocket'

const store = useRocketStore()

const search = ref(store.searchQuery)
const status = ref(store.statusFilter)
const family = ref(store.familyFilter)

const statusOptions = [
  { title: 'All Statuses', value: 'all' },
  { title: 'Active', value: 'active' },
  { title: 'Retired', value: 'retired' },
]

const familyOptions = computed(() => {
  return ['all', ...store.availableFamilies]
})

const hasActiveFilters = computed(() => {
  return search.value || status.value !== 'all' || family.value !== 'all'
})

function onSearchChange(val: string | null) {
  store.searchQuery = val || ''
}

function onStatusChange(val: 'all' | 'active' | 'retired') {
  store.statusFilter = val || 'all'
}

function onFamilyChange(val: string) {
  store.familyFilter = val || 'all'
}

function resetFilters() {
  search.value = ''
  status.value = 'all'
  family.value = 'all'
  store.searchQuery = ''
  store.statusFilter = 'all'
  store.familyFilter = 'all'
}
</script>
