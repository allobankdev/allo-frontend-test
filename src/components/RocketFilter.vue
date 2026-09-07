<template>
  <v-card class="pa-4 mb-6" elevation="1">
    <v-row align="center" dense>
      <!-- Search Field -->
      <v-col cols="12" md="6" lg="5">
        <v-text-field
          v-model="store.searchQuery"
          label="Search SpaceX rockets..."
          placeholder="Enter rocket name or description"
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          variant="outlined"
          density="compact"
        ></v-text-field>
      </v-col>

      <!-- Status Filter -->
      <v-col cols="12" sm="6" md="4" lg="4">
        <v-select
          v-model="store.statusFilter"
          :items="statusOptions"
          item-title="title"
          item-value="value"
          label="Filter by Status"
          prepend-inner-icon="mdi-filter-variant"
          hide-details
          variant="outlined"
          density="compact"
        ></v-select>
      </v-col>

      <!-- Actions -->
      <v-col cols="12" sm="6" md="2" lg="3" class="d-flex gap-2 align-center justify-end">
        <v-btn
          variant="outlined"
          color="grey-darken-1"
          density="compact"
          prepend-icon="mdi-refresh"
          @click="store.resetFilters"
          :disabled="!isFiltered"
        >
          Reset Filters
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'

const store = useRocketStore()

const statusOptions = [
  { title: 'All Rockets', value: 'all' },
  { title: 'Active Only', value: 'active' },
  { title: 'Inactive Only', value: 'inactive' },
]

const isFiltered = computed(() => {
  return store.searchQuery !== '' || store.statusFilter !== 'all'
})
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
