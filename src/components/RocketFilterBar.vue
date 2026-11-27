<template>
  <v-row
    align="center"
    class="mb-4"
    dense
  >
    <v-col
      cols="12"
      md="5"
    >
      <v-text-field
        clearable
        density="comfortable"
        hide-details
        label="Search rockets by name, description, or country"
        :model-value="search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        @update:model-value="$emit('update:search', $event ?? '')"
      />
    </v-col>

    <v-col
      cols="12"
      md="4"
      sm="7"
    >
      <v-select
        density="comfortable"
        hide-details
        :items="filterOptions"
        label="Filter rockets"
        :model-value="availability"
        prepend-inner-icon="mdi-filter-variant"
        variant="outlined"
        @update:model-value="$emit('update:availability', $event)"
      />
    </v-col>

    <v-col
      class="d-flex justify-sm-end ga-2"
      cols="12"
      md="3"
      sm="5"
    >
      <v-btn
        block
        color="primary"
        height="48"
        prepend-icon="mdi-plus"
        variant="flat"
        @click="$emit('add')"
      >
        Add Rocket
      </v-btn>
    </v-col>
  </v-row>

  <div class="d-flex align-center justify-space-between mb-4">
    <span class="text-body-2 text-medium-emphasis">
      Showing <strong>{{ filteredCount }}</strong> of <strong>{{ totalCount }}</strong> rockets
    </span>

    <v-btn
      v-if="hasActiveFilter"
      color="primary"
      density="compact"
      variant="text"
      @click="$emit('reset')"
    >
      Reset filters
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import type { DataAvailabilityFilter } from '@/stores/rockets'

  interface Props {
    search: string
    availability: DataAvailabilityFilter
    totalCount: number
    filteredCount: number
  }

  const props = defineProps<Props>()

  defineEmits<{
    'update:search': [value: string]
    'update:availability': [value: DataAvailabilityFilter]
    'add': []
    'reset': []
  }>()

  const filterOptions: { title: string, value: DataAvailabilityFilter }[] = [
    { title: 'All Rockets', value: 'all' },
    { title: 'Has Cost per Launch', value: 'has_cost' },
    { title: 'Has First Flight Date', value: 'has_flight' },
  ]

  const hasActiveFilter = computed(
    () => props.search.trim().length > 0 || props.availability !== 'all',
  )
</script>