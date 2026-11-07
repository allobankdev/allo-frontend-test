
<template>
  <v-card variant="outlined" class="pa-4 mb-6">
    <v-row align="center">
      <v-col cols="12" md="4">
        <v-text-field
          :model-value="store.searchQuery"
          label="Search rockets"
          placeholder="Search by name or description"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          clearable
          hide-details
          @update:model-value="store.searchQuery = $event ?? ''"
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="store.countryFilter"
          :items="countryOptions"
          label="Country"
          variant="outlined"
          hide-details
        />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="store.statusFilter"
          :items="statusOptions"
          label="Status"
          variant="outlined"
          hide-details
        />
      </v-col>

      <v-col cols="12" md="2" class="d-flex justify-center">
        <v-btn
          prepend-icon="mdi-filter-off-outline"
          variant="outlined"
          color="primary"
          block
          @click="resetFilters"
        >
          Reset
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'

const store = useRocketStore()

const countryOptions = computed(() => [
  { title: 'All Countries', value: '' },
  ...store.countries.map((country) => ({
    title: country,
    value: country,
  })),
])

const statusOptions = [
  { title: 'All Statuses', value: 'all' },
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
]

function resetFilters() {
  store.searchQuery = ''
  store.countryFilter = ''
  store.statusFilter = 'all'
}
</script>
